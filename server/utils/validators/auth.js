const { body } = require("express-validator");

exports.setRegisterChecks = [
  body("name").not().isEmpty().withMessage("Name is required."),
  body("email").isEmail().withMessage("Email must be valid."),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long."),
];

exports.setLoginChecks = [
  body("email").isEmail().withMessage("Email must be valid."),
  body("password").not().isEmpty().withMessage("Password is required."),
];
