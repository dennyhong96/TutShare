const router = require("express").Router();

const validate = require("../utils/validators");
const { setRegisterChecks } = require("../utils/validators/auth.js");
const { register, activate } = require("../controllers/auth.js");

router.route("/register").post(setRegisterChecks, validate, register);
router.route("/activate").post(activate);

module.exports = router;
