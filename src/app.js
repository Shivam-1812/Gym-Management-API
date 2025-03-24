const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const compression = require("compression");
const logger = require("./utils/logger");
const errorMiddleware = require("./middleware/error.middleware");

const app = express();

// ✅ CORS Configuration (Allow External Requests via Ngrok)
const corsOptions = {
  origin: "*",  // ⚠️ TEMPORARY: Use specific origins in production
  credentials: true,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["Authorization"],
};
app.use(cors(corsOptions));

// ✅ Security Middleware
app.use(helmet({
  contentSecurityPolicy: false,  // ⚠️ Disabled for API requests (React Native)
}));
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Logging (Debugging)
app.use(morgan("dev", { stream: logger.stream }));

// ✅ Import Routes
const authRoutes = require("./routes/auth.routes");
app.use("/api/auth", authRoutes);

// ✅ Root Route
app.get("/", (req, res) => {
  res.json({ message: "Gym Management API is Running 🚀" });
});

// ✅ Error Handling Middleware
app.use(errorMiddleware);

// ✅ Handle 404 Errors
app.use((req, res, next) => {
  res.status(404).json({ message: "❌ Route Not Found" });
});

// ✅ Export the App
module.exports = app;
