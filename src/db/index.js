const MongoDB = require("mongodb");
const MongoMemoryServer = require("mongodb-memory-server");
const FS = require("fs");
const path = require("path");

let mongoClient;

const initDB = async () => {
  const data = JSON.parse(
    FS.readFileSync(path.join(__dirname, "../../test/db.json"))
  );
  const mongod = await MongoMemoryServer.MongoMemoryServer.create();
  mongoClient = await MongoDB.MongoClient.connect(mongod.getUri());
  await mongoClient
    .db("code-challenge")
    .collection("physicians")
    .insertMany(data);
  return mongoClient;
};

const getDBConnection = async () => {
  return (
    mongoClient ||
    (await MongoDB.MongoClient.connect("mongodb://localhost:27017"))
  );
};

const getClient = () => {
  return mongoClient;
};

const getPhysicianCollection = () => {
  return mongoClient.db("code-challenge").collection("physicians");
};

module.exports = { initDB, getDBConnection, getClient, getPhysicianCollection };
