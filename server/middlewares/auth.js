const User = require("../models/User");
const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  try {
    // Handle no token
    let token;
    if (!(req.headers && req.headers.authorization)) {
      return res.status(400).json({ errors: [{ msg: "Invalid credentials" }] });
    }

    token = req.headers.authorization.split(" ")[1];

    // Handle invalid token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(400).json({ errors: [{ msg: "Invalid credentials" }] });
    }

    // Handle user deleted
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(400).json({ errors: [{ msg: "User not found." }] });
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({
      errors: [{ msg: "Something went wrong, please try again later" }],
    });
  }
};
