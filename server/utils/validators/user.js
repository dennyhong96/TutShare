const { body } = require("express-validator");

exports.setUpdateInterestsCheck = [
  body("interestedIn")
    .not()
    .isEmpty()
    .withMessage("Please select an interest."),
  body("email").isEmail().withMessage("Please provide a valid email address."),
  body("name").not().isEmpty().withMessage("Name is required."),
];
