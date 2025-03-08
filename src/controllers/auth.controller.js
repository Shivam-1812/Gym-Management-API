const authService = require("../services/auth.service");
const membershipService = require("../services/membership.service");

exports.signup = async (req, res) => {
  try {
    // Register the user
    const user = await authService.signup({
      email: req.body.email,
      password: req.body.password,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      phoneNumber: req.body.phoneNumber,
      roles: req.body.roles,
    });

    // Debug: Check if membershipService is defined
    console.log("Membership Service:", membershipService);

    // Create a default membership for the user
    const membership = await membershipService.createMembership({
      userId: user.id, // Link membership to the user
      type: "Basic", // Default membership type
      endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)), // 1 month from now
    });

    res.status(201).send({
      message: "User registered successfully!",
      userId: user.id,
      membershipId: membership.id, // Return membership ID
    });
  } catch (error) {
    console.error("Error during signup:", error); // Log the error
    res.status(500).send({ message: error.message });
  }
};

exports.signin = async (req, res) => {
  try {
    const userData = await authService.signin(
      req.body.email,
      req.body.password
    );

    res.status(200).send(userData);
  } catch (error) {
    res.status(401).send({
      message: error.message,
    });
  }
};