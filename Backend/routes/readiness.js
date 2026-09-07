const express = require("express");
const Business = require("../models/Business");
const Approval = require("../models/Approval");
const DocumentTemplate = require("../models/DocumentTemplate");
const readinessService = require("../services/documentReadinessService");

const router = express.Router();

router.get("/approvals/:approvalCode", async (req, res, next) => {
    try {
        const approval = await Approval.findOne({ code: req.params.approvalCode });
        if (!approval) return res.status(404).json({ success: false, error: "Approval not found." });
        const templates = await DocumentTemplate.find({ code: { $in: approval.requiredDocumentCodes } });
        res.json({ success: true, data: { approval, documents: templates } });
    } catch (error) { next(error); }
});

    router.get("/document-templates/by-name", async (req, res, next) => {
        try {
            const template = await DocumentTemplate.findOne({ name: req.query.name, approvalCode: req.query.approvalCode });
            if (!template) return res.status(404).json({ success: false, error: "Document template not found." });
            res.json({ success: true, data: template });
        } catch (error) { next(error); }
    });

router.get("/demo/business", async (req, res, next) => {
    try {
        const business = await Business.findOne({ businessName: "MedChem Pharmaceuticals Pvt. Ltd." }).sort({ createdAt: -1 });
        if (!business) return res.status(404).json({ success: false, error: "Demo business not found. Run node seed.js first." });
        res.json({ success: true, data: business });
    } catch (error) { next(error); }
});

router.get("/document-templates/:documentCode", async (req, res, next) => {
    try {
        const template = await DocumentTemplate.findOne({ code: req.params.documentCode });
        if (!template) return res.status(404).json({ success: false, error: "Document template not found." });
        res.json({ success: true, data: template });
    } catch (error) { next(error); }
});

router.get("/approvals/:approvalCode/readiness-report", async (req, res, next) => {
    try {
        if (!req.query.businessId) return res.status(400).json({ success: false, error: "businessId is required." });
        const report = await readinessService.createApprovalReadinessReport(req.query.businessId, req.params.approvalCode);
        res.json({ success: true, data: report });
    } catch (error) { next(error); }
});

module.exports = router;
