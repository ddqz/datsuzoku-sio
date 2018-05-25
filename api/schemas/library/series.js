const mongoose = require('mongoose');
const MongoSchema = mongoose.Schema;

const SeriesSchema = new MongoSchema({
    name: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    hash: String
}, {timestamps: true});


module.exports = SeriesSchema;
