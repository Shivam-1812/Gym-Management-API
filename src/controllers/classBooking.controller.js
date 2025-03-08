const db = require("../models");
const Class = db.class;
const Booking = db.booking;
const User = db.user;
const { Op } = db.Sequelize;

// @desc    Get all available classes
// @route   GET /api/v1/classes/available
// @access  Private (Member)
exports.getAvailableClasses = async (req, res) => {
  try {
    // Get current date
    const now = new Date();
    
    // Find all active classes with start time in the future
    const classes = await Class.findAll({
      where: {
        isActive: true,
        startTime: { [Op.gt]: now }
      },
      include: [{
        model: User,
        as: 'instructor',
        attributes: ['id', 'email'] // Only include 'id' and 'email'
      }],
      order: [['startTime', 'ASC']]
    });

    // For each class, check if the member has already booked it
    const memberId = req.userId;
    
    const classesWithBookingStatus = await Promise.all(classes.map(async (classItem) => {
      const booking = await Booking.findOne({
        where: {
          memberId,
          classId: classItem.id
        }
      });
      
      const classObj = classItem.toJSON();
      classObj.isBooked = !!booking;
      classObj.isFull = classItem.currentParticipants >= classItem.capacity;
      
      return classObj;
    }));

    res.status(200).send({
      success: true,
      count: classesWithBookingStatus.length,
      data: classesWithBookingStatus
    });
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving classes."
    });
  }
};

// @desc    Reserve a fitness class
// @route   POST /api/v1/classes/:id/book
// @access  Private (Member)
exports.reserveClass = async (req, res) => {
  const classId = req.params.id;
  const memberId = req.userId;

  try {
    // Use transaction to ensure data consistency
    const transaction = await db.sequelize.transaction();

    try {
      // Check if class exists
      const classItem = await Class.findByPk(classId, { transaction });
      
      if (!classItem) {
        await transaction.rollback();
        return res.status(404).send({
          message: `Class not found with id=${classId}`
        });
      }

      // Check if class is active
      if (!classItem.isActive) {
        await transaction.rollback();
        return res.status(400).send({
          message: "This class is not currently active"
        });
      }

      // Check if class is in the future
      const now = new Date();
      if (classItem.startTime <= now) {
        await transaction.rollback();
        return res.status(400).send({
          message: "Cannot book a class that has already started"
        });
      }

      // Check if class is full
      if (classItem.currentParticipants >= classItem.capacity) {
        await transaction.rollback();
        return res.status(400).send({
          message: "This class is already at full capacity"
        });
      }

      // Check if member has already booked this class
      const existingBooking = await Booking.findOne({
        where: {
          memberId,
          classId
        },
        transaction
      });

      if (existingBooking) {
        await transaction.rollback();
        return res.status(400).send({
          message: "You have already booked this class"
        });
      }

      // Create booking
      const booking = await Booking.create({
        memberId,
        classId
      }, { transaction });

      // Increment the current participants count
      classItem.currentParticipants += 1;
      await classItem.save({ transaction });

      // Commit transaction
      await transaction.commit();

      res.status(201).send({
        success: true,
        data: booking
      });
    } catch (error) {
      // Rollback transaction in case of error
      await transaction.rollback();
      throw error;
    }
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while booking the class."
    });
  }
};

// @desc    Cancel class reservation
// @route   DELETE /api/v1/bookings/:id
// @access  Private (Member)
exports.cancelReservation = async (req, res) => {
  const bookingId = req.params.id;
  const memberId = req.userId;

  try {
    // Use transaction to ensure data consistency
    const transaction = await db.sequelize.transaction();

    try {
      // Find booking
      const booking = await Booking.findByPk(bookingId, { transaction });

      if (!booking) {
        await transaction.rollback();
        return res.status(404).send({
          message: `Booking not found with id=${bookingId}`
        });
      }

      // Make sure member is cancelling their own booking
      if (booking.memberId !== memberId) {
        await transaction.rollback();
        return res.status(401).send({
          message: "Not authorized to cancel this booking"
        });
      }

      // Get class info
      const classItem = await Class.findByPk(booking.classId, { transaction });
      
      if (!classItem) {
        await transaction.rollback();
        return res.status(404).send({
          message: "Class not found"
        });
      }

      // Check if cancellation is allowed (e.g., not too close to start time)
      const cancelationDeadline = new Date(classItem.startTime);
      cancelationDeadline.setHours(cancelationDeadline.getHours() - 1); // 1 hour before class
      
      const now = new Date();
      if (now >= cancelationDeadline) {
        await transaction.rollback();
        return res.status(400).send({
          message: "Cancellation is only allowed up to 1 hour before class start time"
        });
      }

      // Delete booking and update class participants count
      await booking.destroy({ transaction });
      classItem.currentParticipants -= 1;
      await classItem.save({ transaction });

      // Commit transaction
      await transaction.commit();

      res.status(200).send({
        success: true,
        message: "Booking successfully cancelled"
      });
    } catch (error) {
      // Rollback transaction in case of error
      await transaction.rollback();
      throw error;
    }
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while cancelling the booking."
    });
  }
};

// @desc    Get member's booked classes
// @route   GET /api/v1/bookings/my-classes
// @access  Private (Member)
exports.getMyClasses = async (req, res) => {
  const memberId = req.userId;

  try {
    const bookings = await Booking.findAll({
      where: { memberId },
      include: [{
        model: Class,
        as: 'class',
        include: [{
          model: User,
          as: 'instructor',
          attributes: ['id', 'email'] // Removed 'username'
        }]
      }],
      order: [[{ model: Class, as: 'class' }, 'startTime', 'ASC']]
    });

    res.status(200).send({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving bookings."
    });
  }
};