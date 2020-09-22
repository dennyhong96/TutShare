exports.registerParams = ({ email, name, token }) => ({
  from: `"TutShare 🖥" <${process.env.NODE_MAILER_GMAIL}>`,
  to: `${email}`,
  html: `<html><body>
  <h1>Verify your Tutshare account email address, ${name}!</h1>
  <p>Please click on the following link to complete your registration.</p>
  <a href="${process.env.CLIENT_URL}/auth/activate/${token}">${process.env.CLIENT_URL}/auth/activate/${token}</a>
  </body></html>`,
  subject: "Complete your registration | TutShare",
});

exports.forgetPWParams = ({ email, name, token }) => ({
  from: `"TutShare 🖥" <${process.env.NODE_MAILER_GMAIL}>`,
  to: `${email}`,
  html: `<html><body>
  <h1>Reset your password, ${name}!</h1>
  <p>Please click on the following link to reset your password.</p>
  <a href="${process.env.CLIENT_URL}/auth/reset-password/${token}">${process.env.CLIENT_URL}/auth/reset-password/${token}</a>
  </body></html>`,
  subject: "Reset your password | TutShare",
});

exports.notifyNewResourceParams = ({ user, link, categoriesDetail }) => ({
  from: `"TutShare 🖥" <${process.env.NODE_MAILER_GMAIL}>`,
  to: `${user.email}`,
  html: `<html><body>
  <p>Dear ${
    user.name
  }, we have found a new learning resource you might be interested in:</p>
  <h4>${link.title}</h4>

  <p>This resource covers the following subjects, click on any subject link below to start learning.</p>
  ${categoriesDetail.map(
    (cate) => `
    <div><img src="${cate.image.url}" alt="${cate.name}" style="width:50px; height:50px; object-fit:cover; border-radius:3px;"/>
    <a href="${process.env.CLIENT_URL}/categories/${cate.slug}">Checkout ${cate.name}</a></div>`
  )}
  ${
    user.role === "user"
      ? `<br/><small style="font-size:10px;">Not interested in this resource? Follow this link to update your interests.</small>
    <a style="font-size:10px; margin-left:5px;" href="${process.env.CLIENT_URL}/user/update">${user.name}'s Dashboard</a>`
      : ""
  }
  </body></html>`,
  subject: "New study resource | TutShare",
});
