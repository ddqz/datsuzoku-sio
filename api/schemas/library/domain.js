const mongoose = require('mongoose'),
    {Schema} = mongoose,
    DomainSchema = new Schema({
        domain: String,
        hash: String
    }, {timestamps: true});


module.exports = DomainSchema;
