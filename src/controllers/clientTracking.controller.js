const db = require("../config/db.config");
const ClientTracking = require("../models/clientTracking.model");

// Get all body measurements for a client
const getClientMeasurements = async (req, res) => {
  try {
    const clientId = req.params.clientId; // Client's user ID
    const trainerId = req.userId; // Trainer's user ID

    console.log("Fetching measurements for client ID:", clientId, "by trainer ID:", trainerId);

    // Verify that the trainer has access to this client (you can add a check here if needed)

    const result = await db.query(ClientTracking.getClientMeasurements, [clientId]);
    const measurements = result.rows;

    res.status(200).json(measurements);
  } catch (err) {
    console.error("Error fetching client measurements:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Get the latest body measurement for a client
const getLatestClientMeasurement = async (req, res) => {
  try {
    const clientId = req.params.clientId; // Client's user ID
    const trainerId = req.userId; // Trainer's user ID

    console.log("Fetching latest measurement for client ID:", clientId, "by trainer ID:", trainerId);

    // Verify that the trainer has access to this client (you can add a check here if needed)

    const result = await db.query(ClientTracking.getLatestClientMeasurement, [clientId]);
    const measurement = result.rows[0];

    if (!measurement) {
      return res.status(404).json({ message: "No measurements found for this client" });
    }

    res.status(200).json(measurement);
  } catch (err) {
    console.error("Error fetching latest client measurement:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Get all workouts for a client
const getClientWorkouts = async (req, res) => {
  try {
    const clientId = req.params.clientId; // Client's user ID
    const trainerId = req.userId; // Trainer's user ID

    console.log("Fetching workouts for client ID:", clientId, "by trainer ID:", trainerId);

    // Verify that the trainer has access to this client (you can add a check here if needed)

    const result = await db.query(ClientTracking.getClientWorkouts, [clientId]);
    const workouts = result.rows;

    res.status(200).json(workouts);
  } catch (err) {
    console.error("Error fetching client workouts:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Create a workout for a client
const createClientWorkout = async (req, res) => {
  try {
    const clientId = req.params.clientId; // Client's user ID
    const trainerId = req.userId; // Trainer's user ID
    const { name, date, duration, notes } = req.body;

    console.log("Creating workout for client ID:", clientId, "by trainer ID:", trainerId);

    // Verify that the trainer has access to this client (you can add a check here if needed)

    const result = await db.query(ClientTracking.createClientWorkout, [
      clientId,
      name,
      date || new Date(),
      duration,
      notes,
    ]);

    const workout = result.rows[0];
    res.status(201).json(workout);
  } catch (err) {
    console.error("Error creating client workout:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Update a workout for a client
const updateClientWorkout = async (req, res) => {
  try {
    const clientId = req.params.clientId; // Client's user ID
    const workoutId = req.params.workoutId; // Workout ID
    const trainerId = req.userId; // Trainer's user ID
    const { name, date, duration, notes } = req.body;

    console.log("Updating workout ID:", workoutId, "for client ID:", clientId, "by trainer ID:", trainerId);

    // Verify that the trainer has access to this client (you can add a check here if needed)

    const result = await db.query(ClientTracking.updateClientWorkout, [
      name,
      date,
      duration,
      notes,
      workoutId,
      clientId,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Workout not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error("Error updating client workout:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Delete a workout for a client
const deleteClientWorkout = async (req, res) => {
  try {
    const clientId = req.params.clientId; // Client's user ID
    const workoutId = req.params.workoutId; // Workout ID
    const trainerId = req.userId; // Trainer's user ID

    console.log("Deleting workout ID:", workoutId, "for client ID:", clientId, "by trainer ID:", trainerId);

    // Verify that the trainer has access to this client (you can add a check here if needed)

    const result = await db.query(ClientTracking.deleteClientWorkout, [workoutId, clientId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Workout not found" });
    }

    res.status(200).json({ message: "Workout deleted successfully" });
  } catch (err) {
    console.error("Error deleting client workout:", err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  getClientMeasurements,
  getLatestClientMeasurement,
  getClientWorkouts,
  createClientWorkout,
  updateClientWorkout,
  deleteClientWorkout,
};