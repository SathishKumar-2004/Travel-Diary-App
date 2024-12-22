const admin = require("firebase-admin");
const serviceAccount = require("./firebase-credentials.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "travel-diary-app-ce9dd.firebasestorage.app",
});

const bucket = admin.storage().bucket();
module.exports = bucket;
