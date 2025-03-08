const express = require('express');
const router = express.Router();
const { verifyToken } = require("../middleware/auth.middleware");
const membershipController = require("../controllers/membership.controller");

// Middleware to set CORS headers
router.use(function(req, res, next) {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});

// View membership status
router.get("/status", verifyToken, membershipController.viewMembershipStatus);

// Renew or upgrade membership
router.post("/renew", verifyToken, membershipController.renewOrUpgradeMembership);

module.exports = router;