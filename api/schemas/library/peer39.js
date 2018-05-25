const mongoose = require('mongoose');
const MongoSchema = mongoose.Schema;

const Peer39Schema = new MongoSchema({
     categoryId: {
         type: Number,
         required: true,
         unique: true
     },
     category: {
         type: String
     },
     subCategory: {
         type: String
     },
     detail: {
         type: String
     },
    hash: String
}, {timestamps: true});


module.exports = Peer39Schema;
