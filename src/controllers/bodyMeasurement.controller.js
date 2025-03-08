const db = require("../config/db.config"); // Ensure this path is correct
const BodyMeasurement = require("../models/bodyMeasurement.model"); // Import the model

// Create a new body measurement
const createMeasurement = async (req, res) => {
  try {
    const { weight, height, chest, waist, hips } = req.body;
    const userId = req.userId;

    console.log("Creating measurement for user ID:", userId); // Debug log

    // Use the SQL query from the model
    const result = await db.query(BodyMeasurement.createMeasurement, [
      userId,
      weight,
      height,
      chest,
      waist,
      hips,
    ]);

    const measurement = result.rows[0]; // Get the created measurement
    res.status(201).json(measurement);
  } catch (err) {
    console.error("Error creating measurement:", err); // Log the error
    res.status(500).json({ error: "Server error" });
  }
};

// Get all body measurements for a user
const getUserMeasurements = async (req, res) => {
  try {
    const userId = req.userId;
    console.log("Fetching measurements for user ID:", userId); // Debug log

    const result = await db.query(BodyMeasurement.getMeasurements, [userId]);
    const measurements = result.rows;

    res.status(200).json(measurements);
  } catch (err) {
    console.error("Error fetching measurements:", err); // Log the error
    res.status(500).json({ error: "Server error" });
  }
};

// Get a single body measurement by ID
const getMeasurementById = async (req, res) => {
  try {
    const measurementId = req.params.id;
    const userId = req.userId;

    console.log("Fetching measurement ID:", measurementId, "for user ID:", userId); // Debug log

    const result = await db.query(BodyMeasurement.getMeasurementById, [measurementId, userId]);
    const measurement = result.rows[0];

    if (!measurement) {
      return res.status(404).json({ message: "Measurement not found" });
    }

    res.status(200).json(measurement);
  } catch (err) {
    console.error("Error fetching measurement by ID:", err); // Log the error
    res.status(500).json({ error: "Server error" });
  }
};

// Update a body measurement
const updateMeasurement = async (req, res) => {
  try {
    const measurementId = req.params.id;
    const userId = req.userId;
    const { weight, height, chest, waist, hips } = req.body;

    console.log("Updating measurement ID:", measurementId, "for user ID:", userId); // Debug log

    const result = await db.query(BodyMeasurement.updateMeasurement, [
      new Date(), // date
      weight,
      height,
      null, // body_fat_percentage (optional)
      chest,
      waist,
      hips,
      null, // biceps (optional)
      null, // thighs (optional)
      null, // notes (optional)
      measurementId,
      userId,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Measurement not found" });
    }

    res.status(200).json({ message: "Measurement updated successfully", measurement: result.rows[0] });
  } catch (err) {
    console.error("Error updating measurement:", err); // Log the error
    res.status(500).json({ error: "Server error" });
  }
};

// Delete a body measurement
const deleteMeasurement = async (req, res) => {
  try {
    const measurementId = req.params.id;
    const userId = req.userId;

    console.log("Deleting measurement ID:", measurementId, "for user ID:", userId); // Debug log

    const result = await db.query(BodyMeasurement.deleteMeasurement, [measurementId, userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Measurement not found" });
    }

    res.status(200).json({ message: "Measurement deleted successfully" });
  } catch (err) {
    console.error("Error deleting measurement:", err); // Log the error
    res.status(500).json({ error: "Server error" });
  }
};

// Export all functions
module.exports = {
  createMeasurement,
  getUserMeasurements,
  getMeasurementById,
  updateMeasurement,
  deleteMeasurement,
};