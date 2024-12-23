const jwt = require("jsonwebtoken");
const HttpError = require("../Models/http-errors");

const checkAuth = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1]; //The header will come as "Bearer TOKEN"
    if (!token) {
      throw new Error("Authentication failed");
    }
    const decodedToken = jwt.verify(token, process.env.JWT_KEY);
    req.userData = { userId: decodedToken.userId };
    next();
  } catch (err) {
    const error = new HttpError("Authentication Failed!", 401);
    return next(error);
  }
};

module.exports = checkAuth;
