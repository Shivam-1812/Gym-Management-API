module.exports = (sequelize, Sequelize) => {
    const Booking = sequelize.define("bookings", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      bookingDate: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now')
      },
      attended: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      status: {
        type: Sequelize.ENUM('confirmed', 'cancelled', 'waitlisted'),
        defaultValue: 'confirmed'
      }
    }, {
      indexes: [
        {
          unique: true,
          fields: ['memberId', 'classId']
        }
      ]
    });
  
    return Booking;
  };