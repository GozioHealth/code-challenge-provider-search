const DB = require("../db");
const GetPhysicianById = async (id) => {
  const physician = await DB.getPhysicianCollection().findOne({ id });
  return { id: physician.id, name: physician.name };
};

const GetPhysiciansByCoordinates = async (latitude, longitude) => {
  // todo : figure out this nested geo query
  const physicians = await DB.getPhysicianCollection().aggregate([
    {
      $geoNear: {
        near: { type: "Point", coordinates: [longitude, latitude] },
        key: "locations",
        distanceField: "dist.calculated",
      },
    },
    { $limit: 5 },
  ]);
  return physicians.map((p) => ({ name: p.name }));
};
const GetPhysiciansByAddress = async () => {
  return [];
};

module.exports = {
  GetPhysicianById,
  GetPhysiciansByCoordinates,
  GetPhysiciansByAddress,
};
