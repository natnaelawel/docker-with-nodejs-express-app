const User = require("../models/user");
const bcrypt = require("bcryptjs");
const login = async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res
        .status(403)
        .json({ message: "User is not Found", success: false });
    }
    const isMatched = await bcrypt.compare(password, user.password);
    if (isMatched) {
      // save user data to the session
      req.session.user = user;
      return res
        .status(200)
        .json({ message: "Logged in successfully", success: true });
    } else {
      return res
        .status(403)
        .json({ message: "Invalid Username or password", success: false });
    }
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

const register = async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const existedUser = await User.findOne({ username });
    if (!existedUser) {
      const user = User();
      user.username = username;
      user.password = await bcrypt.hashSync(
        password,
        await bcrypt.genSaltSync(10)
      );
      const newUser = await user.save();
      req.session.user = newUser;

      return res.status(201).json(newUser);
    } else {
      return res
        .status(400)
        .json({ message: "Username is already exist", success: false });
    }
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

module.exports = {
  login,
  register,
};
