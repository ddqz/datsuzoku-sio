const mongoose = require('mongoose'),
    {Schema} = mongoose,
    MediaTypeSchema = new Schema({
        mediaType: {
            type: String,
            unique: true
        },
        hash: String
    }, {timestamps: true});


module.exports = MediaTypeSchema;
