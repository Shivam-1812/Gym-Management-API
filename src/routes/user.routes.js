const express = require('express');
const router = express.Router();
const { verifyToken, isAdmin, isTrainer, isMember } = require("../middleware/auth.middleware");
const { validatePhoneNumber } = require("../middleware/validation.middleware");
const controller = require("../controllers/user.controller");

// Middleware to set CORS headers
router.use(function(req, res, next) {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});

// Public route
router.get("/test/all", controller.allAccess);

// Member-only route
router.get("/test/member", [verifyToken, isMember], controller.memberBoard);

// Trainer-only route
router.get("/test/trainer", [verifyToken, isTrainer], controller.trainerBoard);

// Admin-only route
router.get("/test/admin", [verifyToken, isAdmin], controller.adminBoard);

// Get user profile
router.get("/users/profile", [verifyToken], controller.getUserProfile);

// Update user profile
router.put("/users/profile", [verifyToken, validatePhoneNumber], controller.updateUserProfile);

module.exports = router;