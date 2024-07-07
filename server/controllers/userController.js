const User = require("../models/userModel");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET_KEY, {
    expiresIn: "3d",
  });
};

const userLogin = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      res.json({
        message: "Make sure all the fields are filled",
        status: false,
      })
    );
  }
  const { email, password } = req.body;
  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
    if (
      !existingUser ||
      !(await bcrypt.compare(password, existingUser.password))
    ) {
      return next(
        res.json({ message: "Invalid email or password", status: false })
      );
    }
    const token = createToken(existingUser._id);
    res.json({ user: existingUser.name, token, status: true });
  } catch (err) {
    return next(err);
  }
};

const userSignUp = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      res.json({
        message: "Make sure all the fields are filled",
        status: false,
      })
    );
  }
  const { name, email, password } = req.body;
  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return next(
        res.json({
          message: "User already exists with the entered email address",
          status: false,
        })
      );
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });
    await newUser.save();
    const token = createToken(newUser._id);
    res.status(201).json({ user: name, token, status: true });
  } catch (err) {
    return next(err);
  }
};

module.exports.userLogin = userLogin;
module.exports.userSignUp = userSignUp;
