const mongoose = require('mongoose');
const MongoSchema = mongoose.Schema;

const DefinitionType = new MongoSchema({
    name: {
        type: String,
        required: false,
        unique: true
    }
}, {timestamps: true});


module.exports = DefinitionType;
