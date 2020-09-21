const User = require("../models/User");

exports.updateInterests = async (req, res, next) => {
  try {
    const { interestedIn } = req.body;
    const user = User.findByIdAndUpdate(
      req.user._id,
      { interestedIn },
      { new: true, runValidators: true }
    );

    console.log("updateInterests", user);

    res.status(200).json({
      data: { msg: "Interests successfully updated." },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      errors: [{ msg: "Something went wrong, please try again later." }],
    });
  }
};
