const User = require("../models/User");

const setUpdateObject = (reqBody) => {
  return Object.entries(reqBody).reduce((acc, [key, value]) => {
    acc[key] = value;
    return acc;
  }, {});
};

exports.updateInterests = async (req, res, next) => {
  try {
    const updateObject = setUpdateObject(req.body);

    // Handle email is already taken
    if (req.body.email) {
      const existingUser = await User.findOne({ email: req.body.email });
      if (
        existingUser &&
        existingUser._id.toString() !== req.user._id.toString()
      ) {
        return res.status(400).json({
          errors: [{ msg: `Email ${req.body.email} is already taken.` }],
        });
      }
    }

    // Handle password too weak
    if (req.body.password) {
      if (req.body.password.length < 6) {
        return res.status(400).json({
          errors: [{ msg: "Password must be atleast 6 characters long." }],
        });
      }
    }

    for (let key in req.body) {
      req.user[key] = req.body[key];
    }

    const user = await req.user.save();

    res.status(200).json({
      data: { user },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      errors: [{ msg: "Something went wrong, please try again later." }],
    });
  }
};
