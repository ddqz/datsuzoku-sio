const mongoose = require('mongoose');
const MongoSchema = mongoose.Schema,
    {ObjectId} = MongoSchema;

const Wikipedia = new MongoSchema({
    title: {
        type: String,
        required: false
    },
    url: {
        type: String,
        required: false
    },
    info: {
        type: Object,
        required: false
    },
    block: [{
        type: ObjectId,
        ref: 'blockData'
    }],
    text: [{
        type: ObjectId,
        ref: 'textData'
    }],
    hash: {
        type: String
    },
    image: String
}, {timestamps: true});

Wikipedia.index({'info': 'text'});


module.exports = Wikipedia;
