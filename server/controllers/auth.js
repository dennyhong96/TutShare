const AWS = require("aws-sdk");

AWS.config.update({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_KEY,
});

const ses = new AWS.SES();

exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    console.log(req.body);

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
            Data: `<html><bosy><h1>Hello ${name}</h1></bosy></html>`,
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
