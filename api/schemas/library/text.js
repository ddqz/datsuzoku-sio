const mongoose = require('mongoose'),
    {Schema} = mongoose,
    TextSchema = new Schema({
        text: {
            type: String
        },
        hash: String
    }, {timestamps: true});

TextSchema.index({name: 'text', text: 'text'});
module.exports = TextSchema;
