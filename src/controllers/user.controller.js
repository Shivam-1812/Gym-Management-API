const db = require("../models");
const User = db.user;

exports.allAccess = (req, res) => {
  res.status(200).send("Public Content.");
};

exports.memberBoard = (req, res) => {
  res.status(200).send("Member Content.");
};

exports.trainerBoard = (req, res) => {
  res.status(200).send("Trainer Content.");
};

exports.adminBoard = (req, res) => {
  res.status(200).send("Admin Content.");
};

exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.userId, {
      attributes: ['id', 'email', 'firstName', 'lastName', 'phoneNumber']
    });
    
    if (!user) {
      return res.status(404).send({ message: "User Not found." });
    }
    
    res.status(200).send(user);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.updateUserProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.userId);
    
    if (!user) {
      return res.status(404).send({ message: "User Not found." });
    }
    
    // Update only allowed fields
    if (req.body.firstName) user.firstName = req.body.firstName;
    if (req.body.lastName) user.lastName = req.body.lastName;
    if (req.body.phoneNumber) user.phoneNumber = req.body.phoneNumber;
    
    await user.save();
    
    res.status(200).send({
      message: "User profile updated successfully!",
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber
      }
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};