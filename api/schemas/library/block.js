const mongoose = require('mongoose'),
    {Schema} = mongoose,
    {ObjectId} = Schema;

const BlockSchema = new Schema({
    hash: {
        type: String,
        required: true
    },
    media: {
        type: ObjectId,
        required: false,
        ref: 'mediaData'

    },
    mediaType: {
        type: ObjectId,
        required: false,
        ref: 'mediaTypeData'

    },
    text: {
        type: ObjectId,
        ref: 'textData'
    },
    type: String,
    links: [{
        url: {
            type: ObjectId,
            ref: 'urlData'
        },
        text: {
            type: ObjectId,
            ref: 'textData'
        }
    }],
    src: String,
    table: String,
    blockquote: Boolean
}, {timestamps: true});


module.exports = BlockSchema;
