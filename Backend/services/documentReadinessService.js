const Document = require("../models/Document");
const Business = require("../models/Business");
const Approval = require("../models/Approval");
const DocumentTemplate = require("../models/DocumentTemplate");
const VerificationResult = require("../models/VerificationResult");

const DISCLAIMER = "This is a rule-based pre-submission completeness assessment based on configured checklist data. It is not a government verification, legal opinion, or approval decision. Confirm current requirements with the relevant authority before filing.";
const FALLBACK_SOURCE = "Prototype validation rule; confirm current applicability with the competent authority.";

class DocumentReadinessService {
    normalizeString(value) { return String(value || "").toLowerCase().replace(/[^a-z0-9]/g, ""); }

    getNestedBusinessField(business, fieldPath) {
        if (!fieldPath) return undefined;
        const value = fieldPath.split(".").reduce((current, key) => current == null ? undefined : current[key], business);
        if (value === undefined && fieldPath === "investment.totalCapitalInvestment" && typeof business.investment === "number") return business.investment;
        return value;
    }

    getInputValue(inputs, id) {
        return inputs?.[id];
    }

    isProvided(value) { return value !== undefined && value !== null && value !== ""; }

    isApplicable(question, business) {
        const condition = question.validation?.appliesWhen;
        if (!condition?.businessField) return true;
        const actual = this.getNestedBusinessField(business, condition.businessField);
        if (condition.operator === "GREATER_THAN") return Number(actual) > Number(condition.equals);
        if (condition.operator === "EQUALS" || !condition.operator) return actual === condition.equals;
        return true;
    }

    validateFile(document, template) {
        const allowed = template.allowedMimeTypes?.length ? template.allowedMimeTypes : ["application/pdf", "image/jpeg", "image/png"];
        const maxBytes = (template.maxFileSizeMB || 20) * 1024 * 1024;
        const passed = allowed.includes(document.mimeType) && Number(document.sizeBytes || document.size || 0) <= maxBytes;
        return {
            id: "file",
            label: "File format and size accepted",
            mandatory: true,
            weight: 10,
            status: passed ? "PASS" : "FAIL",
            passed,
            actualValue: `${document.mimeType || "unknown"}, ${document.sizeBytes || document.size || 0} bytes`,
            expectedValue: `${allowed.join(", ")}, maximum ${template.maxFileSizeMB || 20} MB`,
            message: passed ? "Uploaded file meets the configured metadata rules." : "Only configured file types within the maximum size are accepted.",
            recommendation: "Upload a PDF, JPG, JPEG, or PNG file within the configured size limit.",
            source: template.source?.title || FALLBACK_SOURCE,
            needsManualReview: false
        };
    }

    validateQuestion(question, userInputs = {}, business) {
        const actualValue = this.getInputValue(userInputs, question.id);
        const validation = question.validation || {};
        let passed = false;
        let message = question.failureMessage || "This checklist item is not complete.";
        let expectedValue = validation.expectedValue;
        const numericValue = this.isProvided(actualValue) && Number.isFinite(Number(actualValue)) ? Number(actualValue) : null;

        switch (validation.type) {
            case "MATCH_BUSINESS_NAME":
            case "MATCH_BUSINESS_FIELD": {
                const expected = this.getNestedBusinessField(business, validation.businessField);
                expectedValue = expected;
                passed = this.isProvided(actualValue) && this.normalizeString(actualValue) === this.normalizeString(expected);
                break;
            }
            case "TOLERANCE_MATCH": {
                const expected = Number(this.getNestedBusinessField(business, validation.businessField));
                expectedValue = expected;
                passed = numericValue !== null && Number.isFinite(expected) && expected !== 0 && Math.abs(numericValue - expected) / Math.abs(expected) <= (validation.tolerancePercent || 0) / 100;
                break;
            }
            case "NOT_FUTURE_DATE":
                passed = this.isProvided(actualValue) && !Number.isNaN(Date.parse(actualValue)) && new Date(actualValue) <= new Date();
                expectedValue = "A valid date that is not in the future";
                break;
            case "REGEX":
                passed = this.isProvided(actualValue) && new RegExp(validation.regex || ".*").test(String(actualValue));
                expectedValue = validation.regex;
                break;
            case "GREATER_THAN_ZERO":
                passed = numericValue !== null && numericValue > 0;
                expectedValue = "> 0";
                break;
            case "GREATER_THAN_OR_EQUAL_ZERO":
                passed = numericValue !== null && numericValue >= 0;
                expectedValue = ">= 0";
                break;
            case "EQUALS":
                passed = actualValue === validation.expectedValue || String(actualValue) === String(validation.expectedValue);
                break;
            case "PROVIDED":
            default:
                passed = this.isProvided(actualValue);
                expectedValue = expectedValue || "A value is required";
        }

        return {
            id: question.id,
            label: question.label,
            mandatory: Boolean(question.mandatory),
            weight: Number(question.weight || 0),
            status: question.needsManualReview ? "NEEDS_MANUAL_REVIEW" : passed ? "PASS" : this.isProvided(actualValue) ? "FAIL" : "NOT_PROVIDED",
            passed,
            actualValue,
            expectedValue,
            message: passed ? "Checklist item passed." : message,
            recommendation: question.recommendation || "Review this checklist item before filing.",
            source: question.source || FALLBACK_SOURCE,
            needsManualReview: Boolean(question.needsManualReview)
        };
    }

    createGeneratedCheck(id, label, mandatory, weight, passed, actualValue, expectedValue, message, recommendation, needsManualReview = false) {
        return { id, label, mandatory, weight, status: needsManualReview ? "NEEDS_MANUAL_REVIEW" : passed ? "PASS" : this.isProvided(actualValue) ? "FAIL" : "NOT_PROVIDED", passed, actualValue, expectedValue, message, recommendation, source: FALLBACK_SOURCE, needsManualReview };
    }

    addGeneratedChecks(template, inputs, business, checks) {
        if (template.code === "MASS_BALANCE") {
            const input = Number(inputs.totalInputKg); const product = Number(inputs.productOutputKg ?? inputs.totalProductOutputKg); const byProduct = Number(inputs.byProductOutputKg ?? inputs.totalByProductOutputKg); const waste = Number(inputs.wasteOutputKg ?? inputs.totalWasteOutputKg); const loss = Number(inputs.processLossKg ?? inputs.totalLossKg);
            const valid = [input, product, byProduct, waste, loss].every(Number.isFinite) && input > 0;
            const totalOutput = valid ? product + byProduct + waste + loss : null;
            const balancePercentage = valid ? totalOutput / input * 100 : null;
            checks.push(this.createGeneratedCheck("balanceWithinTolerance", "Mass balance is between 98% and 102%", true, 10, balancePercentage !== null && balancePercentage >= 98 && balancePercentage <= 102, balancePercentage, "98-102%", balancePercentage === null ? "Provide all mass-balance quantities to calculate this check." : `Computed balance: ${balancePercentage.toFixed(2)}%.`, "Reconcile product, by-product, waste, and process-loss quantities."));
            return { totalOutputKg: totalOutput, balancePercentage };
        }
        if (template.code === "ETP_PROPOSAL") {
            const capacity = Number(inputs.proposedETPCapacityKLD); const effluent = Number(this.getNestedBusinessField(business, "pollution.effluentGeneration"));
            checks.push(this.createGeneratedCheck("etpCapacityConsistency", "ETP capacity covers stated effluent generation", true, 25, Number.isFinite(capacity) && Number.isFinite(effluent) && capacity >= effluent, capacity, effluent, "Capacity consistency check passed based on values entered by the user. Engineering design adequacy and regulatory acceptance require review by the competent authority.", "Increase or reconcile the proposed ETP capacity with stated effluent generation."));
        }
        return null;
    }

    calculateScore(checks) {
        const applicable = checks.filter(check => check.applicable !== false);
        const total = applicable.reduce((sum, check) => sum + Number(check.weight || 0), 0);
        const passed = applicable.reduce((sum, check) => sum + (check.passed ? Number(check.weight || 0) : 0), 0);
        return total ? Math.round(passed / total * 100) : 0;
    }

    determineStatus(score, checks) {
        const mandatoryFailures = checks.some(check => check.mandatory && check.applicable !== false && !check.passed && !check.needsManualReview);
        const manualReview = checks.some(check => check.mandatory && check.needsManualReview);
        if (manualReview) return "NEEDS_MANUAL_REVIEW";
        if (mandatoryFailures) return score < 40 ? "NOT_READY" : "NEEDS_MAJOR_FIXES";
        if (score >= 90) return "READY";
        if (score >= 70) return "NEEDS_MINOR_FIXES";
        if (score >= 40) return "NEEDS_MAJOR_FIXES";
        return "NOT_READY";
    }

    generateIssues(checks) {
        return checks.filter(check => !check.passed || check.needsManualReview).map(check => ({ severity: check.mandatory ? "CRITICAL" : "WARNING", title: check.label, message: check.message, action: check.recommendation }));
    }

    generateRecommendations(checks) { return checks.filter(check => !check.passed || check.needsManualReview).map(check => check.recommendation); }

    async resolveTemplate(document) {
        if (document.documentCode) return DocumentTemplate.findOne({ code: document.documentCode });
        return DocumentTemplate.findOne({ name: document.documentName || document.documentType });
    }

    async checkDocument(documentId, businessId, overrides = {}) {
        const document = await Document.findById(documentId);
        if (!document) throw new Error("Document not found");
        const business = await Business.findById(businessId || document.businessId || document.businessProfileId);
        if (!business) throw new Error("Business not found");
        const template = await this.resolveTemplate(document);
        if (!template) throw new Error(`No document template configured for ${document.documentType}`);
        const inputs = overrides.userInputs || document.userInputs || document.manualFields || {};
        const fileCheck = this.validateFile(document, template);
        if (!fileCheck.passed) throw new Error(fileCheck.message);
        const checks = [];
        template.questions.forEach(question => {
            const check = this.validateQuestion(question, inputs, business);
            check.applicable = true;
            checks.push(check);
        });
        const score = this.calculateScore(checks);
        const result = {
            documentId: document._id, businessId: business._id, approvalCode: template.approvalCode, documentCode: template.code,
            verificationMode: "RULE_BASED_CHECKLIST", completenessScore: score, overallScore: score,
            status: this.determineStatus(score, checks), checks, issues: this.generateIssues(checks), recommendations: this.generateRecommendations(checks),
            disclaimer: DISCLAIMER, disclaimers: [DISCLAIMER], source: template.source, lastVerified: template.source?.lastVerified
        };
        return VerificationResult.findOneAndUpdate({ documentId: document._id }, result, { upsert: true, new: true, setDefaultsOnInsert: true });
    }

    async createApprovalReadinessReport(businessId, approvalCode) {
        const business = await Business.findById(businessId);
        const approval = await Approval.findOne({ code: approvalCode });
        if (!business || !approval) throw new Error("Business or approval not found");
        const templates = await DocumentTemplate.find({ code: { $in: approval.requiredDocumentCodes } });
        const documents = await Document.find({ businessId, documentCode: { $in: approval.requiredDocumentCodes } }).sort({ createdAt: -1 });
        const latest = new Map(); documents.forEach(document => { if (!latest.has(document.documentCode)) latest.set(document.documentCode, document); });
        const results = await VerificationResult.find({ businessId, documentCode: { $in: approval.requiredDocumentCodes } });
        const resultByCode = new Map(results.map(result => [result.documentCode, result]));
        const entries = templates.map(template => ({ code: template.code, name: template.name, mandatory: template.mandatory, document: latest.get(template.code) || null, result: resultByCode.get(template.code) || null }));
        const scores = entries.filter(entry => entry.result).map(entry => entry.result.completenessScore ?? entry.result.overallScore);
        const missing = entries.filter(entry => !entry.document).map(entry => entry.name);
        const blockers = entries.flatMap(entry => (entry.result?.issues || []).filter(issue => issue.severity === "CRITICAL").map(issue => ({ document: entry.name, ...issue })));
        const aggregateScore = Math.round(scores.length ? scores.reduce((sum, score) => sum + score, 0) / templates.length : 0);
        return { businessId, approvalCode, approval, totalMandatoryDocuments: templates.filter(template => template.mandatory).length, uploadedDocuments: entries.filter(entry => entry.document).length, documentsReady: entries.filter(entry => entry.result?.status === "READY").length, missingDocuments: missing, documentScores: entries.map(entry => ({ code: entry.code, name: entry.name, score: entry.result?.completenessScore ?? null, status: entry.result?.status || "NOT_PROVIDED" })), aggregateScore, status: missing.length || blockers.length ? "NEEDS_MAJOR_FIXES" : aggregateScore >= 90 ? "READY" : "NEEDS_MINOR_FIXES", blockingIssues: blockers, nextBestAction: missing[0] ? `Complete the ${missing[0]} checklist.` : blockers[0]?.action || "Review the remaining document checklist items.", disclaimer: DISCLAIMER };
    }

    getNextBestAction(report) { return report.nextBestAction; }
}

module.exports = new DocumentReadinessService();
