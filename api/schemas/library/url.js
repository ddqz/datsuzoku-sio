const mongoose = require('mongoose'),
    {Schema} = mongoose,
    {ObjectId} = Schema,
    UrlSchema = new Schema({
        domain: {
            type: ObjectId,
            ref: 'domainData'
        },
        url: {
            type: String
        },
        hash: String
    }, {timestamps: true});

UrlSchema.index({name: 'url', text: 'text'});
module.exports = UrlSchema;
