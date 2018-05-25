const mongoose = require('mongoose');
const metaSchemas = require('./schemas/meta/index');
const librarySchemas = require('./schemas/library/index');

mongoose.Promise = global.Promise;
let cMongoose = mongoose.createConnection(process.env.MONGO_URL + process.env.META_DB);
let lMongoose = mongoose.createConnection(process.env.MONGO_URL + process.env.LIBRARY_DB);

let dbData = {meta: {}, library: {}};

for (let key of Object.keys(metaSchemas)){
    dbData.meta[key] = cMongoose.model(key+'Data', metaSchemas[key])
}
for (let key of Object.keys(librarySchemas)){
    dbData.library[key] = lMongoose.model(key+'Data', librarySchemas[key])
}
module.exports = dbData;
