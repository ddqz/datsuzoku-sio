const mongoose = require('mongoose');
const MongoSchema = mongoose.Schema,
    {ObjectId} = MongoSchema;

const AuthorSchema = new MongoSchema({
    authorId: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String
    },
    name: {
        type: String
    },
    organization: String,
    title: {
        type: String,
        required: false
    },
    bio: {
        type: ObjectId,
        ref: 'textData',
        required: false
    },
    url: {
        type: ObjectId,
        ref: 'urlData'
    },
    twitter: {
        type: ObjectId,
        ref: 'urlData'
    },
    facebook: {
        type: ObjectId,
        ref: 'urlData'
    },
    linkedin: {
        type: ObjectId,
        ref: 'urlData'
    },
    hash: String
}, {timestamps: true});


module.exports = AuthorSchema;
