const mongoose = require('mongoose');
const MongoSchema = mongoose.Schema;

const EditionSchema = new MongoSchema({
    name: {
        type: String,
        required: true,
        unique: true
    }
});


module.exports = EditionSchema;
