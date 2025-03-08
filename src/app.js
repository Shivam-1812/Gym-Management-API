const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const compression = require("compression");
const logger = require("./utils/logger");
const errorMiddleware = require("./middleware/error.middleware");

const app = express();

// Enable CORS for all routes
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS || "*", // Allow all origins if no specific origin is provided
};
app.use(cors(corsOptions));

// Security middleware
app.use(helmet());

// Use compression
app.use(compression());

// Parse JSON requests
app.use(express.json());

// Parse URL-encoded requests
app.use(express.urlencoded({ extended: true }));

// HTTP request logger
app.use(morgan("combined", { stream: logger.stream }));

// Database connection and sync
const db = require("./models");
const Role = db.role;

// In development, sync and reset database (consider using migrations in production)
if (process.env.NODE_ENV === "development") {
  db.sequelize
    .sync({ force: true }) // Drop and re-sync the database
    .then(() => {
      console.log("Drop and re-sync db.");
      initial(); // Initialize roles
    })
    .catch((err) => {
      console.error("Error syncing database:", err);
    });
} else {
  db.sequelize.sync(); // Sync without dropping tables in production
}

// Simple route for testing
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Gym Management API" });
});

// Import routes
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const membershipRoutes = require("./routes/membership.routes");
const bodyMeasurementRoutes = require("./routes/bodyMeasurement.routes");
const classRoutes = require("./routes/class.routes");
const workoutRoutes = require("./routes/workouts.routes"); // Import workout routes

// Use routes
app.use("/api/auth", authRoutes);
app.use("/api", userRoutes);
app.use("/api/membership", membershipRoutes);
app.use("/api/measurements", bodyMeasurementRoutes);
app.use("/api/v1/classes", classRoutes);
app.use("/api/workouts", workoutRoutes); // Mount workout routes

// Handle 404 errors
app.use((req, res, next) => {
  res.status(404).json({
    message: "Not Found - The requested resource does not exist.",
  });
});

// Global error handler
app.use(errorMiddleware);

// Initialize roles function
async function initial() {
  try {
    // Create default roles if they don't exist
    await Role.findOrCreate({ where: { id: 1, name: "member" } });
    await Role.findOrCreate({ where: { id: 2, name: "trainer" } });
    await Role.findOrCreate({ where: { id: 3, name: "admin" } });
    console.log("Roles created or verified successfully!");
  } catch (err) {
    console.error("Error creating roles:", err);
  }
}

// Export the app
module.exports = app;