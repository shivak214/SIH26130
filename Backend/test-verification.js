require("dotenv").config();
const assert = require("assert");
const mongoose = require("mongoose");
const Business = require("./models/Business");
const Document = require("./models/Document");
const Approval = require("./models/Approval");
const DocumentTemplate = require("./models/DocumentTemplate");
const readinessService = require("./services/documentReadinessService");
const { approval, templates } = require("./utils/readinessTemplates");

async function createDocument(businessId, documentCode, userInputs) {
    const template = templates.find(item => item.code === documentCode);
    return Document.create({ businessId, businessProfileId: businessId, approvalCode: approval.code, documentCode, documentName: template.name, documentType: template.name, fileUrl: "uploads/test-document.pdf", originalName: "test-document.pdf", mimeType: "application/pdf", size: 1024, sizeBytes: 1024, userInputs, manualFields: userInputs, declarationAccepted: true });
}

async function testVerification() {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/approvalguard");
    await Approval.findOneAndUpdate({ code: approval.code }, approval, { upsert: true, new: true });
    for (const template of templates) {
        assert.strictEqual(template.questions.length, 10, `${template.code} must have exactly 10 questions`);
        assert.ok(template.questions.every(question => question.type === "checkbox" && question.weight === 10));
        await DocumentTemplate.findOneAndUpdate({ code: template.code }, template, { upsert: true, new: true });
    }
    const business = await Business.create({ businessName: "MedChem Pharmaceuticals Pvt. Ltd.", businessType: "MSME", businessStage: "New", industry: "Pharmaceutical API Manufacturing", state: "Maharashtra", district: "Pune", investment: 16.5, landArea: 2.5, employees: 85, contactPerson: "Demo Contact", phone: "9999999999", email: "demo@example.com", location: { district: "Pune", area: "Bhosari MIDC", plotNumber: "G-45" }, pollution: { mpcbCategory: "Red", effluentGeneration: 75, airEmissions: true, hazardousWasteGeneration: true } });
    const documentIds = [];
    try {
        const allChecked = Object.fromEntries(templates[0].questions.map(question => [question.id, true]));
        const ca = await createDocument(business._id, "CA_CERTIFICATE", allChecked); documentIds.push(ca._id);
        const complete = await readinessService.checkDocument(ca._id, business._id);
        assert.strictEqual(complete.checks.length, 10);
        assert.strictEqual(complete.completenessScore, 100);
        assert.strictEqual(complete.status, "READY");

        const twoUnchecked = { ...allChecked, [templates[0].questions[2].id]: false, [templates[0].questions[7].id]: false };
        ca.userInputs = twoUnchecked; ca.manualFields = twoUnchecked; ca.markModified("userInputs"); ca.markModified("manualFields"); await ca.save();
        const partial = await readinessService.checkDocument(ca._id, business._id);
        assert.strictEqual(partial.checks.length, 10);
        assert.strictEqual(partial.completenessScore, 80);
        assert.strictEqual(partial.issues.length, 2);
        assert.ok(partial.issues.every(issue => issue.action));

        const balance = await createDocument(business._id, "MASS_BALANCE", Object.fromEntries(templates.find(item => item.code === "MASS_BALANCE").questions.map(question => [question.id, true]))); documentIds.push(balance._id);
        const balanceResult = await readinessService.checkDocument(balance._id, business._id);
        assert.strictEqual(balanceResult.completenessScore, 100);
        console.log("Deterministic ten-checkbox readiness tests passed.");
    } finally {
        await Document.deleteMany({ _id: { $in: documentIds } });
        await Business.deleteOne({ _id: business._id });
        await mongoose.disconnect();
    }
}

testVerification().catch(error => { console.error("Readiness test failed:", error); process.exitCode = 1; });
