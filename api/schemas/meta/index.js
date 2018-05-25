const PersonSchema = require('./person');
const BlockSchema = require('./block');
const WikipediaSchema = require('./wikipedia');
const DefinitionTypeSchema = require('./definitionType');
const TextSchema = require('./text');
const EntitySchema = require('./entity');
const EntityTypeSchema = require('./entityType');

module.exports = {
    text: TextSchema,
    block: BlockSchema,
    entityType: EntityTypeSchema,
    entity: EntitySchema,
    definitionType: DefinitionTypeSchema,
    wikipedia: WikipediaSchema
};