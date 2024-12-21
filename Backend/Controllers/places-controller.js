const { validationResult } = require("express-validator");
const mongoose = require("mongoose");
const fs = require("fs");

const HttpError = require("../Models/http-errors");
const getCoordsFromAddress = require("../Utils/location");
const Place = require("../Models/place");
const User = require("../Models/user");

const getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError(
      "Something went Wrong, Couldn't find place",
      500
    );
    return next(error);
  }

  if (!place) {
    const error = new HttpError(
      "Could not find the place for the provided place id",
      404
    );
    return next(error);
  }

  res.json({ place: place.toObject({ getters: true }) });
};

const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.uid;
  let userPlaces;
  try {
    userPlaces = await User.findById(userId).populate("places");
  } catch (err) {
    const error = new HttpError(
      "Fetching Places Failed, Please try again later",
      500
    );
    return next(error);
  }

  if (!userPlaces || userPlaces.places.length === 0) {
    return next(new HttpError("Could not find the place for the user", 404));
  }

  res.json({
    places: userPlaces.places.map((p) => p.toObject({ getters: true })),
  });
};

const createPlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Invalid Inputs passed check your Data", 422));
  }
  const { title, description, address, creator } = req.body;
  let coordinates;
  try {
    coordinates = await getCoordsFromAddress(address);
  } catch (error) {
    return next(error);
  }

  const createdPlace = new Place({
    title,
    description,
    address,
    image: req.file.path,
    location: coordinates,
    creator,
  });

  let existingUser;
  try {
    existingUser = await User.findById(creator);
  } catch (err) {
    const error = new HttpError("Something went wrong, please try again", 500);
    return next(error);
  }

  if (!existingUser) {
    const error = new HttpError("Could not find user for the Provided id", 404);
    return next(error);
  }

  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    await createdPlace.save({ session: session });
    existingUser.places.push(createdPlace);
    await existingUser.save({ session: session });
    await session.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Could not create the Place, Please try again",
      500
    );
    return next(error);
  }
  res.status(201).json({ place: createdPlace });
};

const updatePlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new HttpError("Invalid Inputs passed check your Data", 422);
    return next(error);
  }
  const placeId = req.params.pid;
  const { title, description } = req.body;
  let updatedPlace;
  try {
    updatedPlace = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError(
      "Couldn't find the place, Please try again",
      500
    );
    return next(error);
  }

  if (updatedPlace.creator.toString() !== req.userData.userId) {
    const error = new HttpError("You are not allowed to edit this Place", 401);
    return next(error);
  }

  updatedPlace.title = title;
  updatedPlace.description = description;

  try {
    await updatedPlace.save();
  } catch (err) {
    const error = new HttpError(
      "Something Went Wrong, Couldn't update the place'"
    );
    return next(error);
  }

  res.status(200);
  res.json({
    message: "Place Updated Successfully",
    updatedPlace: updatedPlace.toObject({ getters: true }),
  });
};

const deletePlace = async (req, res, next) => {
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId).populate("creator");
  } catch (err) {
    const error = new HttpError(
      "Couldn't find the place, Please Try Again",
      500
    );
    return next(error);
  }

  if (!place) {
    const error = new HttpError("Couldn't find the place for the provided id'");
    return next(error);
  }
  if (place.creator.id !== req.userData.userId) {
    const error = new HttpError(
      "You are not allowed to delete this Place",
      401
    );
    return next(error);
  }
  const imagePath = place.image;

  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    await place.deleteOne({ session: session });
    place.creator.places.pull(place);
    await place.creator.save({ session: session });
    await session.commitTransaction();
  } catch (err) {
    const error = new HttpError("Something Went Wrong, Please Try Again", 500);
    return next(error);
  }

  fs.unlink(imagePath, (err) => {
    console.log(err);
  });

  res.status(200).json({ message: "Place Deleted Successfully" });
};

exports.getPlacesByUserId = getPlacesByUserId;
exports.getPlaceById = getPlaceById;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
