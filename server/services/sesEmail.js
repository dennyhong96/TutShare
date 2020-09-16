exports.registerParams = ({ email, name, token }) => ({
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
               <h1>Verify your Tutshare account email address, ${name}!</h1>
               <p>Please click on the following link to complete your registration.</p>
               <a href="${process.env.CLIENT_URL}/auth/activate/${token}">${process.env.CLIENT_URL}/auth/activate/${token}</a>
               </body></html>
              `,
      },
    },
    Subject: {
      Charset: "UTF-8",
      Data: "Complete your Tutshare registration",
    },
  },
});

exports.forgetPWParams = ({ email, name, token }) => ({
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
               <h1>Reset your password, ${name}!</h1>
               <p>Please click on the following link to reset your password.</p>
               <a href="${process.env.CLIENT_URL}/auth/reset-password/${token}">${process.env.CLIENT_URL}/auth/reset-password/${token}</a>
               </body></html>
              `,
      },
    },
    Subject: {
      Charset: "UTF-8",
      Data: "Reset your TutShare password",
    },
  },
});
