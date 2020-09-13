exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    console.log(req.body);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      errors: [{ msg: "Something went wrong." }],
    });
  }
};
