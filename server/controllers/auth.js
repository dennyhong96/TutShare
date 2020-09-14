const AWS = require("aws-sdk");
const jwt = require("jsonwebtoken");

const { registerParams } = require("../services/sesEmail");
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
    res.status(500).json({
      errors: [{ msg: "Something went wrong." }],
    });
  }
};
