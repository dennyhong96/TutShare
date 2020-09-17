const { body } = require("express-validator");

exports.setCreateLinkCheck = [
  body("title").not().isEmpty().withMessage("A title is required"),
  body("url").not().isEmpty().withMessage("A url is required"),
  body("categories")
    .not()
    .isEmpty()
    .withMessage("Please pick at least one category"),
  body("isFree")
    .not()
    .isEmpty()
    .withMessage("Please indicate whether the resource is free."),
  body("medium")
    .not()
    .isEmpty()
    .withMessage("Please indicate the medium of the resource."),
];

exports.setUpdateLinkCheck = [
  body("title").not().isEmpty().withMessage("A title is required"),
  body("url").not().isEmpty().withMessage("A url is required"),
  body("categories")
    .not()
    .isEmpty()
    .withMessage("Please pick at least one category"),
  body("isFree")
    .not()
    .isEmpty()
    .withMessage("Please indicate whether the resource is free."),
  body("medium")
    .not()
    .isEmpty()
    .withMessage("Please indicate the medium of the resource."),
];
