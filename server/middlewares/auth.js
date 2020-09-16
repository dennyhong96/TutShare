const User = require("../models/User");
const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  try {
    // Handle no token
    let token;

    // Get token from Request headers -> for SSR getInitialProps requests
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
      console.log("TOKEN FROM HEADERS!!!", token);
    }

    // Get token from Cookies -> for Client side requests
    if (req.cookies && req.cookies["AUTH_TOKEN"]) {
      token = req.cookies["AUTH_TOKEN"];
      console.log("TOKEN FROM COOKIES!!!", token);
    }

    if (!token) {
      return res.status(401).json({ errors: [{ msg: "Invalid credentials" }] });
    }

    // Handle invalid token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(401).json({ errors: [{ msg: "Invalid credentials" }] });
    }

    // Handle user deleted
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ errors: [{ msg: "User not found." }] });
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
