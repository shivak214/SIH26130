const mongoose = require("mongoose");

const verificationResultSchema = new mongoose.Schema({
    documentId: { type: mongoose.Schema.Types.ObjectId, ref: "Document", required: true, unique: true },
    businessId: { type: mongoose.Schema.Types.ObjectId, ref: "Business" },
    verificationMode: { type: String, enum: ["RULE_BASED_CHECKLIST"], default: "RULE_BASED_CHECKLIST" },
    approvalCode: String,
    documentCode: String,
    completenessScore: { type: Number, min: 0, max: 100 },
    overallScore: { type: Number, min: 0, max: 100, default: 0 },
    status: { type: String, enum: ["PENDING", "READY", "NEEDS_MINOR_FIXES", "NEEDS_MAJOR_FIXES", "NOT_READY", "NEEDS_MANUAL_REVIEW", "ERROR"], default: "PENDING" },
    checks: { type: [mongoose.Schema.Types.Mixed], default: [] },
    issues: { type: [mongoose.Schema.Types.Mixed], default: [] },
    recommendations: { type: [String], default: [] },
    disclaimer: String,
    source: { type: mongoose.Schema.Types.Mixed },
    lastVerified: Date,
    disclaimers: { type: [String], default: [] },
    calculation: { type: mongoose.Schema.Types.Mixed },
    balanceCalculation: { type: mongoose.Schema.Types.Mixed },
    error: String,
    verificationTimestamp: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model("VerificationResult", verificationResultSchema);
