const mongoose = require('mongoose');
const MongoSchema = mongoose.Schema,
    {ObjectId} = MongoSchema;

const EntitySchema = new MongoSchema({
    name: {
        type: String,
        required: true
    },
    entity: {
        type: String
    },
    lemma: String,
    definition: [{
        type: {
            type: ObjectId,
            ref: 'definitionTypeData'
        },
        definition: ObjectId
    }],
    relation: Array
}, {timestamps: true});


module.exports = EntitySchema;
