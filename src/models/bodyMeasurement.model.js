// This file contains SQL queries for the BodyMeasurement model

// Create bodymeasurements table if it doesn't exist
const createBodyMeasurementTable = `
  CREATE TABLE IF NOT EXISTS bodymeasurements (
    id UUID PRIMARY KEY,
    userid UUID NOT NULL,
    weight DOUBLE PRECISION,
    height DOUBLE PRECISION,
    chest DOUBLE PRECISION,
    waist DOUBLE PRECISION,
    hips DOUBLE PRECISION,
    createdat TIMESTAMP NOT NULL DEFAULT NOW(),
    updatedat TIMESTAMP NOT NULL DEFAULT NOW()
  );
`;

// Get all measurements for a user
const getMeasurements = 'SELECT * FROM bodymeasurements WHERE userid = $1 ORDER BY createdat DESC';

// Get latest measurement for a user
const getLatestMeasurement = 'SELECT * FROM bodymeasurements WHERE userid = $1 ORDER BY createdat DESC LIMIT 1';

// Get a single measurement by id
const getMeasurementById = 'SELECT * FROM bodymeasurements WHERE id = $1 AND userid = $2';

// Create a new measurement
const createMeasurement = `
  INSERT INTO bodymeasurements 
  (id, userid, weight, height, chest, waist, hips, createdat, updatedat) 
  VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW()) 
  RETURNING *
`;

// Update a measurement
const updateMeasurement = `
  UPDATE bodymeasurements
  SET weight = $1, height = $2, chest = $3, waist = $4, hips = $5, updatedat = NOW()
  WHERE id = $6 AND userid = $7
  RETURNING *
`;

// Delete a measurement
const deleteMeasurement = 'DELETE FROM bodymeasurements WHERE id = $1 AND userid = $2 RETURNING *';

module.exports = {
  createBodyMeasurementTable,
  getMeasurements,
  getLatestMeasurement,
  getMeasurementById,
  createMeasurement,
  updateMeasurement,
  deleteMeasurement,
};