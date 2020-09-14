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
               <h1>Verify your email address, ${name}!</h1>
               <p>Please click on the following link to complete your registration.</p>
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
});
