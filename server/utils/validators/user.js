const { body } = require("express-validator");

exports.setUpdateInterestsCheck = [
  body("interestedIn")
    .not()
    .isEmpty()
    .withMessage("Please select an interest."),
];
