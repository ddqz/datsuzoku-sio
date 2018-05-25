const mongoose = require('mongoose');
const MongoSchema = mongoose.Schema;

const SeriesSchema = new MongoSchema({
    abbr: {
        type: String,
        required: true,
        unique: true
    },
    name: String
});


module.exports = SeriesSchema;
