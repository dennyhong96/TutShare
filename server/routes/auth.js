const router = require("express").Router();

const { register } = require("../controllers/auth.js");

router.route("/register").post(register);

module.exports = router;
