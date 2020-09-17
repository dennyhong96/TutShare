const router = require("express").Router();

const {
  setCreateLinkCheck,
  setUpdateLinkCheck,
} = require("../utils/validators/link");
const validate = require("../utils/validators");
const auth = require("../middlewares/auth");
const {
  createLink,
  listLinks,
  getLink,
  updateLink,
  deleteLink,
} = require("../controllers/link");

router
  .route("/")
  .get(listLinks)
  .post(auth, setCreateLinkCheck, validate, createLink);
router
  .route("/:slug")
  .get(getLink)
  .patch(auth, setUpdateLinkCheck, validate, updateLink)
  .delete(auth, deleteLink);

module.exports = router;
