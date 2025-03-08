const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.user;

const verifyToken = (req, res, next) => {
  const token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({
      message: "No token provided!"
    });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized!"
      });
    }
    req.userId = decoded.id;
    next();
  });
};

const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId);
    const roles = await user.getRoles();

    for (let i = 0; i < roles.length; i++) {
      if (roles[i].name === "admin") {
        return next();
      }
    }

    return res.status(403).send({
      message: "Require Admin Role!"
    });
  } catch (error) {
    return res.status(500).send({
      message: "Unable to validate user role!"
    });
  }
};

const isTrainer = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId);
    const roles = await user.getRoles();

    for (let i = 0; i < roles.length; i++) {
      if (roles[i].name === "trainer") {
        return next();
      }
    }

    return res.status(403).send({
      message: "Require Trainer Role!"
    });
  } catch (error) {
    return res.status(500).send({
      message: "Unable to validate user role!"
    });
  }
};

const isMember = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId);
    const roles = await user.getRoles();

    for (let i = 0; i < roles.length; i++) {
      if (roles[i].name === "member") {
        return next();
      }
    }

    return res.status(403).send({
      message: "Require Member Role!"
    });
  } catch (error) {
    return res.status(500).send({
      message: "Unable to validate user role!"
    });
  }
};

const authMiddleware = {
  verifyToken,
  isAdmin,
  isTrainer,
  isMember
};

module.exports = authMiddleware;