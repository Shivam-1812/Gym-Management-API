// This file contains SQL queries for the WorkoutExercise model

// Create workout_exercises table if it doesn't exist
const createWorkoutExerciseTable = `
  CREATE TABLE IF NOT EXISTS workout_exercises (
    id SERIAL PRIMARY KEY,
    workout_id INTEGER NOT NULL REFERENCES workouts(id) ON DELETE CASCADE,
    exercise_name VARCHAR(255) NOT NULL,
    sets INTEGER,
    reps INTEGER,
    weight NUMERIC(10, 2),
    duration INTEGER,
    notes TEXT,
    createdat TIMESTAMP NOT NULL DEFAULT NOW(),
    updatedat TIMESTAMP NOT NULL DEFAULT NOW()
  );
`;

module.exports = {
  createWorkoutExerciseTable,
  
  // Get all exercises for a workout
  getExercisesByWorkoutId: 'SELECT * FROM workout_exercises WHERE workout_id = $1',
  
  // Get a single exercise by id
  getExerciseById: 'SELECT * FROM workout_exercises WHERE id = $1',
  
  // Add exercise to workout
  addExercise: `
    INSERT INTO workout_exercises 
    (workout_id, exercise_name, sets, reps, weight, duration, notes, createdat, updatedat) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW()) 
    RETURNING *
  `,
  
  // Update an exercise
  updateExercise: `
    UPDATE workout_exercises
    SET exercise_name = $1, sets = $2, reps = $3, weight = $4, duration = $5, notes = $6, updatedat = NOW()
    WHERE id = $7 AND workout_id = $8
    RETURNING *
  `,
  
  // Delete an exercise
  deleteExercise: 'DELETE FROM workout_exercises WHERE id = $1 RETURNING *'
};