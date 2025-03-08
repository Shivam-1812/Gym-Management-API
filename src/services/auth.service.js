const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const Role = db.role;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

class AuthService {
  async signup(userData) {
    try {
      // Create user
      const user = await User.create({
        email: userData.email,
        password: bcrypt.hashSync(userData.password, 8),
        firstName: userData.firstName,
        lastName: userData.lastName,
        phoneNumber: userData.phoneNumber
      });

      // Assign roles
      if (userData.roles) {
        const roles = await Role.findAll({
          where: {
            name: {
              [db.Sequelize.Op.or]: userData.roles
            }
          }
        });
        await user.setRoles(roles);
        return user;
      } else {
        // Default role is "member"
        const role = await Role.findOne({
          where: { name: "member" }
        });
        await user.setRoles([role]);
        return user;
      }
    } catch (error) {
      throw error;
    }
  }

  async signin(email, password) {
    try {
      const user = await User.findOne({
        where: {
          email: email
        }
      });

      if (!user) {
        throw new Error("User Not found.");
      }

      const passwordIsValid = bcrypt.compareSync(
        password,
        user.password
      );

      if (!passwordIsValid) {
        throw new Error("Invalid Password!");
      }

      // Generate token
      const token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: config.jwtExpiration
      });

      // Get user roles
      const roles = await user.getRoles();
      const authorities = roles.map(role => `ROLE_${role.name.toUpperCase()}`);

      return {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        roles: authorities,
        accessToken: token
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new AuthService();