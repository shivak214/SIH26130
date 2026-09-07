const mongoose = require("mongoose");

const sourceSchema = new mongoose.Schema({
    title: String,
    url: String,
    lastVerified: Date,
    confidence: String
}, { _id: false });

const approvalSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    authority: String,
    industry: String,
    stage: String,
    description: String,
    requiredDocumentCodes: { type: [String], default: [] },
    source: sourceSchema,
    disclaimer: String
}, { timestamps: true });

module.exports = mongoose.model("Approval", approvalSchema);
