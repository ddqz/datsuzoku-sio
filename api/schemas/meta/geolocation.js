const mongoose = require('mongoose');
const MongoSchema = mongoose.Schema;

const ObsessionSchema = new MongoSchema({
    name: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true
    }
});


module.exports = ObsessionSchema;
