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
  listUserLinks,
  updateLink,
  deleteLink,
  increaseView,
} = require("../controllers/link");

router.route("/user").get(auth, listUserLinks);
router
  .route("/")
  .get(listLinks)
  .post(auth, setCreateLinkCheck, validate, createLink);
router
  .route("/:url")
  .get(getLink)
  .patch(auth, setUpdateLinkCheck, validate, updateLink)
  .delete(auth, deleteLink);
router.route("/views/increase").patch(increaseView);

module.exports = router;
