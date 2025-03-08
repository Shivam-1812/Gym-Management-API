const express = require('express');
const router = express.Router();
const { verifyToken } = require("../middleware/auth.middleware");
const { checkDuplicateEmail, checkRolesExisted, validatePhoneNumber, validatePasswordStrength } = require("../middleware/validation.middleware");
const controller = require("../controllers/auth.controller");

// Middleware to set CORS headers
router.use(function(req, res, next) {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});

// POST /api/auth/signup - Register a new user
router.post(
  "/signup",
  [
    checkDuplicateEmail,
    checkRolesExisted,
    validatePhoneNumber,
    validatePasswordStrength
  ],
  controller.signup
);

// POST /api/auth/signin - User login
router.post("/signin", controller.signin);

module.exports = router;