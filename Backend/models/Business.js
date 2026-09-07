const mongoose = require("mongoose");

const businessSchema = new mongoose.Schema({

    businessName: {
        type: String,
        required: true
    },

    businessType: {
        type: String,
        required: true
    },

    businessStage: {
        type: String,
        required: true
    },

    industry: {
        type: String,
        required: true
    },

    subIndustry: {
        type: String
    },

    state: {
        type: String,
        required: true
    },

    district: {
        type: String,
        required: true
    },

    location: {
        type: mongoose.Schema.Types.Mixed
    },

    investment: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },

    pollution: {
        type: mongoose.Schema.Types.Mixed
    },

    landArea: {
        type: Number,
        required: true
    },

    employees: {
        type: Number,
        required: true
    },

    turnover: {
        type: Number
    },

    contactPerson: {
        type: String,
        required: true
    },

    phone: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true
    },

    website: {
        type: String
    }

}, {
    timestamps: true
});

module.exports = mongoose.model("Business", businessSchema);