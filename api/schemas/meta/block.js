const mongoose = require('mongoose'),
    {Schema} = mongoose,
    {ObjectId} = Schema;

const BlockSchema = new Schema({
    hash: {
        type: String
    },
    text: {
        type: ObjectId,
        ref: 'textData'
    },
    type: String
}, {timestamps: true});


module.exports = BlockSchema;
