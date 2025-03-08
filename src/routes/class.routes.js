const express = require('express');
const { authJwt } = require("../middleware");
const controller = require("../controllers/classBooking.controller");

const router = express.Router();

// Protect all routes with JWT authentication and member role check
router.use([authJwt.verifyToken, authJwt.isMember]);

// Class routes
router.get("/available", controller.getAvailableClasses);
router.post("/:id/book", controller.reserveClass);

// Booking routes
router.get("/my-classes", controller.getMyClasses);
router.delete("/:id", controller.cancelReservation);

module.exports = router;