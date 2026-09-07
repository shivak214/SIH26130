const Document = require("../models/Document");
const Business = require("../models/Business");
const VerificationResult = require("../models/VerificationResult");

const SOURCE = "Prototype checklist item; requires official validation";
const provided = value => value !== undefined && value !== null && value !== "";
const number = value => provided(value) && Number.isFinite(Number(value)) ? Number(value) : null;
const normalized = value => String(value || "").toLowerCase().replace(/[^a-z0-9]/g, "");
const bool = value => value === true || value === "true";

function makeCheck(id, label, mandatory, weight, passed, actualValue, expectedValue, message, options = {}) {
    return {
        id, label, mandatory, weight,
        status: options.needsManualReview ? "NEEDS_MANUAL_REVIEW" : passed === true ? "PASS" : provided(actualValue) ? "FAIL" : "NOT_PROVIDED",
        passed: passed === true, actualValue, expectedValue, message,
        source: options.source || SOURCE, needsManualReview: Boolean(options.needsManualReview)
    };
}

class DocumentVerificationService {
    getRequiredChecklist(documentType) {
        const type = String(documentType || "").toLowerCase();
        const file = (id, label, weight = 10, mandatory = true) => ({ id, label, mandatory, weight });
        if (type.includes("ca certificate")) return [
            file("file", "File uploaded and allowed format"), file("companyName", "Company name entered", 15), file("companyNameMatch", "Company name matches business", 20),
            file("capitalInvestment", "Capital investment entered and numeric", 15), file("capitalInvestmentMatch", "Capital investment matches business within 5%", 20),
            file("certificateDate", "Certificate date entered and not in future", 5), file("caMembershipNumber", "CA membership number entered", 5), file("caMembershipFormat", "CA membership number is six digits", 5),
            { ...file("caSignature", "CA signature marked as present", 3), source: "Self-declared; manual confirmation required" },
            { ...file("udin", "UDIN marked as present", 2, false), source: "Self-declared; manual confirmation required" }
        ];
        if (type.includes("land ownership") || type.includes("midc allotment") || type.includes("lease")) return [
            file("file", "File uploaded and allowed format"), file("ownerOrLesseeName", "Owner/lessee name provided", 15), file("ownerMatch", "Owner/lessee matches business or authorized entity", 20),
            file("plotNumber", "Plot number provided and matches business", 20), file("landArea", "Land area provided"), file("location", "Location contains business district", 15),
            file("registrationNumber", "Registration/allotment number provided", 5), file("documentDate", "Date provided and not future", 5)
        ];
        if (type.includes("site plan")) return [
            file("file", "File uploaded and allowed format"), file("plotBoundaryMarked", "Plot boundary marked", 15), file("buildingLocationMarked", "Building/process area marked", 15), file("roadAccessShown", "Road access shown"),
            file("roadWidthMeters", "Road width entered", 5), file("effluentDischargePointMarked", "Effluent discharge point marked", 15), file("emissionStackLocationMarked", "Emission stack location marked", 15),
            file("northDirectionMarked", "North direction marked", 5, false), file("technicalReview", "Manual professional drawing review required", 10)
        ];
        if (type.includes("process flow")) return [
            file("file", "File uploaded and allowed format"), file("rawMaterialsListed", "Raw materials listed", 15), file("manufacturingStepsListed", "Manufacturing steps listed", 15), file("productListed", "Final product listed"),
            file("effluentGenerationPointsListed", "Effluent generation points listed", 15), file("airEmissionPointsListed", "Air-emission points listed"), file("hazardousWastePointsListed", "Hazardous-waste generation points listed"),
            file("solventsListed", "Solvents/chemicals listed"), file("pollutionControlLinkageShown", "Pollution-control linkage shown", 5, false)
        ];
        if (type.includes("mass balance")) return [
            file("file", "File uploaded"), file("totalInputKg", "Total input entered and greater than zero", 15), file("totalProductOutputKg", "Product output entered", 15), file("totalWasteOutputKg", "Waste output entered", 15),
            file("unitsConsistent", "Units marked consistent"), file("solventRecoveryMentioned", "Solvent recovery disclosed"), file("balancePercentage", "Balance percentage is between 98 and 102", 20), file("technicalReview", "Manual technical review required", 5)
        ];
        if (type.includes("etp")) return [
            file("file", "File uploaded"), file("proposedETPCapacityKLD", "Proposed ETP capacity entered", 15), file("capacityMatch", "ETP capacity covers stated effluent", 20), file("treatmentStages", "Treatment stages described", 15),
            file("sludgeManagementMentioned", "Sludge-management plan mentioned"), file("disposalPathMentioned", "Treated-effluent disposal/reuse path mentioned"), file("authorizedConsultantDetailsProvided", "Consultant/design details provided", 5, false), file("engineeringReview", "Manual engineering review required", 15)
        ];
        return [file("file", `Checklist for ${documentType || "document"}`)];
    }

    validateFile(document) {
        const allowed = new Set(["application/pdf", "image/jpeg", "image/png"]);
        const passed = allowed.has(document.mimeType) && Number(document.size) <= 20 * 1024 * 1024;
        return { passed, actualValue: `${document.mimeType || "unknown"}, ${document.size || 0} bytes`, expectedValue: "PDF/JPG/PNG, maximum 20 MB" };
    }

    validateManualFields(documentType, manualFields = {}, business = {}, document = this.currentDocument) {
        const fields = typeof manualFields === "string" ? JSON.parse(manualFields || "{}") : manualFields;
        const result = {};
        const add = (id, passed, actual, expected, message, options = {}) => {
            const rule = this.getRequiredChecklist(documentType).find(item => item.id === id) || { label: id, mandatory: true, weight: 0 };
            result[id] = makeCheck(id, rule.label, rule.mandatory, rule.weight, passed, actual, expected, message, options);
        };
        const businessName = business.businessName || "";
        const businessInvestment = number(business.investment?.totalCapitalInvestment ?? business.investment);
        const location = business.location || {};
        const dateIsValid = value => provided(value) && !Number.isNaN(Date.parse(value)) && new Date(value) <= new Date();
        const type = String(documentType || "").toLowerCase();
        const file = this.validateFile(document);
        add("file", file.passed, file.actualValue, file.expectedValue, file.passed ? "File type and size accepted." : "Only PDF, JPG, and PNG files up to 20 MB are accepted.");

        if (type.includes("ca certificate")) {
            const investment = number(fields.capitalInvestmentCrore);
            add("companyName", provided(fields.companyName), fields.companyName, "Company name", "Enter the company name.");
            add("companyNameMatch", provided(fields.companyName) && normalized(fields.companyName) === normalized(businessName), fields.companyName, businessName, "Company name must match the business profile.");
            add("capitalInvestment", investment !== null, fields.capitalInvestmentCrore, "Numeric crore value", "Enter a numeric investment value.");
            add("capitalInvestmentMatch", investment !== null && businessInvestment !== null && Math.abs(investment - businessInvestment) / businessInvestment <= 0.05, investment, businessInvestment, "Investment must be within 5% of the business profile.");
            add("certificateDate", dateIsValid(fields.certificateDate), fields.certificateDate, "Valid date not in the future", "Enter a valid certificate date.");
            add("caMembershipNumber", provided(fields.caMembershipNumber), fields.caMembershipNumber, "CA membership number", "Enter the CA membership number.");
            add("caMembershipFormat", /^\d{6}$/.test(String(fields.caMembershipNumber || "")), fields.caMembershipNumber, "Six digits", "The number must contain six digits.");
            add("caSignature", bool(fields.hasCASignature), fields.hasCASignature, true, "Self-declared; manual confirmation required.", { source: "Self-declared; manual confirmation required" });
            add("udin", bool(fields.hasUDIN), fields.hasUDIN, true, "Self-declared; manual confirmation required.", { source: "Self-declared; manual confirmation required" });
        } else if (type.includes("land ownership") || type.includes("midc allotment") || type.includes("lease")) {
            add("ownerOrLesseeName", provided(fields.ownerOrLesseeName), fields.ownerOrLesseeName, "Name", "Enter the owner or lessee name.");
            add("ownerMatch", false, fields.ownerOrLesseeName, businessName, "Manual review required.", { needsManualReview: true });
            add("plotNumber", provided(fields.plotNumber) && normalized(fields.plotNumber) === normalized(location.plotNumber), fields.plotNumber, location.plotNumber, "Plot number must match the business profile.");
            add("landArea", number(fields.landArea) !== null, fields.landArea, "Numeric area", "Enter land area.");
            add("location", provided(fields.location) && normalized(fields.location).includes(normalized(location.district || business.district)), fields.location, location.district || business.district, "Location must include the business district.");
            add("registrationNumber", provided(fields.registrationOrAllotmentNumber), fields.registrationOrAllotmentNumber, "Registration/allotment number", "Enter the registration or allotment number.");
            add("documentDate", dateIsValid(fields.documentDate), fields.documentDate, "Valid date not in the future", "Enter a valid document date.");
        } else if (type.includes("site plan")) {
            ["plotBoundaryMarked", "buildingLocationMarked", "roadAccessShown", "effluentDischargePointMarked", "emissionStackLocationMarked"].forEach(id => add(id, bool(fields[id]), fields[id], true, "Mark this declared site-plan item."));
            add("roadWidthMeters", number(fields.roadWidthMeters) !== null, fields.roadWidthMeters, "Numeric metres", "Technical review required.", { needsManualReview: true });
            add("northDirectionMarked", bool(fields.northDirectionMarked), fields.northDirectionMarked, true, "Recommended site-plan item.");
            add("technicalReview", false, "Pending", "Professional review", "Technical drawing requirements depend on the competent authority and project conditions.", { needsManualReview: true });
        } else if (type.includes("process flow")) {
            ["rawMaterialsListed", "manufacturingStepsListed", "productListed", "effluentGenerationPointsListed", "airEmissionPointsListed", "hazardousWastePointsListed", "solventsListed"].forEach(id => add(id, bool(fields[id]), fields[id], true, "Mark this process-flow item."));
            add("pollutionControlLinkageShown", bool(fields.pollutionControlLinkageShown), fields.pollutionControlLinkageShown, true, "Recommended process-flow item.");
        } else if (type.includes("mass balance")) {
            const input = number(fields.totalInputKg); const product = number(fields.totalProductOutputKg); const byProduct = number(fields.totalByProductOutputKg) || 0; const waste = number(fields.totalWasteOutputKg); const loss = number(fields.totalLossKg) || 0;
            const totalOutput = product !== null && waste !== null ? product + byProduct + waste + loss : null;
            const balancePercentage = input > 0 && totalOutput !== null ? totalOutput / input * 100 : null;
            add("totalInputKg", input !== null && input > 0, fields.totalInputKg, "> 0", "Enter total input in consistent units.");
            add("totalProductOutputKg", product !== null, fields.totalProductOutputKg, "Numeric output", "Enter product output.");
            add("totalWasteOutputKg", waste !== null, fields.totalWasteOutputKg, "Numeric output", "Enter waste output.");
            add("unitsConsistent", bool(fields.unitsConsistent), fields.unitsConsistent, true, "Mark units as consistent.");
            add("solventRecoveryMentioned", bool(fields.solventRecoveryMentioned), fields.solventRecoveryMentioned, true, "Disclose solvent recovery.");
            add("balancePercentage", balancePercentage !== null && balancePercentage >= 98 && balancePercentage <= 102, balancePercentage, "98-102%", balancePercentage === null ? "Provide all quantities to calculate the balance." : `Computed balance: ${balancePercentage.toFixed(2)}%.`);
            result.balanceCalculation = { totalOutput, balancePercentage };
            add("technicalReview", false, "Pending", "Technical review", "Manual technical review remains required.", { needsManualReview: true });
        } else if (type.includes("etp")) {
            const capacity = number(fields.proposedETPCapacityKLD); const effluent = number(fields.businessEffluentGenerationKLD ?? business.pollution?.effluentGeneration);
            add("proposedETPCapacityKLD", capacity !== null, fields.proposedETPCapacityKLD, "Numeric KLD", "Enter proposed ETP capacity.");
            add("capacityMatch", capacity !== null && effluent !== null && capacity >= effluent, capacity, effluent, "Capacity consistency check passed based on entered values; engineering and MPCB assessment remain required.");
            add("treatmentStages", provided(fields.treatmentStages), fields.treatmentStages, "Treatment stages", "Describe treatment stages.");
            add("sludgeManagementMentioned", bool(fields.sludgeManagementMentioned), fields.sludgeManagementMentioned, true, "Mention sludge management.");
            add("disposalPathMentioned", bool(fields.disposalPathMentioned), fields.disposalPathMentioned, true, "Mention disposal or reuse path.");
            add("authorizedConsultantDetailsProvided", bool(fields.authorizedConsultantDetailsProvided), fields.authorizedConsultantDetailsProvided, true, "Recommended consultant detail.");
            add("engineeringReview", false, "Pending", "Engineering review", "Do not treat this prototype as an engineering or MPCB approval.", { needsManualReview: true });
        }
        return result;
    }

    calculateChecklistScore(checks) {
        const score = Math.round(checks.reduce((total, item) => total + (item.passed ? item.weight : 0), 0));
        return checks.some(item => item.mandatory && item.needsManualReview) ? Math.min(85, score) : score;
    }
    generateRecommendations(checks) { return checks.filter(item => !item.passed || item.needsManualReview).map(item => item.needsManualReview ? `${item.label}: complete manual confirmation.` : `${item.label}: ${item.message || "provide or correct this item."}`); }
    determineStatus(score, criticalFailures = [], checks = []) {
        if (score >= 90 && criticalFailures.length === 0 && !checks.some(item => item.mandatory && item.needsManualReview)) return "READY";
        if (criticalFailures.length > 0) return "NEEDS_MAJOR_FIXES";
        if (checks.some(item => item.mandatory && item.needsManualReview)) return "NEEDS_MANUAL_REVIEW";
        if (score >= 70) return "NEEDS_MINOR_FIXES";
        return "NOT_READY";
    }

    async checkDocument(documentId, businessId) {
        const document = await Document.findById(documentId);
        if (!document) throw new Error("Document not found");
        const business = await Business.findById(businessId || document.businessId || document.businessProfileId);
        if (!business) throw new Error("Business not found");
        this.currentDocument = document;
        const manualChecks = this.validateManualFields(document.documentType, document.manualFields || {}, business, document);
        const checks = this.getRequiredChecklist(document.documentType).map(rule => manualChecks[rule.id] || makeCheck(rule.id, rule.label, rule.mandatory, rule.weight, false, undefined, undefined, "This item is not provided."));
        const score = this.calculateChecklistScore(checks);
        const criticalFailures = checks.filter(item => item.mandatory && !item.passed && !item.needsManualReview);
        const result = {
            documentId: document._id, businessId: business._id, verificationMode: "RULE_BASED_CHECKLIST", overallScore: score,
            status: this.determineStatus(score, criticalFailures, checks), checks,
            issues: checks.filter(item => !item.passed).map(item => ({ id: item.id, label: item.label, message: item.message, status: item.status })),
            recommendations: this.generateRecommendations(checks),
            disclaimers: ["This score is a completeness score from the checklist items shown below. It is not AI-generated, a government approval decision, or a legal compliance guarantee.", "Verify final requirements on the official department portal."]
        };
        if (manualChecks.balanceCalculation) result.balanceCalculation = manualChecks.balanceCalculation;
        return VerificationResult.findOneAndUpdate({ documentId: document._id }, result, { upsert: true, new: true, setDefaultsOnInsert: true });
    }

    async verifyDocument(documentId, businessId) { return this.checkDocument(documentId, businessId); }
}

module.exports = new DocumentVerificationService();