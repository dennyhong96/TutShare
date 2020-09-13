exports.register = async (req, res, next) => {
  try {
    const { email, password } = req.body;
  } catch (error) {
    console.error(error);
  }
};
