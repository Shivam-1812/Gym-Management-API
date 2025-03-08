const express = require('express');
const router = express.Router();
const workoutController = require('../controllers/workout.controller');
const { authJwt } = require('../middleware');

console.log("Workout routes loaded"); // Debug log

// Apply auth middleware to all routes
router.use(authJwt.verifyToken);

// GET /api/workouts - Get all workouts for a user
router.get('/', workoutController.getUserWorkouts);

// GET /api/workouts/:id - Get a single workout with its exercises
router.get('/:id', workoutController.getWorkoutById);

// POST /api/workouts - Create a new workout
router.post('/', workoutController.createWorkout);

// PUT /api/workouts/:id - Update a workout
router.put('/:id', workoutController.updateWorkout);

// DELETE /api/workouts/:id - Delete a workout
router.delete('/:id', workoutController.deleteWorkout);

// Exercise routes
// POST /api/workouts/:workout_id/exercises - Add exercise to workout
router.post('/:workout_id/exercises', workoutController.addExerciseToWorkout);

// PUT /api/workouts/:workout_id/exercises/:exercise_id - Update an exercise
router.put('/:workout_id/exercises/:exercise_id', workoutController.updateExercise);

// DELETE /api/workouts/exercises/:exercise_id - Delete an exercise
router.delete('/exercises/:exercise_id', workoutController.deleteExercise);

module.exports = router;