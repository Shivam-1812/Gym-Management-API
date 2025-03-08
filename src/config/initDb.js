const db = require('./db.config');

const initializeDatabase = async () => {
  try {
    // Enable UUID extension if not already enabled
    await db.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);

    // Create tables in order (respecting foreign key constraints)
    await db.query(`
      CREATE TABLE IF NOT EXISTS roles (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE
      );
    `);
    console.log('Roles table initialized');

    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        firstName VARCHAR(255) NOT NULL,
        lastName VARCHAR(255) NOT NULL,
        phoneNumber VARCHAR(255) NOT NULL,
        role_id INT NOT NULL,
        isActive BOOLEAN NOT NULL DEFAULT true,
        createdAt TIMESTAMP NOT NULL DEFAULT NOW(),
        updatedAt TIMESTAMP NOT NULL DEFAULT NOW(),
        CONSTRAINT fk_role FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE SET NULL
      );
    `);
    console.log('Users table initialized');

    await db.query(`
      CREATE TABLE IF NOT EXISTS memberships (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        userId UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        type VARCHAR(50) NOT NULL CHECK (type IN ('Basic', 'Premium', 'Gold')),
        status VARCHAR(50) NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Expired', 'Cancelled')),
        startDate TIMESTAMP NOT NULL DEFAULT NOW(),
        endDate TIMESTAMP NOT NULL,
        autoRenew BOOLEAN NOT NULL DEFAULT false,
        createdAt TIMESTAMP NOT NULL DEFAULT NOW(),
        updatedAt TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);
    console.log('Memberships table initialized');

    await db.query(`
      CREATE TABLE IF NOT EXISTS bodyMeasurements (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        userId UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        weight FLOAT NOT NULL,
        height FLOAT NOT NULL,
        chest FLOAT NOT NULL,
        waist FLOAT NOT NULL,
        hips FLOAT NOT NULL,
        createdAt TIMESTAMP NOT NULL DEFAULT NOW(),
        updatedAt TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);
    console.log('BodyMeasurements table initialized');

    // Insert default roles with a single query
    for (const role of ['admin', 'member', 'trainer']) {
      await db.query(`
        INSERT INTO roles (name)
        SELECT $1::VARCHAR
        WHERE NOT EXISTS (
          SELECT 1 FROM roles WHERE name = $1::VARCHAR
        )
      `, [role]);
    }
    console.log('Default roles created or verified');

    console.log('Database initialization completed successfully');
  } catch (err) {
    console.error('Error initializing database:', err);
    throw err;
  }
};

module.exports = initializeDatabase;
