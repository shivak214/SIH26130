const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema({
    documentType: { type: String, required: true },
    approvalCode: String,
    documentCode: String,
    documentName: String,
    approvalType: String,
    businessId: { type: mongoose.Schema.Types.ObjectId, ref: "Business" },
    businessProfileId: { type: mongoose.Schema.Types.ObjectId, ref: "Business" },
    fileUrl: { type: String, required: true },
    originalName: String,
    mimeType: String,
    size: Number,
    sizeBytes: Number,
    userInputs: { type: mongoose.Schema.Types.Mixed, default: {} },
    manualFields: { type: mongoose.Schema.Types.Mixed, default: {} },
    declarationAccepted: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model("Document", documentSchema);
