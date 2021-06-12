const _ = require('lodash');
const configDb = require('../../config').mongo;
const mongodb = require('mongodb');
const mongoClient = mongodb.MongoClient;

let mongoInstance = {}

// let dbName = 'portfolio';
// let mcKey = 'portfolio';

let dbName = 'pp';
let mcKey = 'pp';

const _mongo = {
   getConn: async (collection) => {
      let mc;
      if (mongoInstance[mcKey]) {
         mc = mongoInstance[mcKey].client;
         if (!mc.isConnected()) {
            mc = await mongoClient.connect(mc.info[0], mc.info[1]);
         }
      } else {
         mc = await mongoClient.connect(configDb.connStr, configDb.options);
         mongoInstance[mcKey] = {};
         mongoInstance[mcKey].client = mc;
         mongoInstance[mcKey].info = [configDb.connStr, configDb.options]
      }
      return mc.db(dbName).collection(collection);
      
   },
   ObjectId: mongodb.ObjectId
};

module.exports = _mongo;