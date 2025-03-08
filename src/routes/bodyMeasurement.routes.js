const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth.middleware");
const bodyMeasurementController = require("../controllers/bodyMeasurement.controller");

// Debug log to verify the import
console.log("bodyMeasurementController:", bodyMeasurementController);

// Middleware to set CORS headers
router.use(function (req, res, next) {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});

// Create a new body measurement
router.post("/", verifyToken, bodyMeasurementController.createMeasurement);

// Get all body measurements for a user
router.get("/", verifyToken, bodyMeasurementController.getUserMeasurements);

// Get a single body measurement by ID
router.get("/:id", verifyToken, bodyMeasurementController.getMeasurementById);

// Update a body measurement
router.put("/:id", verifyToken, bodyMeasurementController.updateMeasurement);

// Delete a body measurement
router.delete("/:id", verifyToken, bodyMeasurementController.deleteMeasurement);

module.exports = router;