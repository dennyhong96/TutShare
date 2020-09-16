const AWS = require("aws-sdk");
const jwt = require("jsonwebtoken");
const shortid = require("shortid");

const { registerParams, forgetPWParams } = require("../services/sesEmail");
const User = require("../models/User");

AWS.config.update({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_KEY,
});

const ses = new AWS.SES();

exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Handle duplicate email address
    const user = await User.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ errors: [{ msg: "Email is already taken." }] });
    }

    // Generate confirm register link and send via email
    const token = jwt.sign({ name, email, password }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES,
    });

    await ses.sendEmail(registerParams({ email, name, token })).promise();

    res.status(200).json({
      data: {
        msg: `Confirmation link has been sent to ${email}, please follow the email to complete your registration.`,
      },
    });
  } catch (error) {
    console.error(error);
    if (error.code === "MessageRejected") {
      return res.status(400).json({
        errors: [
          {
            msg:
              "Something went wrong while verifying this email address, please try again later.",
          },
        ],
      });
    }

    res.status(500).json({
      errors: [{ msg: "Something went wrong, please try again later" }],
    });
  }
};

exports.activate = async (req, res, next) => {
  try {
    const { token } = req.body;

    // Check if jwt is valid
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(400).json({
        errors: [
          {
            msg:
              "Sorry, your link has expired or is invalid. Please try again.",
          },
        ],
      });
    }

    // Check if email is already in use
    let user = await User.findOne({ email: decoded.email });
    if (user) {
      return res.status(400).json({
        errors: [
          {
            msg: `Sorry, email ${decoded.email} is already in use.`,
          },
        ],
      });
    }

    // Create new user
    user = await User.create({ ...decoded, username: shortid.generate() });

    // Return jwt token
    res.status(201).json({
      data: {
        token: user.genJwtToken(),
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      errors: [{ msg: "Something went wrong, please try again later" }],
    });
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    // Handle user not exists
    if (!user) {
      return res.status(404).json({
        errors: [{ msg: "User not found." }],
      });
    }

    // Handle incorrect password
    if (!(await user.passwordIsCorrect(password))) {
      return res.status(401).json({
        errors: [{ msg: "Invalid credentials." }],
      });
    }

    // Return jwt token
    res.status(201).json({
      data: {
        token: user.genJwtToken(),
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      errors: [{ msg: "Something went wrong, please try again later" }],
    });
  }
};

exports.loadUser = (req, res, next) => {
  res.status(200).json({ data: req.user });
};

exports.forgetPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    // Handle email not exists
    if (!user) {
      return res.status(404).json({
        errors: [{ msg: `Account with email ${email} not found.` }],
      });
    }

    const token = jwt.sign({ name: user.name }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES,
    });

    await User.findOneAndUpdate(
      { email },
      { resetPasswordToken: token },
      { runValidators: true }
    );

    const data = await ses
      .sendEmail(forgetPWParams({ email, name: user.name, token }))
      .promise();

    res.status(200).json({
      data: {
        msg: "Email has been successfully sent.",
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      errors: [{ msg: "Something went wrong, please try again later" }],
    });
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { password, resetPasswordToken } = req.body;

    let user = await User.findOne({ resetPasswordToken });

    // Check if any user is associated with that token
    if (!user) {
      return res.status(401).json({
        errors: [
          {
            msg: `Password reset link is invalid, please try again.`,
          },
        ],
      });
    }

    // Check if token valid or expired
    let decoded;
    try {
      decoded = jwt.verify(resetPasswordToken, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(401).json({
        errors: [
          {
            msg: `Password reset link is invalid or expired, please try again.`,
          },
        ],
      });
    }

    // Update user password and delete used resetPasswordToken
    user.password = password;
    user.resetPasswordToken = null;
    user = await user.save();

    res.status(200).json({
      data: {
        msg: "Your password is successfully reset, you can log in now.",
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      errors: [{ msg: "Something went wrong, please try again later" }],
    });
  }
};
