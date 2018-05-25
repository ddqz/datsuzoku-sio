const mongoose = require('mongoose');
const MongoSchema = mongoose.Schema;

const AuthorSchema = new MongoSchema({
    username: {
        type: String
    },
    name: {
        type: String
    },
    url: {
        type: String
    },
    twitter: {
        type: String
    },
    bio: {
        type: String,
        required: false
    },
    title: {
        type: String,
        required: false
    },
    contributor: {
        type: Boolean,
        default: false
    },
    image_url: String,
});


module.exports = AuthorSchema;
