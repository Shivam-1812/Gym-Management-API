module.exports = (sequelize, Sequelize) => {
    const Class = sequelize.define("classes", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      className: {
        type: Sequelize.STRING(50),
        allowNull: false,
        validate: {
          len: [1, 50]
        }
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false,
        validate: {
          len: [1, 500]
        }
      },
      startTime: {
        type: Sequelize.DATE,
        allowNull: false
      },
      endTime: {
        type: Sequelize.DATE,
        allowNull: false
      },
      capacity: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      currentParticipants: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      location: {
        type: Sequelize.STRING,
        allowNull: false
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      }
    });
  
    // Instance method to check if class is full
    Class.prototype.isFull = function() {
      return this.currentParticipants >= this.capacity;
    };
  
    return Class;
  };