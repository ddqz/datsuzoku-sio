const mongoose = require('mongoose'),
    {Schema} = mongoose,
    TimeframeSchema = new Schema({
        start: Date,
        end: Date,
        hash: String
    });


module.exports = TimeframeSchema;
