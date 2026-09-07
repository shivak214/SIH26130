const fs = require("fs");
const path = require("path");
const vm = require("vm");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Business = require("./models/Business");
const Approval = require("./models/Approval");
const DocumentTemplate = require("./models/DocumentTemplate");
const { approval: readinessApproval, templates: readinessTemplates } = require("./utils/readinessTemplates");

dotenv.config({ path: path.join(__dirname, ".env") });

function loadBrowserApprovals() {
    const sourcePath = path.join(__dirname, "../frontend/html/JS/application.js");
    const source = fs.readFileSync(sourcePath, "utf8");
    const start = source.indexOf("const PHARMA_APPROVALS =");
    const end = source.indexOf("// Level metadata", start);

    if (start < 0 || end < 0) {
        throw new Error("Could not locate PHARMA_APPROVALS in application.js");
    }

    const declaration = source.slice(start, end);
    const context = {};
    vm.runInNewContext(`${declaration}\nresult = PHARMA_APPROVALS;`, context);
    return context.result;
}

const approvals = loadBrowserApprovals();

const sampleBusinessProfiles = [
    {
        _id: "BUSINESS_001",
        businessName: "MedChem Pharmaceuticals Pvt. Ltd.",
        industry: "Pharmaceutical (API Manufacturing)",
        nicCode: "21001",
        businessType: "MSME",
        companyType: "Private Limited",
        incorporationDate: "2025-03-15",
        location: { state: "Maharashtra", district: "Pune", taluka: "Pimpri-Chinchwad", area: "Bhosari MIDC", pincode: "411026", zone: "Zone B", midcArea: "Bhosari", plotNumber: "G-45" },
        investment: { landArea: 2.5, landAreaUnit: "acres", builtUpArea: 35000, plantMachinery: 8.5, landCost: 3.2, buildingCost: 2.8, totalCapitalInvestment: 16.5, workingCapital: 5, totalProjectCost: 19.5 },
        employees: { total: 85, permanent: 60, contract: 25, technical: 35, nonTechnical: 50 },
        manufacturing: { productType: "API (Active Pharmaceutical Ingredients)", products: ["Paracetamol API", "Ibuprofen API", "Metformin HCl API"], annualCapacity: 500, numberOfProducts: 3, batchProcess: true, continuousProcess: false, hazardousChemicals: true, solventsUsed: ["Methanol", "Acetone", "Toluene", "DMF"], numberOfReactors: 8, reactorCapacity: "5 KL each" },
        pollution: { mpcbCategory: "Red", effluentGeneration: 75, airEmissions: true, hazardousWasteGeneration: true, hazardousWasteQuantity: 150, solventRecovery: true, etpRequired: true, etpCapacity: 100, ocemsRequired: true },
        utilities: { powerConnection: "HT", powerLoad: 750, dgSetRequired: true, dgSetCapacity: 500, boilerRequired: true, boilerCapacity: 2, waterRequirement: 120, freshwaterSource: "MIDC Supply + Borewell", coolingSystem: "Cooling Tower" },
        storage: { dieselStorage: 5000, solventStorage: 10000, lpgRequired: true, lpgQuantity: 500, hazardousChemicalStorage: true },
        contact: { promoterName: "Rajesh Kumar Sharma", designation: "Managing Director", email: "rajesh@medchempharma.com", phone: "+91-9876543210", occupierName: "Suresh Patil", occupierDesignation: "Factory Manager", technicalDirector: "Dr. Anjali Deshmukh", qaHead: "Mr. Vinod Kulkarni", qcHead: "Ms. Priya Joshi" },
        registrations: { udyamNumber: "UDYAM-MH-12-0012345", panNumber: "AABCM1234F", tanNumber: "PUNE12345A", gstNumber: "27AABCM1234F1Z5", importExportCode: "0512345678", cinNumber: "U24230MH2025PTC123456" }
    },
    {
        _id: "BUSINESS_002",
        businessName: "LifeCare Formulations India Ltd.",
        industry: "Pharmaceutical (Formulation Manufacturing)",
        nicCode: "21002",
        businessType: "Medium",
        companyType: "Public Limited",
        incorporationDate: "2024-08-20",
        location: { state: "Maharashtra", district: "Nashik", taluka: "Nashik", area: "Satpur MIDC", pincode: "411010", zone: "Zone C", midcArea: "Satpur", plotNumber: "C-22" },
        investment: { landArea: 5, landAreaUnit: "acres", builtUpArea: 75000, plantMachinery: 22, landCost: 6.5, buildingCost: 8, totalCapitalInvestment: 36.5, workingCapital: 15, totalProjectCost: 51.5 },
        employees: { total: 250, permanent: 200, contract: 50, technical: 120, nonTechnical: 130 },
        manufacturing: { productType: "Formulations (Tablets, Capsules, Syrups)", products: ["Paracetamol 500mg Tablets", "Amoxicillin 500mg Capsules", "Cough Syrup", "Antacid Suspension"], annualCapacity: 500, numberOfProducts: 15, batchProcess: true, continuousProcess: false, hazardousChemicals: false, solventsUsed: ["Ethanol", "Isopropyl Alcohol"], numberOfTabletPresses: 20, numberOfCapsuleFillingMachines: 8 },
        pollution: { mpcbCategory: "Orange", effluentGeneration: 45, airEmissions: true, hazardousWasteGeneration: false, hazardousWasteQuantity: 0, solventRecovery: true, etpRequired: true, etpCapacity: 50, ocemsRequired: false },
        utilities: { powerConnection: "HT", powerLoad: 1200, dgSetRequired: true, dgSetCapacity: 800, boilerRequired: true, boilerCapacity: 3, waterRequirement: 80, freshwaterSource: "MIDC Supply", coolingSystem: "Chiller + Cooling Tower" },
        storage: { dieselStorage: 8000, solventStorage: 5000, lpgRequired: true, lpgQuantity: 800, hazardousChemicalStorage: false },
        contact: { promoterName: "Anil Mehta", designation: "Chairman", email: "anil@lifecareformulations.com", phone: "+91-9876501234", occupierName: "Ramesh Kulkarni", occupierDesignation: "Plant Head" }
    }
];

const approvalRules = approvals.map(approval => ({
    _id: `RULE_${approval.id}`,
    approvalId: approval.id,
    industry: "Pharmaceutical",
    approvalName: approval.name,
    authority: approval.authority,
    level: approval.level,
    estimatedDays: approval.timelineDays,
    timeline: approval.timeline,
    validity: approval.validity,
    fees: approval.fees,
    documentsRequired: approval.documents,
    conditions: approval.conditions,
    canStartIndependently: approval.canStartIndependently,
    dependencies: approval.dependencies,
    maitriIntegrated: approval.maitriIntegrated,
    officialSource: approval.officialSource,
    applyUrl: approval.applyUrl,
    applyMethod: approval.applyMethod,
    verifiedDate: new Date("2026-09-07")
}));

const dependencyRules = approvals.map(approval => ({
    _id: `DEPENDENCY_${approval.id}`,
    approvalId: approval.id,
    approvalType: approval.shortName,
    dependsOn: approval.dependencies,
    dependencyType: approval.dependencies.length ? "HARD" : "NONE",
    canStartIndependently: approval.canStartIndependently,
    reason: approval.dependencies.length ? `Complete ${approval.dependencies.length} linked approval(s) first.` : "Can start independently."
}));

const documentRequirements = approvals.flatMap(approval => approval.documents.map((documentName, index) => ({
    _id: `DOC_${approval.id}_${index + 1}`,
    approvalId: approval.id,
    approvalType: approval.shortName,
    documentType: documentName,
    documentName,
    required: true,
    format: ["PDF"],
    source: approval.officialSource || approval.applyMethod,
    estimatedTime: approval.timeline,
    verifiedDate: new Date("2026-09-07")
})));

const incentiveSchemes = [
    { _id: "INCENTIVE_001", schemeName: "Industrial Promotion Subsidy (IPS)", department: "Industries Department", policyName: "Maharashtra Industries, Investment & Services Policy 2025", policyChapter: "Chapter 4", eligibility: { industries: ["Pharmaceutical", "API Manufacturing", "Formulation"], zones: ["Zone A", "Zone B", "Zone C", "Zone D"], investmentMinCrore: 5, businessType: ["MSME", "Large"], employeesMin: 10 }, benefits: ["SGST reimbursement", "MSME support up to 7 years", "Large unit support up to 10 years"], documentsRequired: ["Application Form", "CA Certificate", "Sales Invoices", "GST Returns", "Employment Records"], applicationUrl: "https://maitri.maharashtra.gov.in/", sourceDocument: "MIISP 2025 Policy" },
    { _id: "INCENTIVE_002", schemeName: "Capital Subsidy for MSME", department: "Industries Department", policyName: "Maharashtra Industries, Investment & Services Policy 2025", policyChapter: "Chapter 4, Section 4.2", eligibility: { industries: ["Pharmaceutical", "All Manufacturing"], zones: ["Zone C", "Zone D"], investmentMinCrore: 1, investmentMaxCrore: 25, businessType: ["MSME"], employeesMin: 5 }, benefits: ["Up to 50% of Fixed Capital Investment", "Maximum one-time subsidy of Rs 25 lakh"], documentsRequired: ["Application Form", "CA Certificate", "Investment Proof", "Udyam Registration", "Proof of Commissioning"], applicationUrl: "https://maitri.maharashtra.gov.in/", sourceDocument: "MIISP 2025 Policy" },
    { _id: "INCENTIVE_003", schemeName: "Interest Subsidy", department: "Industries Department", policyName: "Maharashtra Industries, Investment & Services Policy 2025", policyChapter: "Chapter 4, Section 4.3", eligibility: { industries: ["Pharmaceutical", "All Manufacturing"], zones: ["Zone A", "Zone B", "Zone C", "Zone D"], investmentMinCrore: 5, employeesMin: 20, businessType: ["MSME", "Large"], loanType: "Term Loan" }, benefits: ["50% of interest paid on term loan", "Support up to 7 years for MSMEs"], documentsRequired: ["Application Form", "Loan Agreement", "Interest Payment Certificate", "CA Certificate", "Employment Records"], applicationUrl: "https://maitri.maharashtra.gov.in/", sourceDocument: "MIISP 2025 Policy" },
    { _id: "INCENTIVE_004", schemeName: "Stamp Duty Exemption", department: "Industries Department", policyName: "Maharashtra Industries, Investment & Services Policy 2025", policyChapter: "Chapter 4, Section 4.4", eligibility: { industries: ["Pharmaceutical", "All Manufacturing"], zones: ["Zone A", "Zone B", "Zone C", "Zone D"], investmentMinCrore: 1, businessType: ["MSME", "Large"], landPurchase: true, leaseDeed: true }, benefits: ["100% stamp duty exemption for eligible land purchase or lease"], documentsRequired: ["Application Form", "Sale Deed / Lease Agreement", "Stamp Duty Proof", "CA Certificate", "Udyam Registration"], applicationUrl: "https://maitri.maharashtra.gov.in/", sourceDocument: "MIISP 2025 Policy" }
];

const complianceSchedules = [
    { _id: "COMP_CTE_MONTHLY", approvalType: "CTE", complianceType: "Monthly Return", frequency: "MONTHLY", dueDate: "7th of next month", authority: "MPCB", description: "Monthly return of water consumption and effluent discharge", documentsRequired: ["Water consumption data", "Effluent discharge data"] },
    { _id: "COMP_CTO_EFFLUENT", approvalType: "CTO", complianceType: "Monthly Effluent Analysis", frequency: "MONTHLY", dueDate: "15th of next month", authority: "MPCB", description: "Monthly analysis of treated effluent", documentsRequired: ["NABL lab test reports"] },
    { _id: "COMP_CTO_AIR", approvalType: "CTO", complianceType: "Quarterly Air Emission Monitoring", frequency: "QUARTERLY", dueDate: "Within 15 days of quarter end", authority: "MPCB", description: "Quarterly monitoring of stack emissions", documentsRequired: ["Approved lab stack monitoring report"] },
    { _id: "COMP_CTO_RENEWAL", approvalType: "CTO", complianceType: "Annual Renewal", frequency: "ANNUAL", dueDate: "30 days before expiry", authority: "MPCB", description: "Annual renewal of Consent to Operate", documentsRequired: ["Renewal application", "Compliance report", "Fee payment"] },
    { _id: "COMP_HWA_RETURN", approvalType: "Hazardous Waste Authorization", complianceType: "Annual Return (Form 3)", frequency: "ANNUAL", dueDate: "30th June every year", authority: "MPCB", description: "Annual return of hazardous waste generation and disposal", documentsRequired: ["Waste data", "Disposal records", "Manifest copies"] },
    { _id: "COMP_FACTORY_RENEWAL", approvalType: "Factory License", complianceType: "Annual Renewal", frequency: "ANNUAL", dueDate: "31st December every year", authority: "DISH", description: "Annual renewal of Factory License", documentsRequired: ["Renewal application", "Fee payment", "Worker strength"] },
    { _id: "COMP_FIRE_RENEWAL", approvalType: "Fire NOC", complianceType: "Annual Renewal", frequency: "ANNUAL", dueDate: "30 days before expiry", authority: "Fire Department", description: "Annual renewal of Fire NOC", documentsRequired: ["Renewal application", "Fire safety audit", "Fee payment"] }
];

const validationRules = [{ _id: "VALIDATION_READINESS_SOURCE", source: "Prototype validation rule; confirm current applicability with the competent authority.", verifiedDate: new Date("2026-09-07") }];

const sampleApplication = {
    _id: "CTE_APP_2026_001",
    applicationId: "CTE_APP_2026_001",
    businessProfileId: "BUSINESS_001",
    approvalType: "CTE",
    status: "DRAFT",
    readinessScore: 68,
    prefilledFields: { applicantName: "MedChem Pharmaceuticals Pvt. Ltd.", industryType: "Pharmaceutical (API Manufacturing)", nicCode: "21001", mpcbCategory: "Red", capitalInvestmentCrore: 16.5, landArea: 2.5, effluentGeneration: 75, waterRequirement: 120, powerRequirement: 750, numberOfEmployees: 85 },
    documentsUploaded: [
        { documentId: "DOC_001", documentType: "CA Certificate", fileName: "CA_Certificate_MedChem.pdf", status: "VALIDATED", readinessScore: 100 },
        { documentId: "DOC_002", documentType: "Land Ownership Certificate", fileName: "Land_Lease_Agreement.pdf", status: "VALIDATED", readinessScore: 100 },
        { documentId: "DOC_003", documentType: "Site Plan", fileName: "Site_Plan_MedChem.pdf", status: "ISSUES_FOUND", readinessScore: 60, issues: ["Annotate 30m buffer zone", "Mark green belt area"] },
        { documentId: "DOC_004", documentType: "Process Flow Diagram", fileName: "Process_Flow_Paracetamol.pdf", status: "VALIDATED", readinessScore: 90 },
        { documentId: "DOC_005", documentType: "Mass Balance Calculations", fileName: "Mass_Balance_Paracetamol.xlsx", status: "ISSUES_FOUND", readinessScore: 50, issues: ["Recalculate to 100% balance", "Add solvent recovery percentage"] },
        { documentId: "DOC_006", documentType: "ETP Design", fileName: "ETP_Design_Report.pdf", status: "VALIDATED", readinessScore: 85 }
    ],
    overallReadiness: { score: 68, status: "NEEDS_IMPROVEMENT", criticalIssues: 2, warningIssues: 4, estimatedApprovalTime: "30 days after fixing issues" },
    createdAt: new Date("2026-09-07T10:00:00Z"),
    updatedAt: new Date("2026-09-07T11:00:00Z")
};

const collections = {
    approvalRules,
    dependencyRules,
    documentRequirements,
    businessProfiles: sampleBusinessProfiles,
    incentiveSchemes,
    complianceSchedules,
    validationRules,
    applications: [sampleApplication]
};

function collectionModel(name) {
    const schema = new mongoose.Schema({
        _id: { type: String }
    }, { strict: false, timestamps: false });
    return mongoose.models[name] || mongoose.model(name, schema, name);
}

async function seed() {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/approvalguard");
    await Business.findOneAndUpdate({ businessName: "MedChem Pharmaceuticals Pvt. Ltd." }, {
        businessName: "MedChem Pharmaceuticals Pvt. Ltd.", businessType: "MSME", businessStage: "New", industry: "Pharmaceutical API Manufacturing",
        state: "Maharashtra", district: "Pune", investment: 16.5, landArea: 2.5, employees: 85, contactPerson: "Demo Contact", phone: "9999999999", email: "demo@example.com",
        location: { district: "Pune", area: "Bhosari MIDC", plotNumber: "G-45", pincode: "411026" }, pollution: { mpcbCategory: "Red", effluentGeneration: 75, airEmissions: true, hazardousWasteGeneration: true }
    }, { upsert: true, new: true, setDefaultsOnInsert: true });
    console.log("businessProfiles: demo Business document upserted");
    await Approval.findOneAndUpdate({ code: readinessApproval.code }, readinessApproval, { upsert: true, new: true, setDefaultsOnInsert: true });
    for (const template of readinessTemplates) {
        await DocumentTemplate.findOneAndUpdate({ code: template.code }, template, { upsert: true, new: true, setDefaultsOnInsert: true });
    }
    console.log(`readiness templates: ${readinessTemplates.length} upserted`);
    for (const requirement of documentRequirements) {
        const code = `LEGACY_${requirement.approvalId}_${requirement._id}`;
        const questions = Array.from({ length: 10 }, (_, index) => ({
            id: `${code}_CHECK_${index + 1}`,
            label: `Confirm ${requirement.documentName} checklist item ${index + 1}`,
            helpText: "Confirm this item from the selected government-document requirement before filing.",
            type: "checkbox", required: true, mandatory: true, weight: 10,
            validation: { type: "EQUALS", expectedValue: true },
            failureMessage: "This checklist item has not been confirmed.",
            recommendation: "Review the uploaded document and check this item only when confirmed.",
            source: requirement.source || "Legacy approval requirement; confirm current applicability with the competent authority."
        }));
        await DocumentTemplate.findOneAndUpdate({ code }, {
            code, name: requirement.documentName, approvalCode: requirement.approvalId, industry: "Pharmaceutical", mandatory: requirement.required !== false,
            description: `Checklist generated from the existing ${requirement.approvalType} document requirement.`,
            allowedMimeTypes: ["application/pdf", "image/jpeg", "image/png"], maxFileSizeMB: 20,
            source: { title: requirement.source || "Existing approval document requirement", lastVerified: new Date("2026-09-07"), confidence: "Prototype; verify current requirement" }, questions
        }, { upsert: true, new: true, setDefaultsOnInsert: true });
    }
    console.log(`legacy document templates: ${documentRequirements.length} upserted`);
    for (const [name, records] of Object.entries(collections)) {
        const Model = collectionModel(name);
        for (const record of records) {
            const id = record._id;
            await Model.updateOne({ _id: id }, { $set: record }, { upsert: true });
        }
        console.log(`${name}: ${records.length} records upserted`);
    }
    await mongoose.disconnect();
    console.log("Pharmaceutical prototype database seed complete.");
}

seed().catch(error => {
    console.error("Seed failed:", error);
    process.exitCode = 1;
});
