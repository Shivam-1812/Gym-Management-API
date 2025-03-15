// trainerClass.routes.js
const express = require('express');
const { authJwt } = require("../middleware");
const controller = require("../controllers/trainerClass.controller");

const router = express.Router();

// Protect all routes with JWT authentication and trainer role check
router.use([authJwt.verifyToken, authJwt.isTrainer]);

// Trainer Class routes
router.post("/classes", controller.createClass);
router.put("/classes/:id", controller.updateClass);
router.get("/classes", controller.getTrainerClasses);
router.get("/classes/:id/attendance", controller.getClassAttendance);

module.exports = router;