const db = require("../models");
const Class = db.class;
const User = db.user;
const Booking = db.booking;
const { Op } = db.Sequelize;

// @desc    Create a new class
// @route   POST /api/v1/trainer/classes
// @access  Private (Trainer)
exports.createClass = async (req, res) => {
  const { className, description, startTime, endTime, capacity, location } = req.body;
  const instructorId = req.userId;

  try {
    const newClass = await Class.create({
      className,
      description,
      startTime,
      endTime,
      capacity,
      location,
      instructorId,
      isActive: true,
    });

    res.status(201).send({
      success: true,
      data: newClass,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while creating the class.",
    });
  }
};

// @desc    Update an existing class
// @route   PUT /api/v1/trainer/classes/:id
// @access  Private (Trainer)
exports.updateClass = async (req, res) => {
  const classId = req.params.id;
  const { className, description, startTime, endTime, capacity, location, isActive } = req.body;
  const instructorId = req.userId;

  try {
    const classItem = await Class.findByPk(classId);

    if (!classItem) {
      return res.status(404).send({
        message: `Class not found with id=${classId}`,
      });
    }

    if (classItem.instructorId !== instructorId) {
      return res.status(401).send({
        message: "Not authorized to update this class",
      });
    }

    classItem.className = className || classItem.className;
    classItem.description = description || classItem.description;
    classItem.startTime = startTime || classItem.startTime;
    classItem.endTime = endTime || classItem.endTime;
    classItem.capacity = capacity || classItem.capacity;
    classItem.location = location || classItem.location;
    classItem.isActive = isActive !== undefined ? isActive : classItem.isActive;

    await classItem.save();

    res.status(200).send({
      success: true,
      data: classItem,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while updating the class.",
    });
  }
};

// @desc    Get all classes created by the trainer
// @route   GET /api/v1/trainer/classes
// @access  Private (Trainer)
exports.getTrainerClasses = async (req, res) => {
  const instructorId = req.userId;

  try {
    const classes = await Class.findAll({
      where: { instructorId },
      include: [{
        model: User,
        as: 'instructor',
        attributes: ['id', 'email'],
      }],
      order: [['startTime', 'ASC']],
    });

    res.status(200).send({
      success: true,
      count: classes.length,
      data: classes,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving classes.",
    });
  }
};

// @desc    Get class attendance
// @route   GET /api/v1/trainer/classes/:id/attendance
// @access  Private (Trainer)
exports.getClassAttendance = async (req, res) => {
  const classId = req.params.id;
  const instructorId = req.userId;

  try {
    const classItem = await Class.findOne({
      where: { id: classId, instructorId },
    });

    if (!classItem) {
      return res.status(404).send({
        message: "Class not found or you are not authorized to view this class.",
      });
    }

    const bookings = await Booking.findAll({
      where: { classId },
      include: [{
        model: User,
        as: "member",
        attributes: ["id", "email", "firstName", "lastName"],
      }],
    });

    const attendance = bookings.map((booking) => ({
      id: booking.member.id,
      email: booking.member.email,
      firstName: booking.member.firstName,
      lastName: booking.member.lastName,
      bookingDate: booking.bookingDate,
      status: booking.status,
    }));

    res.status(200).send({
      success: true,
      data: attendance,
    });
  } catch (err) {
    console.error("Error retrieving class attendance:", err);
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving class attendance.",
    });
  }
};
