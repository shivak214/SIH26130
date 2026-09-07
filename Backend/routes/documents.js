const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Document = require("../models/Document");
const Business = require("../models/Business");
const VerificationResult = require("../models/VerificationResult");
const DocumentTemplate = require("../models/DocumentTemplate");
const verificationService = require("../services/documentVerificationService");
const readinessService = require("../services/documentReadinessService");

const router = express.Router();
const uploadDirectory = path.join(__dirname, "../uploads");
fs.mkdirSync(uploadDirectory, { recursive: true });

const storage = multer.diskStorage({
    destination: uploadDirectory,
    filename: (req, file, callback) => callback(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname).toLowerCase()}`)
});
const allowedMimeTypes = new Set(["application/pdf", "image/jpeg", "image/png"]);
const upload = multer({
    storage,
    limits: { fileSize: 20 * 1024 * 1024 },
    fileFilter: (req, file, callback) => callback(null, allowedMimeTypes.has(file.mimetype) ? true : new Error("Only PDF, JPG, and PNG files are allowed."))
});

const uploadAndCheck = async (req, res, next) => {
    try {
        if (!req.file) return res.status(400).json({ success: false, error: "A PDF, JPG, or PNG document is required." });
        if (!req.body.documentType && !req.body.documentCode && !req.body.documentName) return res.status(400).json({ success: false, error: "documentType, documentCode, or documentName is required." });
        if (req.body.declarationAccepted !== "true") return res.status(400).json({ success: false, error: "Please accept the pre-submission checklist declaration." });
        const business = req.body.businessProfileId ? await Business.findById(req.body.businessProfileId) : await Business.findOne().sort({ createdAt: -1 });
        if (!business) return res.status(400).json({ success: false, error: "Create a business profile before uploading documents." });
        let manualFields = {};
        try { manualFields = JSON.parse(req.body.manualFields || "{}"); } catch { return res.status(400).json({ success: false, error: "manualFields must be valid JSON." }); }

        const requestedDocumentType = req.body.documentType || req.body.documentName || req.body.documentCode;
        const normalizedType = String(requestedDocumentType).toLowerCase();
        const templateCode = req.body.documentCode || ({
            "ca certificate": "CA_CERTIFICATE",
            "land ownership / midc allotment document": "LAND_OR_MIDC_DOCUMENT",
            "site plan": "SITE_PLAN",
            "process flow diagram": "PROCESS_FLOW_DIAGRAM",
            "mass balance": "MASS_BALANCE",
            "etp proposal / etp design": "ETP_PROPOSAL"
        }[normalizedType] || (normalizedType.includes("ca certificate") ? "CA_CERTIFICATE" : normalizedType.includes("land") || normalizedType.includes("lease") || normalizedType.includes("allotment") ? "LAND_OR_MIDC_DOCUMENT" : normalizedType.includes("site plan") ? "SITE_PLAN" : normalizedType.includes("process flow") ? "PROCESS_FLOW_DIAGRAM" : normalizedType.includes("mass balance") ? "MASS_BALANCE" : normalizedType.includes("etp") ? "ETP_PROPOSAL" : null));
        const template = templateCode ? await DocumentTemplate.findOne({ code: templateCode }) : await DocumentTemplate.findOne({ name: requestedDocumentType, approvalCode: req.body.approvalType }) || await DocumentTemplate.findOne({ name: requestedDocumentType });
        if (!template) return res.status(400).json({ success: false, error: "This document does not have a configured checklist template yet. Select one of the MPCB CTE document types." });
        const document = await Document.create({
            documentType: requestedDocumentType,
            documentName: req.body.documentName || requestedDocumentType,
            approvalCode: req.body.approvalCode || template?.approvalCode,
            documentCode: template?.code || req.body.documentCode,
            approvalType: req.body.approvalType,
            businessId: business._id,
            businessProfileId: business._id,
            fileUrl: path.join("uploads", path.basename(req.file.path)),
            originalName: req.file.originalname,
            mimeType: req.file.mimetype,
            size: req.file.size,
            sizeBytes: req.file.size,
            userInputs: manualFields,
            manualFields,
            declarationAccepted: true
        });
        const verificationResult = await readinessService.checkDocument(document._id, business._id);
        res.status(201).json({ success: true, data: { documentId: document._id, document, verificationResult } });
    } catch (error) {
        if (req.file) fs.rm(req.file.path, { force: true }, () => {});
        next(error);
    }
};

router.post(["/upload-and-verify", "/upload-and-check"], upload.single("document"), uploadAndCheck);

router.post("/upload", upload.single("document"), uploadAndCheck);

router.post("/:documentId/checklist", async (req, res, next) => {
    try {
        if (req.body.declarationAccepted !== true) return res.status(400).json({ success: false, error: "declarationAccepted must be true." });
        const document = await Document.findByIdAndUpdate(req.params.documentId, { userInputs: req.body.userInputs || {}, manualFields: req.body.userInputs || {}, declarationAccepted: true, approvalCode: req.body.approvalCode, documentCode: req.body.documentCode }, { new: true });
        if (!document) return res.status(404).json({ success: false, error: "Document not found." });
        const result = await readinessService.checkDocument(document._id, req.body.businessId || document.businessId, { userInputs: req.body.userInputs || {} });
        res.json({ success: true, data: result });
    } catch (error) { next(error); }
});

router.get("/:documentId/readiness-report", async (req, res, next) => {
    try {
        const result = await VerificationResult.findOne({ documentId: req.params.documentId });
        if (!result) return res.status(404).json({ success: false, error: "Readiness report not found." });
        res.json({ success: true, data: result });
    } catch (error) { next(error); }
});

router.get("/verification/:documentId", async (req, res, next) => {
    try {
        const result = await VerificationResult.findOne({ documentId: req.params.documentId });
        if (!result) return res.status(404).json({ success: false, error: "Verification result not found." });
        res.json({ success: true, data: result });
    } catch (error) { next(error); }
});

router.post("/re-verify/:documentId", async (req, res, next) => {
    try {
        const document = await Document.findById(req.params.documentId);
        if (!document) return res.status(404).json({ success: false, error: "Document not found." });
        const business = await Business.findById(req.body.businessProfileId || document.businessProfileId) || await Business.findOne().sort({ createdAt: -1 });
        const template = document.documentCode ? await DocumentTemplate.findOne({ code: document.documentCode }) : null;
        const result = template
            ? await readinessService.checkDocument(document._id, business._id)
            : await verificationService.verifyDocument(document._id, business._id);
        res.json({ success: true, data: result });
    } catch (error) { next(error); }
});

router.get("/business/:businessProfileId", async (req, res, next) => {
    try {
        const documents = await Document.find({ businessProfileId: req.params.businessProfileId }).sort({ createdAt: -1 });
        const results = await VerificationResult.find({ documentId: { $in: documents.map(document => document._id) } });
        const resultByDocument = new Map(results.map(result => [String(result.documentId), result]));
        res.json({ success: true, data: documents.map(document => ({ document, verificationResult: resultByDocument.get(String(document._id)) || null })) });
    } catch (error) { next(error); }
});

router.delete("/:documentId", async (req, res, next) => {
    try {
        const document = await Document.findByIdAndDelete(req.params.documentId);
        if (!document) return res.status(404).json({ success: false, error: "Document not found." });
        await VerificationResult.deleteOne({ documentId: document._id });
        fs.rm(path.resolve(__dirname, "..", document.fileUrl), { force: true }, () => {});
        res.json({ success: true });
    } catch (error) { next(error); }
});

module.exports = router;
