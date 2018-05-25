const mongoose = require('mongoose');
const MongoSchema = mongoose.Schema;
const {ObjectId} = MongoSchema;

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
        type: ObjectId,
        ref: 'textData',
        required: true
    },
    date: Date,
    link: {
        type: ObjectId,
        ref: 'urlData',
        required: true
    },
    authors: [{
        type: ObjectId,
        ref: 'authorData'
    }],
    subtype: {
        type: String,
        required: false
    },
    sections: {
        type: ObjectId,
        ref: 'sectionData',
        required: false
    },
    hash: {
        type: String
    },
    blocks: [{
        type: ObjectId,
        ref: 'blockData'
    }],
    text: [{
        type: ObjectId,
        ref: 'textData',
        required: false
    }],
    interactiveSource: {
        type: String
    },
    bulletin: Array,
    featuredImage: {
        type: ObjectId,
        ref: 'mediaData'
    },
    peer39: [{
        type: ObjectId,
        ref: 'peer39Data'
    }],
    editions: [{
        type: ObjectId,
        ref: 'editionData',
        required: false
    }],
    serieses: [{
        type: ObjectId,
        ref: 'seriesData',
        required: false
    }],
    obsessions: [{
        type: ObjectId,
        ref: 'obsessionData',
        required: false
    }],
    tags: [{
        type: ObjectId,
        ref: 'tagData',
        required: false
    }],
    topics: [{
        type: ObjectId,
        ref: 'topicData',
        required: false
    }]
}, {timestamps: true});

module.exports = PostSchema;
