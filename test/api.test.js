var Axios = require("axios");
var MongoDB = require("mongodb");
var MongoMemoryServer = require("mongodb-memory-server");
var App = require("../src/app");
const DB = require("../src/db");

/**
 * Stage the mongo in memory database and start the server
 */
const stageData = async () => {
  // Load test data
  // Writes test data to in-memory database
  mongoClient = await DB.initDB();

  var count = await mongoClient
    .db("code-challenge")
    .collection("physicians")
    .count();
  expect(count).toBe(50);

  // Start API server
  await App.start(mongoClient);
};

describe("Location Search API", () => {
  test("search by id", async () => {
    await stageData();
    const response = await Axios.get("http://localhost:8080/search", {
      params: {
        id: 4,
      },
    });
    expect(response.status).toBe(200);
    expect(response.data).toMatchObject({ id: 4, name: "Physician4" });
  });

  test("search by lat/lng", async () => {
    await stageData();
    const response = await Axios.get("http://localhost:8080/search", {
      params: { latitude: 33.9037465, longitude: -84.3540817 },
    });
    expect(response.status).toBe(200);
    expect(response.data).toMatchObject([
      { name: "Physician0" },
      { name: "Physician3" },
      { name: "Physician5" },
      { name: "Physician10" },
      { name: "Physician15" },
      { name: "Physician32" },
      { name: "Physician37" },
      { name: "Physician39" },
      { name: "Physician42" },
    ]);
  });

  // test('search by full params', async () => {
  //   await stageData();
  //   const response = await Axios.get('http://localhost:8080/search', {
  //     params: {
  //       latitude: 33.9697175,
  //       longitude: -83.4127957,
  //       street_name: 'Langford Dr',
  //       street_number: 1181,
  //       city: 'WatkinsvIlle',
  //       state: 'GA',
  //       zipcode: 30677,
  //     },
  //   });
  //   expect(response.status).toBe(200);
  //   expect(response.data).toMatchObject([{ name: 'Physician6' } ]);
  // });

  // test('search by address', async () => {
  //   await stageData();
  //   const response = await Axios.get('http://localhost:8080/search', {
  //     params: {
  //       street_name: 'Langford Dr',
  //       street_number: 1181,
  //       city: 'Watkinsville',
  //       state: 'GA',
  //       zipcode: 30677,
  //     },
  //   });
  //   expect(response.status).toBe(200);
  //   expect(response.data).toMatchObject([{ name: 'Physician3' }]);
  // });
});
