const Link = require("../models/Link");

module.exports = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Handle link not exists
    let link = await Link.findById(id);
    if (!link) {
      return res.status(404).json({
        errors: [{ msg: "Link not found." }],
      });
    }

    // Handle user is not owner of link and not admin
    if (
      !(
        link.postedBy._id.toString() === req.user.id ||
        req.user.role === "admin"
      )
    ) {
      return res.status(401).json({
        errors: [{ msg: "Your not authorized to delte this link." }],
      });
    }

    req.link = link;
    next();
  } catch (error) {
    console.error(error);

    res.status(500).json({
      errors: [{ msg: "Something went wrong, please try again later." }],
    });
  }
};
