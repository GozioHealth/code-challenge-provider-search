const {
  GetPhysicianById,
  GetPhysiciansByCoordinates,
  GetPhysiciansByAddress,
} = require("../services/PhysicianService");

const GetPhysicians = async (req, h) => {
  let {
    id,
    latitude,
    longitude,
    radius = 0,
    street_name,
    street_number,
    city,
    state,
    zipcode,
  } = req.query;

  let queryObj;
  if (id) {
    return GetPhysicianById(parseInt(id));
  }
  if (latitude && longitude) {
    return GetPhysiciansByCoordinates(parseInt(latitude), parseInt(longitude));
  } else if (street_name && street_number && city && state && zipcode) {
    queryObj = { street_name, street_number, city, state, zipcode };
  }
};

module.exports = { GetPhysicians };
