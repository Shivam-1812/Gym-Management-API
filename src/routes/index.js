// src/routes/index.js
const authRoutes = require('./auth.routes');
const bodyMeasurementRoutes = require('./bodyMeasurement.routes');
const classRoutes = require('./class.routes');
const membershipRoutes = require('./membership.routes');
const userRoutes = require('./user.routes');
const workoutRoutes = require('./workouts.routes');

module.exports = {
  authRoutes,
  bodyMeasurementRoutes,
  classRoutes,
  membershipRoutes,
  userRoutes,
  workoutRoutes,
};