module.exports = (sequelize, Sequelize) => {
  const Booking = sequelize.define("bookings", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    bookingDate: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.fn("now"),
    },
    attended: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    status: {
      type: Sequelize.ENUM("confirmed", "cancelled", "waitlisted"),
      defaultValue: "confirmed",
    },
    memberId: {
      type: Sequelize.UUID, // Ensure this matches the type of `id` in the `users` table
      allowNull: false,
    },
    classId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
  });

  // Define associations
  Booking.associate = (models) => {
    Booking.belongsTo(models.user, {
      foreignKey: "memberId",
      as: "member", // Alias for the association
    });
  };

  return Booking;
};
