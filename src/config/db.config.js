const { Pool } = require('pg');

// Sequelize configuration
const sequelizeConfig = {
  HOST: process.env.DB_HOST || "localhost",
  USER: process.env.DB_USER || "postgres",
  PASSWORD: process.env.DB_PASSWORD || "root",
  DB: process.env.DB_NAME || "gym_management",
  dialect: "postgres",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};

// PostgreSQL Pool configuration
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'gym_management',
  password: process.env.DB_PASSWORD || 'root',
  port: process.env.DB_PORT || 5432,
});

// Test the pool connection
pool.connect((err, client, release) => {
  if (err) {
    console.error('Error connecting to PostgreSQL database:', err);
    return;
  }
  console.log('Connected to PostgreSQL database!');
  release();
});

module.exports = {
  // Export Sequelize config for class booking system
  ...sequelizeConfig,
  
  // Export pool query for fitness tracking system
  query: (text, params) => pool.query(text, params),
  
  // Export pool instance if needed
  pool: pool
};