module.exports = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res
      .status(403)
      .json({ errors: [{ msg: "Access to resouce is denied." }] });
  }
  next();
};
