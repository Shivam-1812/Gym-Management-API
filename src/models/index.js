const path = require('path');
const dbConfig = require('../config/db.config.js');
const Sequelize = require("sequelize");

const sequelize = new Sequelize(
  dbConfig.DB,
  dbConfig.USER,
  dbConfig.PASSWORD,
  {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    pool: {
      max: dbConfig.pool.max,
      min: dbConfig.pool.min,
      acquire: dbConfig.pool.acquire,
      idle: dbConfig.pool.idle
    },
    logging: false
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Load existing models
db.user = require("./user.model.js")(sequelize, Sequelize);
db.role = require("./role.model.js")(sequelize, Sequelize);

// Load new models for Class Booking
db.class = require("./class.model.js")(sequelize, Sequelize);
db.booking = require("./booking.model.js")(sequelize, Sequelize);

// Load new model for Membership
db.membership = require("./membership.model.js")(sequelize, Sequelize);

// Define existing relationships
db.role.belongsToMany(db.user, {
  through: "user_roles",
  foreignKey: "roleId",
  otherKey: "userId"
});

db.user.belongsToMany(db.role, {
  through: "user_roles",
  foreignKey: "userId",
  otherKey: "roleId"
});

// Define new relationships for Class Booking
// Assuming user with role 'trainer' will be the instructor
db.class.belongsTo(db.user, {
  foreignKey: "instructorId",
  as: "instructor"
});

// Relationships for booking
db.booking.belongsTo(db.user, {
  foreignKey: "memberId",
  as: "member"
});

db.booking.belongsTo(db.class, {
  foreignKey: "classId",
  as: "class"
});

// Class has many bookings
db.class.hasMany(db.booking, {
  foreignKey: "classId",
  as: "bookings"
});

// User (member) has many bookings
db.user.hasMany(db.booking, {
  foreignKey: "memberId",
  as: "bookings"
});

// Define relationships for Membership
db.membership.belongsTo(db.user, {
  foreignKey: "userId",
  as: "member"
});

db.user.hasOne(db.membership, {
  foreignKey: "userId",
  as: "membership"
});

// Define roles
db.ROLES = ["admin", "trainer", "member"];

module.exports = db;
