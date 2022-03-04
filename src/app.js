const FS = require("fs");
const Hapi = require("@hapi/hapi");

const DB = require("./db");
const { PhysicianRoutes } = require("./routes");

let serverStarted = false;
const server = Hapi.server({ port: 8080 });

module.exports = {
  /**
   * start
   *
   * Will start the Hapi Server, configure routes, and optionally load in test data
   *
   * @param mongoClient
   */
  start: async (mongoClient) => {
    // If server already started; nothing to do
    if (serverStarted) return;
    serverStarted = true;

    // If we are running this from the command line then stage the in-memory database
    if (require.main === module) {
      mongoClient = await DB.initDB();
    }

    // Configure mongoClient if not already defined
    mongoClient = await DB.getDBConnection();

    // Define our server routes
    server.route({
      path: "/search",
      method: "get",
      handler: PhysicianRoutes.GetPhysicians,
    });

    return server.start();
  },
};

/**
 * Start the module when called from the command line
 */
if (require.main === module) {
  module.exports.start();
}
