const mongoose = require("mongoose");

const validationSchema = new mongoose.Schema({
    type: String,
    businessField: String,
    expectedValue: mongoose.Schema.Types.Mixed,
    tolerancePercent: Number,
    regex: String,
    appliesWhen: {
        businessField: String,
        operator: String,
        equals: mongoose.Schema.Types.Mixed
    }
}, { _id: false });

const questionSchema = new mongoose.Schema({
    id: { type: String, required: true },
    label: { type: String, required: true },
    helpText: String,
    type: { type: String, required: true },
    required: Boolean,
    options: [String],
    min: Number,
    max: Number,
    weight: { type: Number, default: 0 },
    mandatory: Boolean,
    validation: validationSchema,
    source: String,
    failureMessage: String,
    recommendation: String,
    needsManualReview: Boolean
}, { _id: false });

const sourceSchema = new mongoose.Schema({
    title: String,
    url: String,
    lastVerified: Date,
    confidence: String,
    note: String
}, { _id: false });

const documentTemplateSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    approvalCode: { type: String, required: true },
    industry: String,
    mandatory: { type: Boolean, default: true },
    description: String,
    allowedMimeTypes: { type: [String], default: ["application/pdf", "image/jpeg", "image/png"] },
    maxFileSizeMB: { type: Number, default: 20 },
    source: sourceSchema,
    questions: { type: [questionSchema], default: [] }
}, { timestamps: true });

module.exports = mongoose.model("DocumentTemplate", documentTemplateSchema);
