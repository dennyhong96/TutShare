const router = require("express").Router();

const { register } = require("../controllers/auth.js");

router.route("/register").get(register);

module.exports = router;
