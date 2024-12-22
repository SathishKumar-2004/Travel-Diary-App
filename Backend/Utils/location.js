const axios = require("axios");
const HttpError = require("../Models/http-errors");

const getCoordsFromAddress = async (address) => {
  const response = await axios.get(
    ` https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
      address
    )}&format=json`
  );

  if (response.data.length === 0) {
    throw new HttpError(
      "Could not find the coordinates Enter a valid Address",
      422
    );
  }

  const coords = {
    lat: response.data[0].lat,
    lng: response.data[0].lon,
  };

  return coords;
};

module.exports = getCoordsFromAddress;
