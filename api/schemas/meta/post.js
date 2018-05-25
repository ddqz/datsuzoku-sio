const mongoose = require('mongoose');
const MongoSchema = mongoose.Schema;
const ObjectId = MongoSchema.Types.ObjectId;

const PostSchema = new MongoSchema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    postId: {
        type: Number
    },
    title: {
        type: String,
        required: true
    },
    date: Date,
    link: {
        type: String,
        required: true
    },
    authors: Array,
    subtype: {
        type: String,
        required: false
    },
    sections: {
        type: Array,
        required: false
    },
    hash: {
        type: String
    },
    content: {
        type: String,
        required: false
    },
    blocks: {
        type: Array
    },
    text: {
        type: Array,
        required: false
    },
    interactiveSource: {
        type: String
    },
    bulletin: Array,
    featuredImage: {},
    peer39: [],
    editions: {
        type: Array,
        required: false
    },
    serieses: {
        type: Array,
        required: false
    },
    obsessions: {
        type: Array,
        required: false
    },
    tags: {
        type: Array,
        required: false
    },
    topics: {
        type: Array,
        required: false
    },
    urls: Array,
    inlineAds: Array,
    media: Object,
    headers: Array
});


module.exports = PostSchema;
