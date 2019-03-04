const mongo = require("mongodb").MongoClient;
let clients = {};

const getMongoClient = async url => {
  if (!clients[url]) {
    clients[url] = await mongo
      .connect(url, { useNewUrlParser: true })
      .catch(e => {
        throw e;
      });
    return clients[url];
  }
  return clients[url];
};
module.exports = {
  getMongoClient
};
