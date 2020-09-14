const router = require("express").Router();

const validate = require("../utils/validators");
const {
  setRegisterChecks,
  setLoginChecks,
} = require("../utils/validators/auth.js");
const {
  register,
  activate,
  login,
  loadUser,
} = require("../controllers/auth.js");
const auth = require("../middlewares/auth");

router.route("/register").post(setRegisterChecks, validate, register);
router.route("/activate").post(activate);
router.route("/login").post(setLoginChecks, validate, login);
router.route("/").get(auth, loadUser);

module.exports = router;
