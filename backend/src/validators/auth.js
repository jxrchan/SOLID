const { body } = require("express-validator");

const validateRegistrationData = [
  body("email", "valid email is required").notEmpty().isEmail(),
  body("password", "password is required").notEmpty(),
  body(
    "password",
    "password length min is 8 characters and max is 50 characters"
  ).isLength({ min: 8, max: 50 }),
  body('role','role is required').notEmpty().isString(),
];

const validateLoginData = [
  body("email", "valid email is required").notEmpty().isEmail(),
  body("password", "password is required").notEmpty(),
];

const validateRefreshToken = [
  body("refresh", "valid refresh token is required").notEmpty().isJWT(),
];

module.exports = {
  validateLoginData,
  validateRefreshToken,
  validateRegistrationData,
};
