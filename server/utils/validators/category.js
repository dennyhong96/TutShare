const { body } = require("express-validator");

exports.setCreateCategoryCheck = [
  body("name").not().isEmpty().withMessage("Name is required."),
  body("image").not().isEmpty().withMessage("Image is required."),
  body("description")
    .isLength({ min: 25 })
    .withMessage("Description must be at least 25 characters long."),
];

exports.setUpdateCategoryCheck = [
  body("name").not().isEmpty().withMessage("Name is required."),
  body("description")
    .isLength({ min: 25 })
    .withMessage("Description must be at least 25 characters long."),
];
