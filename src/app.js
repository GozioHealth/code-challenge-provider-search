var FS = require('fs');
var Hapi = require('@hapi/hapi');
var MongoDB = require('mongodb');
var MongoMemoryServer  = require('mongodb-memory-server');

var started = false;
var server = Hapi.server({ port: 8080 });

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
    if (started) return; started = true;

    // If we are running this from the command line then stage the in-memory database
    if (require.main === module) {
      var data = JSON.parse(FS.readFileSync('./test/db.json'));
      var mongod = await MongoMemoryServer.MongoMemoryServer.create();
      mongoClient = await MongoDB.MongoClient.connect(mongod.getUri());
      await mongoClient.db('code-challenge').collection('physicians').insertMany(data);
    }

    // Configure mongoClient if not already defined
    mongoClient = mongoClient || await MongoDB.MongoClient.connect('mongodb://localhost:27017');

    // Define our server routes
    server.route({
      path: '/search',
      method: 'get',
      handler: async (req, h) => {
        let results = [];
        var physicians = await mongoClient.db('code-challenge').collection('physicians').find().toArray();

        for (var i = 0; i < physicians.length; i++) {
          for (var j = 0; j < physicians[i].practices.length; j++) {
            for (var k = 0; k < physicians[i].practices[j].locations.length; k++) {
              // Find based on id
              if (physicians[i].id == req.query.id) {
                results.push(physicians[i]);
              }

              // Find based on lat/lng
              if (physicians[i].practices[j].locations[k].geocode.latitude == req.query.latitude && physicians[i].practices[j].locations[k].geocode.longitude == req.query.longitude) {
                results.push(physicians[i]);
              }

              // Find based on address
              if (
                physicians[i].practices[j].locations[k].geocode.street_name === req.query.street_name &&
                physicians[i].practices[j].locations[k].geocode.street_number === req.query.street_number &&
                physicians[i].practices[j].locations[k].geocode.city === req.query.city &&
                physicians[i].practices[j].locations[k].geocode.state === req.query.state &&
                physicians[i].practices[j].locations[k].geocode.zipcode === req.query.zipcode
              ) {
                results.push(physicians[i]);
              }
            }
          }
        }

        return results.map(res => ({ name: res.name }));
      },
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
