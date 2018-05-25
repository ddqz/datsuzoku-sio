const mongoose = require('mongoose');
const MongoSchema = mongoose.Schema;

const AnnualTrafficSchema = new MongoSchema({
    postId: {
        type: Number,
        required: true
    },
    year: {
        type: Number,
        default: 2017
    },
    words: {
        type: Number
    },
    rank: {
        desktop: Number,
        mobile: Number
    },
    start: {
        desktop: Number,
        mobile: Number
    },
    complete: {
        desktop: Number,
        mobile: Number
    },
    median: {
        desktop: Number,
        mobile: Number
    },
    mean: {
        desktop: Number,
        mobile: Number
    }

}, {timestamps: true});


module.exports = AnnualTrafficSchema;
