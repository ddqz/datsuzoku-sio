const mongoose = require('mongoose');
const MongoSchema = mongoose.Schema;
const ObjectId = MongoSchema.Types.ObjectId;

const ArticleSchema = new MongoSchema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    permalink: {
        type: String,
        required: true
    },
    date: {},
    postType: {
        type: String,
        required: false
    },
    summary: {
        type: String,
        required: false
    },
    content: {
        type: String,
        required: false
    },
    text: {
        type: String,
        required: false
    },
    hero: {},
    interactive: {},
    byline: {},
    edition: {
        type: String,
        required: false
    },
    taxonomies: {}
});


module.exports = ArticleSchema;
