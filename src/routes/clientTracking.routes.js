const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth.middleware");
const clientTrackingController = require("../controllers/clientTracking.controller");

// Middleware to set CORS headers
router.use(function (req, res, next) {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});

// Get all body measurements for a client
router.get("/:clientId/measurements", verifyToken, clientTrackingController.getClientMeasurements);

// Get the latest body measurement for a client
router.get("/:clientId/measurements/latest", verifyToken, clientTrackingController.getLatestClientMeasurement);

// Get all workouts for a client
router.get("/:clientId/workouts", verifyToken, clientTrackingController.getClientWorkouts);

// Create a workout for a client
router.post("/:clientId/workouts", verifyToken, clientTrackingController.createClientWorkout);

// Update a workout for a client
router.put("/:clientId/workouts/:workoutId", verifyToken, clientTrackingController.updateClientWorkout);

// Delete a workout for a client
router.delete("/:clientId/workouts/:workoutId", verifyToken, clientTrackingController.deleteClientWorkout);

module.exports = router;