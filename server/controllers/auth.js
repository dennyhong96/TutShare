exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    console.log(req.body);
  } catch (error) {
    console.error(error);
  }
};
