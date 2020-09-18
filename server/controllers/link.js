const Link = require("../models/Link");

exports.createLink = async (req, res, next) => {
  try {
    const { title, url, categories, isFree, medium } = req.body;
    console.table({ title, url, categories, isFree, medium });

    // Handle link already exists
    let link = await Link.findOne({ url });
    if (link) {
      return res.status(400).json({
        errors: [{ msg: "Sorry, this link has already been shared." }],
      });
    }

    link = await Link.create({
      ...req.body,
      postedBy: req.user._id,
    });

    res.status(201).json({
      data: { link },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      errors: [{ msg: "Something went wrong, please try again later." }],
    });
  }
};

exports.listLinks = async (req, res, next) => {
  try {
    const links = await Link.find();
    res.status(200).json({
      data: { links },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      errors: [{ msg: "Something went wrong, please try again later." }],
    });
  }
};

exports.getLink = async (req, res, next) => {
  try {
  } catch (error) {}
};

exports.updateLink = async (req, res, next) => {
  try {
  } catch (error) {}
};

exports.deleteLink = async (req, res, next) => {
  try {
  } catch (error) {}
};

exports.increaseView = async (req, res, next) => {
  try {
    const { url } = req.body;

    // Handle no url
    if (!url) {
      return res.status(500).json({
        errors: [{ msg: "Url is required." }],
      });
    }

    const link = await Link.findOneAndUpdate(
      { url },
      { $inc: { views: 1 } }, // Increase views by 1
      { runValidators: true, new: true }
    );

    // Handle url not exists
    if (!link) {
      return res.status(500).json({
        errors: [{ msg: `Resource with url: ${url} not found.` }],
      });
    }

    res.status(200).json({
      data: { link },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      errors: [{ msg: "Something went wrong, please try again later." }],
    });
  }
};
