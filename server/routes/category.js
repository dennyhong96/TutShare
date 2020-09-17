const router = require("express").Router();

const {
  setCreateCategoryCheck,
  setUpdateCategoryCheck,
} = require("../utils/validators/category");
const validate = require("../utils/validators");
const auth = require("../middlewares/auth");
const restrictTo = require("../middlewares/restrictTo");

const {
  createCategory,
  listCategories,
  getCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/category");

router
  .route("/")
  .post(
    auth,
    restrictTo("admin"),
    setCreateCategoryCheck,
    validate,
    createCategory
  )
  .get(listCategories);

router
  .route("/:slug")
  .get(getCategory)
  .patch(
    auth,
    restrictTo("admin"),
    setUpdateCategoryCheck,
    validate,
    updateCategory
  )
  .delete(auth, restrictTo("admin"), deleteCategory);

module.exports = router;
