const { body, param } = require("express-validator");

const validateIdInParams = [
  param("id", "id is invalid").notEmpty().isMongoId(),
];

const validateAddAppointment = [
  body("name", "name of appointment is required").notEmpty().isString(),
  body("type", "type of appointment is requied").notEmpty().isString(),
  body("address", "address of appointment is required").notEmpty().isString(),
  body("date", "date of appointment is requied").notEmpty(),
];

const validateUpdateAppointment = [
  body("name", "name of appointment is required")
    .optional()
    .notEmpty()
    .isString(),
  body("type", "type of appointment is requied")
    .optional()
    .notEmpty()
    .isString(),
  body("address", "address of appointment is required")
    .optional()
    .notEmpty()
    .isString(),
  body("date", "date of appointment is required").optional().notEmpty(),
  body("duration", "duration of appointment is not a string")
    .optional()
    .notEmpty()
    .isString(),
  body("company", "company is not a string").optional().notEmpty().isInt(),
  body("misc", "miscellanous is not filled").optional().notEmpty(),
];

module.exports = {
  validateIdInParams,
  validateAddAppointment,
  validateUpdateAppointment,
};
