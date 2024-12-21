const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const HttpError = require("../Models/http-errors");
const User = require("../Models/user");

const getUsers = async (req, res, next) => {
  let allUsers;
  try {
    allUsers = await User.find({}, "-password");
  } catch (err) {
    const error = new HttpError(
      "Fetching users falied, Please try again later",
      500
    );
    return next(error);
  }
  res.json({ users: allUsers.map((user) => user.toObject({ getters: true })) });
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new HttpError("Invalid Inputs passed check your Data", 422);
    return next(error);
  }
  const { name, email, password } = req.body;
  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError("Signing up failed, Please try again", 500);
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError(
      "User already exist, Please login Instead",
      422
    );
    return next(error);
  }
  let hashedPassword;

  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError(
      "Could not Create user, Please try again.",
      500
    );
    return next(error);
  }

  const newUser = new User({
    name,
    email,
    image: req.file.path,
    password: hashedPassword,
    places: [],
  });

  try {
    await newUser.save();
  } catch (err) {
    const error = new HttpError(
      "Signing up failed,please try again later",
      500
    );
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { userId: newUser.id, email: newUser.email },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new HttpError(
      "Signing up failed,please try again later",
      500
    );
    return next(error);
  }

  res.status(201).json({
    message: "User SignedUp Successfully",
    userId: newUser.id,
    email: newUser.email,
    token: token,
    image: newUser.image,
  });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  let user;
  try {
    user = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError("Login failed, Please try again later", 500);
    return next(error);
  }
  if (!user) {
    const error = new HttpError("Invalid Credentials", 403);
    return next(error);
  }

  let isValidPassword = false;

  try {
    isValidPassword = await bcrypt.compare(password, user.password);
  } catch (err) {
    const error = new HttpError(
      "Could not log you in, Please try again later.",
      500
    );
    return next(error);
  }

  if (!isValidPassword) {
    const error = new HttpError("Incorrect Password, Please try again", 403);
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new HttpError(
      "Logging in failed,please try again later",
      500
    );
    return next(error);
  }

  res.json({
    message: "Login successful ",
    userId: user.id,
    email: user.email,
    token: token,
    image: user.image,
  });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
