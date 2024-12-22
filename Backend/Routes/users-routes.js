const express = require("express");
const { check } = require("express-validator");

const usersController = require("../Controllers/users-controller");
const fileUpload = require("../Middlewares/file-upload");

const router = express.Router();

router.get("/", usersController.getUsers);

router.post(
  "/signup",
  fileUpload.fileUpload.single("image"),
  fileUpload.uploadFileToFirebase,
  [
    check("name").notEmpty(),
    check("email").normalizeEmail().isEmail(), //normalizeEmail --- Test@gmail.com => test@gmail.com
    check("password").isLength({ min: 6 }),
  ],
  usersController.signup
);

router.post("/login", usersController.login);

module.exports = router;
