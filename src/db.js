const mongo = require('mongodb').MongoClient
let client = null

const getMongoClient = async(url) => {
    if (!client) {
        client = await mongo.connect(url,{ useNewUrlParser: true } ).catch(e=>{throw e});
        return client
    }
    return client;
}
module.exports = {
    getMongoClient
}