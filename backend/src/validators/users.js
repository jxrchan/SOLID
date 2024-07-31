const { body } = require("express-validator");


const validateUpdateProfile = [
  body("name", "name is required").notEmpty().isString(),
  body("description", "description is required").notEmpty().isString(),
  body("description", "description cannot exceed 200 characters").isLength({min: 1, max: 200}),
];

const validateGetActivities = [
    body('dateStart', 'date is invalid').optional().isDate(),
    body('dataEnd', 'date is invalid').optional().isDate(),
    body('athleteId', 'athlete ID must be UUID').optional().isUUID(),
    body('coachId', 'coach ID must be UUID').optional().isUUID(),
];

const validateUpdateActivities = [
    body('name', 'name is required').notEmpty().isString(),
    body('type', 'type is required').notEmpty().isString(),
    body('date', 'date is required').notEmpty(),
    body('date', 'date is invalid').isDate(),
]



module.exports = {
    validateUpdateProfile

};
