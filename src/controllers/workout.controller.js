const db = require('../config/db.config');
const Workout = require('../models/workout.model');
const WorkoutExercise = require('../models/workoutExercise.model');

// Initialize tables
const initializeTables = async () => {
  try {
    await db.query(Workout.createWorkoutTable);
    await db.query(WorkoutExercise.createWorkoutExerciseTable);
    console.log('Workout tables initialized');
  } catch (err) {
    console.error('Error initializing workout tables:', err);
  }
};

// Call initialization
initializeTables();

// Controller methods
const workoutController = {
  // Get all workouts for a user
  getUserWorkouts: async (req, res) => {
    try {
      const userId = req.userId; // Ensure this is correctly set by the middleware
      const result = await db.query(Workout.getWorkouts, [userId]);
      
      res.json(result.rows);
    } catch (err) {
      console.error('Error fetching workouts:', err);
      res.status(500).json({ error: 'Server error', message: err.message });
    }
  },
  
  // Get a single workout with its exercises
  getWorkoutById: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.userId; // Ensure this is correctly set by the middleware

      console.log("Fetching workout ID:", id, "for user ID:", userId); // Debug log

      const workoutResult = await db.query(Workout.getWorkoutById, [id, userId]);

      if (workoutResult.rows.length === 0) {
        console.log("Workout not found or unauthorized"); // Debug log
        return res.status(404).json({ message: 'Workout not found' });
      }

      const workout = workoutResult.rows[0];

      // Get exercises for this workout
      const exercisesResult = await db.query(WorkoutExercise.getExercisesByWorkoutId, [id]);
      workout.exercises = exercisesResult.rows;

      res.json(workout);
    } catch (err) {
      console.error('Error fetching workout:', err); // Log the error
      res.status(500).json({ error: 'Server error', message: err.message });
    }
  },
  
  // Create a new workout
  createWorkout: async (req, res) => {
    try {
      console.log("Create Workout request received"); // Debug log
      const userId = req.userId; // Ensure this is correctly set by the middleware
      const { name, date, duration, notes, exercises } = req.body;

      if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
      }

      // Begin transaction
      await db.query('BEGIN');

      // Create workout
      const workoutResult = await db.query(
        Workout.createWorkout, 
        [userId, name, date || new Date(), duration, notes]
      );

      const workout = workoutResult.rows[0];

      // Add exercises if provided
      if (exercises && exercises.length > 0) {
        workout.exercises = [];

        for (const exercise of exercises) {
          const { exercise_name, sets, reps, weight, duration, notes } = exercise;

          const exerciseResult = await db.query(
            WorkoutExercise.addExercise,
            [workout.id, exercise_name, sets, reps, weight, duration, notes]
          );

          workout.exercises.push(exerciseResult.rows[0]);
        }
      }

      // Commit transaction
      await db.query('COMMIT');

      res.status(201).json(workout);
    } catch (err) {
      // Rollback in case of error
      await db.query('ROLLBACK');
      console.error('Error creating workout:', err);
      res.status(500).json({ error: 'Server error', message: err.message });
    }
  },
  
  // Update a workout
  updateWorkout: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.userId; // Ensure this is correctly set by the middleware
      const { name, date, duration, notes } = req.body;
      
      const result = await db.query(
        Workout.updateWorkout, 
        [name, date, duration, notes, id, userId]
      );
      
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Workout not found or unauthorized' });
      }
      
      res.json(result.rows[0]);
    } catch (err) {
      console.error('Error updating workout:', err);
      res.status(500).json({ error: 'Server error', message: err.message });
    }
  },
  
  // Delete a workout
  deleteWorkout: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.userId; // Ensure this is correctly set by the middleware
      
      const result = await db.query(Workout.deleteWorkout, [id, userId]);
      
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Workout not found or unauthorized' });
      }
      
      res.json({ message: 'Workout deleted successfully' });
    } catch (err) {
      console.error('Error deleting workout:', err);
      res.status(500).json({ error: 'Server error', message: err.message });
    }
  },
  
  // Add exercise to workout
  addExerciseToWorkout: async (req, res) => {
    try {
      const { workout_id } = req.params;
      const { exercise_name, sets, reps, weight, duration, notes } = req.body;
      
      // Verify user owns the workout
      const workoutResult = await db.query(Workout.getWorkoutById, [workout_id, req.userId]);
      
      if (workoutResult.rows.length === 0) {
        return res.status(404).json({ message: 'Workout not found or unauthorized' });
      }
      
      const result = await db.query(
        WorkoutExercise.addExercise,
        [workout_id, exercise_name, sets, reps, weight, duration, notes]
      );
      
      res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error('Error adding exercise:', err);
      res.status(500).json({ error: 'Server error', message: err.message });
    }
  },
  
  // Update an exercise
  updateExercise: async (req, res) => {
    try {
      const { exercise_id, workout_id } = req.params;
      const { exercise_name, sets, reps, weight, duration, notes } = req.body;
      
      // Verify user owns the workout
      const workoutResult = await db.query(Workout.getWorkoutById, [workout_id, req.userId]);
      
      if (workoutResult.rows.length === 0) {
        return res.status(404).json({ message: 'Workout not found or unauthorized' });
      }
      
      const result = await db.query(
        WorkoutExercise.updateExercise,
        [exercise_name, sets, reps, weight, duration, notes, exercise_id, workout_id]
      );
      
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Exercise not found' });
      }
      
      res.json(result.rows[0]);
    } catch (err) {
      console.error('Error updating exercise:', err);
      res.status(500).json({ error: 'Server error', message: err.message });
    }
  },
  
  // Delete an exercise
  deleteExercise: async (req, res) => {
    try {
      const { exercise_id } = req.params;
      
      // First get the exercise to verify workout ownership
      const exerciseResult = await db.query(WorkoutExercise.getExerciseById, [exercise_id]);
      
      if (exerciseResult.rows.length === 0) {
        return res.status(404).json({ message: 'Exercise not found' });
      }
      
      const exercise = exerciseResult.rows[0];
      
      // Verify user owns the workout
      const workoutResult = await db.query(Workout.getWorkoutById, [exercise.workout_id, req.userId]);
      
      if (workoutResult.rows.length === 0) {
        return res.status(403).json({ message: 'Unauthorized' });
      }
      
      const result = await db.query(WorkoutExercise.deleteExercise, [exercise_id]);
      
      res.json({ message: 'Exercise deleted successfully' });
    } catch (err) {
      console.error('Error deleting exercise:', err);
      res.status(500).json({ error: 'Server error', message: err.message });
    }
  }
};

module.exports = workoutController;