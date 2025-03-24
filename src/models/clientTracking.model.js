// This file contains SQL queries for the Client Tracking model

// Get all body measurements for a client (by userid)
const getClientMeasurements = 'SELECT * FROM bodymeasurements WHERE userid = $1 ORDER BY createdat DESC';

// Get latest body measurement for a client (by userid)
const getLatestClientMeasurement = 'SELECT * FROM bodymeasurements WHERE userid = $1 ORDER BY createdat DESC LIMIT 1';

// Get all workouts for a client (by userid)
const getClientWorkouts = 'SELECT * FROM workouts WHERE userid = $1 ORDER BY date DESC';

// Create a workout for a client
const createClientWorkout = `
  INSERT INTO workouts (userid, name, date, duration, notes, createdat, updatedat) 
  VALUES ($1, $2, $3, $4, $5, NOW(), NOW()) 
  RETURNING *
`;

// Update a workout for a client
const updateClientWorkout = `
  UPDATE workouts
  SET name = $1, date = $2, duration = $3, notes = $4, updatedat = NOW()
  WHERE id = $5 AND userid = $6
  RETURNING *
`;

// Delete a workout for a client
const deleteClientWorkout = 'DELETE FROM workouts WHERE id = $1 AND userid = $2 RETURNING *';

module.exports = {
  getClientMeasurements,
  getLatestClientMeasurement,
  getClientWorkouts,
  createClientWorkout,
  updateClientWorkout,
  deleteClientWorkout,
};