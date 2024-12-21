const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const HttpError = require("./Models/http-errors");
const placesRoutes = require("./Routes/places-routes");
const usersRoutes = require("./Routes/users-routes");

const app = express();

app.use(bodyParser.json());

app.use("/uploads/images", express.static(path.join("uploads", "images")));

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
  if (req.file) {
    fs.unlink(req.file.path, (err) => {
      console.log(err);
    });
  }
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occured" });
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
