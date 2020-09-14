const AWS = require("aws-sdk");
const jwt = require("jsonwebtoken");

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

    const emailParams = {
      Source: process.env.SES_EMAIL_FROM,
      Destination: {
        ToAddresses: [email],
      },
      ReplyToAddresses: [process.env.SES_EMAIL_FROM],
      Message: {
        Body: {
          Html: {
            Charset: "UTF-8",
            Data: `<html><body>
                   <h1>Verify your email address, ${name}!</h1>
                   <h4>Please click on the following link to complete your registration.</h4>
                   <a href="${process.env.CLIENT_URL}/api/v1/auth/activate/${token}">${process.env.CLIENT_URL}/api/v1/auth/activate/${token}</a>
                   </body></html>
                  `,
          },
        },
        Subject: {
          Charset: "UTF-8",
          Data: "Complete your registration",
        },
      },
    };

    const sesRes = await ses.sendEmail(emailParams).promise();
    console.log(sesRes);
    res.status(200).json({ data: sesRes });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      errors: [{ msg: "Something went wrong." }],
    });
  }
};
