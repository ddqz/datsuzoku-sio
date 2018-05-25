const mongoose = require('mongoose'),
    {Schema} = mongoose,
    {ObjectId} = Schema,
    MediaSchema = new Schema({
        mediaType: {
            type: ObjectId,
            ref: 'mediaTypeData',
            required: true
        },
        url: {
            type: ObjectId,
            ref: 'urlData',
            required: false
        },
        content: {
            type: String
        },
        hash: String
    }, {timestamps: true});


module.exports = MediaSchema;
