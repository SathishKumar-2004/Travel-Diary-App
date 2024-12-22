const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const HttpError = require("./Models/http-errors");
const placesRoutes = require("./Routes/places-routes");
const usersRoutes = require("./Routes/users-routes");
const fileUpload = require("./Middlewares/file-upload"); // Importing the uploadFileToFirebase function

const app = express();

app.use(bodyParser.json());

// This middleware handles file upload and directly uploads it to Firebase
app.post("/upload", fileUpload.uploadFileToFirebase, (req, res, next) => {
  // Assuming uploadFileToFirebase adds the fileUrl to req.fileUrl
  if (req.fileUrl) {
    return res
      .status(200)
      .json({ message: "File uploaded successfully", fileUrl: req.fileUrl });
  } else {
    return next(new HttpError("File upload failed", 500));
  }
});

app.use(
  "/uploads/images",
  express.static(path.join(__dirname, "uploads", "images"))
);

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use("/api/places", placesRoutes);

app.use("/api/users", usersRoutes);

app.use((req, res, next) => {
  throw new HttpError("Cannot find the Route", 404);
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred" });
});

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@mern-project.xodkn.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority&appName=MERN-project`
  )
  .then(() => {
    console.log("Database Connected Successfully.");
    app.listen(process.env.PORT || 5000);
  })
  .catch((err) => console.log(err));
