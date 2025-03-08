const db = require("../models");
const User = db.user;
const ROLES = db.ROLES;

const checkDuplicateEmail = async (req, res, next) => {
  try {
    // Check for duplicate email
    const userEmail = await User.findOne({
      where: {
        email: req.body.email
      }
    });

    if (userEmail) {
      return res.status(400).send({
        message: "Failed! Email is already in use!"
      });
    }

    next();
  } catch (error) {
    return res.status(500).send({
      message: "Unable to validate email!"
    });
  }
};

const checkRolesExisted = (req, res, next) => {
  if (req.body.roles) {
    for (let i = 0; i < req.body.roles.length; i++) {
      if (!ROLES.includes(req.body.roles[i])) {
        return res.status(400).send({
          message: `Failed! Role ${req.body.roles[i]} does not exist!`
        });
      }
    }
  }
  
  next();
};

const validatePhoneNumber = (req, res, next) => {
  const phoneRegex = /^\+?[0-9]{10,15}$/;
  
  if (!phoneRegex.test(req.body.phoneNumber)) {
    return res.status(400).send({
      message: "Failed! Phone number format is invalid."
    });
  }
  
  next();
};

const validatePasswordStrength = (req, res, next) => {
  // Password should be at least 8 characters, include uppercase, lowercase, number, and special character
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  
  if (!passwordRegex.test(req.body.password)) {
    return res.status(400).send({
      message: "Failed! Password must be at least 8 characters and include uppercase, lowercase, number, and special character."
    });
  }
  
  next();
};

const validationMiddleware = {
  checkDuplicateEmail,
  checkRolesExisted,
  validatePhoneNumber,
  validatePasswordStrength
};

module.exports = validationMiddleware;