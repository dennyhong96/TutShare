const router = require("express").Router();

const {
  setCreateLinkCheck,
  setUpdateLinkCheck,
} = require("../utils/validators/link");
const validate = require("../utils/validators");
const auth = require("../middlewares/auth");
const restrictTo = require("../middlewares/restrictTo");
const linkWriteAccess = require("../middlewares/linkWriteAccess");
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
  .route("/:id")
  .get(getLink)
  .patch(auth, setUpdateLinkCheck, validate, linkWriteAccess, updateLink)
  .delete(auth, linkWriteAccess, deleteLink);
router.route("/views/increase").patch(increaseView);
router
  .route("/")
  .get(auth, restrictTo("admin"), listLinks)
  .post(auth, setCreateLinkCheck, validate, createLink);

module.exports = router;
