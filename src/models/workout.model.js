// This file contains SQL queries for the Workout model

// Create workouts table if it doesn't exist
const createWorkoutTable = `
  CREATE TABLE IF NOT EXISTS workouts (
    id SERIAL PRIMARY KEY,
    userid INTEGER NOT NULL,
    name VARCHAR(255) NOT NULL,
    date TIMESTAMP NOT NULL DEFAULT NOW(),
    duration INTEGER,
    notes TEXT,
    createdat TIMESTAMP NOT NULL DEFAULT NOW(),
    updatedat TIMESTAMP NOT NULL DEFAULT NOW()
  );
`;

module.exports = {
  createWorkoutTable,
  
  // Get all workouts for a user
  getWorkouts: 'SELECT * FROM workouts WHERE userid = $1 ORDER BY date DESC',
  
  // Get a single workout by id
  getWorkoutById: 'SELECT * FROM workouts WHERE id = $1 AND userid = $2',
  
  // Create a new workout
  createWorkout: `
    INSERT INTO workouts (userid, name, date, duration, notes, createdat, updatedat) 
    VALUES ($1, $2, $3, $4, $5, NOW(), NOW()) 
    RETURNING *
  `,
  
  // Update a workout
  updateWorkout: `
    UPDATE workouts
    SET name = $1, date = $2, duration = $3, notes = $4, updatedat = NOW()
    WHERE id = $5 AND userid = $6
    RETURNING *
  `,
  
  // Delete a workout
  deleteWorkout: 'DELETE FROM workouts WHERE id = $1 AND userid = $2 RETURNING *'
};