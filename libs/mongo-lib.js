const mongoose = require('mongoose');

let conn = null;

const uri = 'mongodb://firstuser123:1ZtFduYQp0apQbQr@docdb-2019-08-06-15-35-15.cluster-c32spoklot3h.us-east-1.docdb.amazonaws.com:27017/?ssl=true&ssl_ca_certs=rds-combined-ca-bundle.pem&replicaSet=rs0';

exports.handler = async function(event, context) {
  // Make sure to add this so you can re-use `conn` between function calls.
  // See https://www.mongodb.com/blog/post/serverless-development-with-nodejs-aws-lambda-mongodb-atlas
  context.callbackWaitsForEmptyEventLoop = false;

  // Because `conn` is in the global scope, Lambda may retain it between
  // function calls thanks to `callbackWaitsForEmptyEventLoop`.
  // This means your Lambda function doesn't have to go through the
  // potentially expensive process of connecting to MongoDB every time.
  if (conn == null) {
    conn = await mongoose.createConnection(uri, {
      // Buffering means mongoose will queue up operations if it gets
      // disconnected from MongoDB and send them when it reconnects.
      // With serverless, better to fail fast if not connected.
      bufferCommands: false, // Disable mongoose buffering
      bufferMaxEntries: 0 // and MongoDB driver buffering
    });
    conn.model('Test', new mongoose.Schema({ name: String }));
  }

  const M = conn.model('Test');

  const doc = await M.findOne();
  console.log(doc);

  return doc;
};