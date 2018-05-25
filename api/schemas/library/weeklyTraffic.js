const mongoose = require('mongoose'),
    {Schema} = mongoose,
    {ObjectId} = Schema,
    WeeklySchema = new Schema({
        timeframe: {
            type: ObjectId,
            required: true,
            ref: 'timeframeData'
        },
        post: {
            type: ObjectId,
            required: true,
            ref: 'postData'
        },
        value: Number,
        metricType: String,
        hash: String
    }, {timestamps: true});


module.exports = WeeklySchema;
