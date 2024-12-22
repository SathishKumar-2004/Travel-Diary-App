const multer = require("multer");
const uuid = require("uuid");
const firebaseBucket = require("../firebase/firebase");
const HttpError = require("../Models/http-errors");

const MIME_TYPE = {
  "image/png": "png",
  "image/jpg": "jpg",
  "image/jpeg": "jpeg",
};

// Setup multer storage
const fileUpload = multer({
  limits: 5000000,
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    const isValid = !!MIME_TYPE[file.mimetype];
    let error = isValid ? null : new Error("Invalid mime type!");
    cb(error, isValid);
  },
});

const uploadFileToFirebase = async (req, res, next) => {
  if (!req.file) {
    return next(new HttpError("No file uploaded", 400));
  }

  const file = req.file;
  const fileName = uuid.v4() + "." + MIME_TYPE[file.mimetype];
  const blob = firebaseBucket.file(fileName);

  const blobStream = blob.createWriteStream({
    metadata: {
      contentType: file.mimetype, // Set content type
    },
  });

  blobStream.on("finish", () => {
    // Construct the public URL for the uploaded file
    const fileUrl = `https://firebasestorage.googleapis.com/v0/b/${
      firebaseBucket.name
    }/o/${encodeURIComponent(fileName)}?alt=media`;

    req.fileUrl = fileUrl;
    next();
  });

  blobStream.on("error", (err) => {
    next(new HttpError("File upload failed", 500));
  });

  blobStream.end(file.buffer);
};

exports.fileUpload = fileUpload;
exports.uploadFileToFirebase = uploadFileToFirebase;
