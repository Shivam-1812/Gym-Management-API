const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.user;

const verifyToken = (req, res, next) => {
  // Extract token from the "x-access-token" header
  const token = req.headers["x-access-token"];

  // Debug log: Check if token is provided
  if (!token) {
    console.log("No token provided in the request headers"); // Debug log
    return res.status(403).send({
      message: "No token provided!"
    });
  }

  // Verify the token
  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      console.log("Token verification failed:", err.message); // Debug log
      return res.status(401).send({
        message: "Unauthorized!"
      });
    }

    // Ensure the token payload contains the "id" field
    if (!decoded.id) {
      console.log("Token payload is missing the 'id' field"); // Debug log
      return res.status(401).send({
        message: "Invalid token payload!"
      });
    }

    // Debug log: Successfully decoded token
    console.log("Token successfully decoded. User ID:", decoded.id); // Debug log

    // Set the user ID in the request object for use in controllers
    req.userId = decoded.id;
    req.user = decoded; // Attach the entire decoded token payload to req.user
    next();
  });
};

const isAdmin = async (req, res, next) => {
  try {
    // Find the user by their ID
    const user = await User.findByPk(req.userId);
    if (!user) {
      console.log("User not found for ID:", req.userId); // Debug log
      return res.status(404).send({
        message: "User not found!"
      });
    }

    // Get the user's roles
    const roles = await user.getRoles();

    // Check if the user has the "admin" role
    for (let i = 0; i < roles.length; i++) {
      if (roles[i].name === "admin") {
        console.log("User has admin role. Proceeding..."); // Debug log
        return next();
      }
    }

    // If no admin role is found, return 403
    console.log("User does not have admin role"); // Debug log
    return res.status(403).send({
      message: "Require Admin Role!"
    });
  } catch (error) {
    console.error("Error validating admin role:", error.message); // Debug log
    return res.status(500).send({
      message: "Unable to validate user role!"
    });
  }
};

const isTrainer = (req, res, next) => {
  // Check if the user has the "trainer" role
  if (req.user.role === 'trainer') {
    console.log("User has trainer role. Proceeding..."); // Debug log
    next();
  } else {
    console.log("User does not have trainer role"); // Debug log
    res.status(403).send({ message: "Require Trainer Role!" });
  }
};

const isMember = async (req, res, next) => {
  try {
    // Find the user by their ID
    const user = await User.findByPk(req.userId);
    if (!user) {
      console.log("User not found for ID:", req.userId); // Debug log
      return res.status(404).send({
        message: "User not found!"
      });
    }

    // Get the user's roles
    const roles = await user.getRoles();

    // Check if the user has the "member" role
    for (let i = 0; i < roles.length; i++) {
      if (roles[i].name === "member") {
        console.log("User has member role. Proceeding..."); // Debug log
        return next();
      }
    }

    // If no member role is found, return 403
    console.log("User does not have member role"); // Debug log
    return res.status(403).send({
      message: "Require Member Role!"
    });
  } catch (error) {
    console.error("Error validating member role:", error.message); // Debug log
    return res.status(500).send({
      message: "Unable to validate user role!"
    });
  }
};

// Export the middleware functions
const authMiddleware = {
  verifyToken,
  isAdmin,
  isTrainer,
  isMember
};

module.exports = authMiddleware;