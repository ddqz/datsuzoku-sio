const mongoose = require('mongoose');
const MongoSchema = mongoose.Schema;

const TextSchema = new MongoSchema({
    text: {
        type: String
    },
    hash: String
}, {timestamps: true});

TextSchema.index({name: 'text', text: 'text'});
module.exports = TextSchema;
