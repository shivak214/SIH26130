const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config({
    path: path.join(__dirname, ".env")
});

const Business = require("./models/Business");
const documentRoutes = require("./routes/documents");
const readinessRoutes = require("./routes/readiness");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/documents", documentRoutes);
app.use("/api", readinessRoutes);

// Serve the frontend from the same server as the API.
app.use(express.static(path.join(__dirname, "../frontend/html")));


// Save business profile
app.post("/api/business", async (req, res) => {

    try {

        console.log("Received business data:");
        console.log(req.body);

        const business = new Business(req.body);

        const savedBusiness = await business.save();

        console.log("Business saved successfully");

        res.status(201).json({
            success: true,
            message: "Business profile saved successfully",
            business: savedBusiness
        });

    } catch (error) {

        console.error("Database save error:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

});


// Get the most recently saved business profile
app.get("/api/business/latest", async (req, res) => {

    try {

        const business = await Business.findOne()
            .sort({ createdAt: -1 });

        if (!business) {
            return res.status(404).json({
                success: false,
                message: "No business profile found"
            });
        }

        res.json({
            success: true,
            business
        });

    } catch (error) {

        console.error("Fetch error:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

});


// Delete the most recently saved business profile
app.delete("/api/business/latest", async (req, res) => {

    try {

        const business = await Business.findOne()
            .sort({ createdAt: -1 });

        if (!business) {
            return res.status(404).json({
                success: false,
                message: "No business profile found"
            });
        }

        await Business.deleteOne({ _id: business._id });

        res.json({
            success: true,
            message: "Business profile deleted successfully"
        });

    } catch (error) {

        console.error("Delete error:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

});


// Get business profile by ID
app.get("/api/business/:id", async (req, res) => {

    try {

        const business = await Business.findById(req.params.id);

        if (!business) {
            return res.status(404).json({
                success: false,
                message: "Business profile not found"
            });
        }

        res.json({
            success: true,
            business
        });

    } catch (error) {

        console.error("Fetch error:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

});


// Connect MongoDB
mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/approvalguard")
    .then(() => {
        console.log("MongoDB connected");
    })
    .catch((error) => {
        console.log("MongoDB connection error:", error);
    });

console.log("RUNNING MY SERVER.JS");

// Start server
const port = Number(process.env.PORT || 5000);
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

app.get("/api/health", (req, res) => {
    res.json({ status: "OK", message: "ApprovalGuard API is running" });
});

app.use((error, req, res, next) => {
    console.error("API error:", error);
    res.status(500).json({ success: false, error: error.message || "Unexpected server error" });
});
// Add after app.use(express.json())

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});