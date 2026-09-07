const lastVerified = new Date("2026-09-07");
const source = {
    title: "MPCB Information to be submitted with the Application",
    url: "https://mpcb.gov.in/en/consentmgt/water-and-air-act/document",
    lastVerified,
    confidence: "High",
    note: "Confirm the current service-specific form and instructions before filing."
};
const prototypeSource = "Prototype validation rule; confirm current applicability with the competent authority.";
const q = (id, label, type, weight, validation, failureMessage, recommendation, options = {}) => ({ id, label, type, required: options.required !== false, mandatory: options.mandatory !== false, weight, validation, failureMessage, recommendation, helpText: options.helpText, needsManualReview: options.needsManualReview, source: options.source });

const templates = [
    {
        code: "CA_CERTIFICATE", name: "CA Certificate", approvalCode: "MPCB_CTE_PHARMA", industry: "Pharmaceutical API Manufacturing", mandatory: true,
        description: "Capital-investment evidence declared from the CA certificate.", source,
        questions: [
            q("companyName", "Company name", "text", 20, { type: "MATCH_BUSINESS_NAME", businessField: "businessName" }, "The business name entered does not match the business profile.", "Enter the business name exactly as it appears on the certificate and business profile."),
            q("capitalInvestmentCrore", "Capital investment (crore)", "number", 25, { type: "TOLERANCE_MATCH", businessField: "investment.totalCapitalInvestment", tolerancePercent: 5 }, "The capital investment differs from the business profile by more than 5%.", "Reconcile the investment amount with the business profile and CA certificate."),
            q("certificateIssueDate", "Certificate issue date", "date", 10, { type: "NOT_FUTURE_DATE" }, "Certificate date cannot be in the future.", "Enter the actual date on the certificate."),
            q("caMembershipNumber", "CA membership number", "text", 15, { type: "REGEX", regex: "^[0-9]{6}$" }, "Enter a six-digit CA membership number.", "Confirm the membership number shown on the certificate."),
            q("signedAndStamped", "Signed and stamped", "checkbox", 20, { type: "EQUALS", expectedValue: true }, "Signature and stamp have not been confirmed.", "Upload a certificate signed and stamped by the Chartered Accountant."),
            q("udinPresent", "UDIN present", "checkbox", 10, { type: "EQUALS", expectedValue: true }, "UDIN has not been confirmed.", "Manually confirm UDIN details before filing.", { required: false, mandatory: false, needsManualReview: true })
        ]
    },
    {
        code: "LAND_OR_MIDC_DOCUMENT", name: "Land Ownership / MIDC Allotment Document", approvalCode: "MPCB_CTE_PHARMA", industry: "Pharmaceutical API Manufacturing", mandatory: true,
        description: "Evidence of land ownership, lease, or MIDC allotment.", source,
        questions: [
            q("ownerOrLesseeName", "Owner or lessee name", "text", 15, { type: "PROVIDED" }, "Owner or lessee name is required.", "Enter the name shown on the land document.", { needsManualReview: true }),
            q("plotNumber", "Plot number", "text", 25, { type: "MATCH_BUSINESS_FIELD", businessField: "location.plotNumber" }, "Plot number does not match the business profile.", "Reconcile the plot number with the business profile."),
            q("district", "District", "text", 15, { type: "MATCH_BUSINESS_FIELD", businessField: "location.district" }, "District does not match the business profile.", "Enter the district shown in the business profile."),
            q("industrialArea", "Industrial area", "text", 15, { type: "MATCH_BUSINESS_FIELD", businessField: "location.area" }, "Industrial area does not match the business profile.", "Enter the MIDC or industrial area exactly as recorded."),
            q("landArea", "Land area", "number", 10, { type: "GREATER_THAN_ZERO" }, "Land area must be greater than zero.", "Enter the documented land area."),
            q("registrationOrAllotmentNumber", "Registration or allotment number", "text", 10, { type: "PROVIDED" }, "Registration or allotment number is required.", "Enter the document reference number."),
            q("documentDate", "Document date", "date", 10, { type: "NOT_FUTURE_DATE" }, "Document date cannot be in the future.", "Enter the date printed on the document.")
        ]
    },
    {
        code: "SITE_PLAN", name: "Site Plan", approvalCode: "MPCB_CTE_PHARMA", industry: "Pharmaceutical API Manufacturing", mandatory: true,
        description: "Declared completeness of the site and pollution-control layout.", source,
        questions: [
            q("plotBoundaryMarked", "Plot boundary marked", "checkbox", 15, { type: "EQUALS", expectedValue: true }, "Plot boundary has not been confirmed.", "Mark the plot boundary on the drawing."),
            q("buildingOrProcessAreaMarked", "Building or process area marked", "checkbox", 15, { type: "EQUALS", expectedValue: true }, "Building or process area has not been confirmed.", "Mark the relevant building and process areas."),
            q("roadAccessShown", "Road access shown", "checkbox", 10, { type: "EQUALS", expectedValue: true }, "Road access has not been confirmed.", "Show the site access route."),
            q("effluentDischargePointMarked", "Effluent discharge point marked", "checkbox", 15, { type: "EQUALS", expectedValue: true, appliesWhen: { businessField: "pollution.effluentGeneration", operator: "GREATER_THAN", equals: 0 } }, "Effluent discharge point has not been confirmed.", "Mark the declared effluent discharge point."),
            q("emissionStackLocationMarked", "Emission stack location marked", "checkbox", 15, { type: "EQUALS", expectedValue: true, appliesWhen: { businessField: "pollution.airEmissions", equals: true } }, "Emission stack location has not been confirmed.", "Mark emission source and stack locations."),
            q("etpLocationMarked", "ETP location marked", "checkbox", 15, { type: "EQUALS", expectedValue: true, appliesWhen: { businessField: "pollution.effluentGeneration", operator: "GREATER_THAN", equals: 0 } }, "ETP location has not been confirmed.", "Mark the proposed ETP location."),
            q("northDirectionMarked", "North direction marked", "checkbox", 5, { type: "EQUALS", expectedValue: true }, "North direction is recommended but not confirmed.", "Add a north arrow to the drawing.", { required: false, mandatory: false }),
            q("professionalDrawingReviewDeclared", "Professional drawing review declared", "checkbox", 10, { type: "EQUALS", expectedValue: true }, "Professional drawing review remains pending.", "Have the technical drawing reviewed by the appropriate professional.", { needsManualReview: true })
        ]
    },
    {
        code: "PROCESS_FLOW_DIAGRAM", name: "Process Flow Diagram", approvalCode: "MPCB_CTE_PHARMA", industry: "Pharmaceutical API Manufacturing", mandatory: true,
        description: "Declared process inputs, outputs, and pollution-control linkages.", source,
        questions: [
            q("rawMaterialsListed", "Raw materials listed", "checkbox", 15, { type: "EQUALS", expectedValue: true }, "Raw materials have not been confirmed.", "List the raw materials used in the process."),
            q("manufacturingStepsListed", "Manufacturing steps listed", "checkbox", 15, { type: "EQUALS", expectedValue: true }, "Manufacturing steps have not been confirmed.", "Show the manufacturing sequence."),
            q("finalProductName", "Final product name", "text", 10, { type: "PROVIDED" }, "Final product is required.", "Enter the final API product name."),
            q("solventsOrChemicalsListed", "Solvents or chemicals listed", "checkbox", 15, { type: "EQUALS", expectedValue: true }, "Solvents or chemicals have not been confirmed.", "List relevant solvents and chemicals."),
            q("effluentGenerationPointsListed", "Effluent generation points listed", "checkbox", 15, { type: "EQUALS", expectedValue: true, appliesWhen: { businessField: "pollution.effluentGeneration", operator: "GREATER_THAN", equals: 0 } }, "Effluent generation points have not been confirmed.", "Mark applicable effluent generation points."),
            q("airEmissionPointsListed", "Air-emission points listed", "checkbox", 10, { type: "EQUALS", expectedValue: true, appliesWhen: { businessField: "pollution.airEmissions", equals: true } }, "Air-emission points have not been confirmed.", "Mark applicable air-emission points."),
            q("hazardousWastePointsListed", "Hazardous-waste points listed", "checkbox", 10, { type: "EQUALS", expectedValue: true, appliesWhen: { businessField: "pollution.hazardousWasteGeneration", equals: true } }, "Hazardous-waste points have not been confirmed.", "Mark applicable hazardous-waste generation points."),
            q("pollutionControlLinkageShown", "Pollution-control linkage shown", "checkbox", 10, { type: "EQUALS", expectedValue: true }, "Pollution-control linkage is recommended but not confirmed.", "Link process points to the proposed control systems.", { required: false, mandatory: false })
        ]
    },
    {
        code: "MASS_BALANCE", name: "Mass Balance", approvalCode: "MPCB_CTE_PHARMA", industry: "Pharmaceutical API Manufacturing", mandatory: true,
        description: "Deterministic input-output-waste-loss calculation for the API process.", source,
        questions: [
            q("totalInputKg", "Total input (kg)", "number", 15, { type: "GREATER_THAN_ZERO" }, "Total input must be greater than zero.", "Enter the total process input."),
            q("productOutputKg", "Product output (kg)", "number", 15, { type: "GREATER_THAN_OR_EQUAL_ZERO" }, "Product output is required and cannot be negative.", "Enter product output."),
            q("byProductOutputKg", "By-product output (kg)", "number", 10, { type: "GREATER_THAN_OR_EQUAL_ZERO" }, "By-product output is required and cannot be negative.", "Enter zero if no by-product is generated."),
            q("wasteOutputKg", "Waste output (kg)", "number", 15, { type: "GREATER_THAN_OR_EQUAL_ZERO" }, "Waste output is required and cannot be negative.", "Enter waste output."),
            q("processLossKg", "Process loss (kg)", "number", 10, { type: "GREATER_THAN_OR_EQUAL_ZERO" }, "Process loss is required and cannot be negative.", "Enter process loss."),
            q("solventRecoveryMentioned", "Solvent recovery mentioned", "checkbox", 10, { type: "EQUALS", expectedValue: true }, "Solvent recovery has not been confirmed.", "Mention solvent recovery or explain why it does not apply."),
            q("unitsConsistent", "Units are consistent", "checkbox", 10, { type: "EQUALS", expectedValue: true }, "Consistent units have not been confirmed.", "Use the same unit for every quantity."),
            q("professionalTechnicalReviewDeclared", "Professional technical review declared", "checkbox", 5, { type: "EQUALS", expectedValue: true }, "Professional technical review remains pending.", "Have the mass balance reviewed by a technical professional.", { needsManualReview: true })
        ]
    },
    {
        code: "ETP_PROPOSAL", name: "ETP Proposal / ETP Design", approvalCode: "MPCB_CTE_PHARMA", industry: "Pharmaceutical API Manufacturing", mandatory: true,
        description: "Declared completeness and capacity consistency of the proposed ETP.", source,
        questions: [
            q("proposedETPCapacityKLD", "Proposed ETP capacity (KLD)", "number", 20, { type: "GREATER_THAN_ZERO" }, "ETP capacity must be greater than zero.", "Enter the proposed ETP capacity."),
            q("treatmentStagesDescribed", "Treatment stages described", "checkbox", 15, { type: "EQUALS", expectedValue: true }, "Treatment stages have not been confirmed.", "Describe the proposed treatment stages."),
            q("sludgeManagementMentioned", "Sludge management mentioned", "checkbox", 10, { type: "EQUALS", expectedValue: true }, "Sludge management has not been confirmed.", "Describe sludge handling and disposal."),
            q("disposalOrReusePathMentioned", "Disposal or reuse path mentioned", "checkbox", 10, { type: "EQUALS", expectedValue: true }, "Disposal or reuse path has not been confirmed.", "Describe the treated-effluent disposal or reuse path."),
            q("consultantOrDesignerDetailsProvided", "Consultant or designer details provided", "checkbox", 5, { type: "EQUALS", expectedValue: true }, "Consultant details are recommended but not confirmed.", "Add consultant or designer details.", { required: false, mandatory: false }),
            q("engineeringReviewDeclared", "Engineering review declared", "checkbox", 15, { type: "EQUALS", expectedValue: true }, "Engineering review remains pending.", "Have the ETP design reviewed by a competent engineer.", { needsManualReview: true })
        ]
    }
];

const checkboxAdditions = {
    CA_CERTIFICATE: ["Certificate is clearly readable", "Certificate belongs to the selected business", "Certificate is issued for the stated approval purpose", "Certificate copy contains all relevant pages"],
    LAND_OR_MIDC_DOCUMENT: ["Document identifies the applicable land or MIDC premises", "Document copy is complete and legible", "Authorized review of title or allotment is pending"],
    SITE_PLAN: ["Site plan is complete and legible", "Pollution-control locations are clearly identified"],
    PROCESS_FLOW_DIAGRAM: ["Process flow is complete and legible", "Inputs and outputs are connected in the flow"],
    MASS_BALANCE: ["Mass balance document is complete and legible", "All material streams are represented"],
    ETP_PROPOSAL: ["ETP proposal is complete and legible", "Design basis is identified", "Capacity basis is documented", "Proposal identifies the applicable discharge or reuse path"]
};

// The demo contract is deliberately simple: ten user declarations, ten points each.
// The labels are seeded from the configured government-information checklist above.
templates.forEach(template => {
    const questions = [...template.questions, ...(checkboxAdditions[template.code] || []).map((label, index) => q(`${template.code.toLowerCase()}Additional${index + 1}`, label, "checkbox", 10, { type: "EQUALS", expectedValue: true }, `${label} has not been confirmed.`, `Confirm this item from the uploaded document.`))];
    template.questions = questions.slice(0, 10).map(question => ({
        ...question,
        type: "checkbox",
        required: true,
        mandatory: true,
        weight: 10,
        validation: { type: "EQUALS", expectedValue: true },
        failureMessage: question.failureMessage || `${question.label} has not been confirmed.`,
        recommendation: question.recommendation || "Confirm this item from the uploaded document.",
        needsManualReview: false
    }));
});

const approval = {
    code: "MPCB_CTE_PHARMA", name: "Consent to Establish (CTE)", authority: "Maharashtra Pollution Control Board", industry: "Pharmaceutical API Manufacturing", stage: "Pre-construction",
    description: "A prototype pre-submission checklist for a pharmaceutical API manufacturing unit preparing an MPCB Consent to Establish application.",
    requiredDocumentCodes: templates.map(template => template.code),
    source: { title: "MPCB Consent Information and application-document information", url: source.url, lastVerified, confidence: "High" },
    disclaimer: "This is a rule-based pre-submission completeness assessment based on configured checklist data. It is not a government verification, legal opinion, or approval decision. Confirm current requirements with the relevant authority before filing."
};

module.exports = { approval, templates };
