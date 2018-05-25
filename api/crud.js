const connection = require('./connection'),
    {ObjectId} = require('mongoose').Schema,
    moment = require('moment');

const CrudAPI = {
    async run(queryParams, callback) {
        let response = {};
        const crudDB = connection[queryParams.db][queryParams.collection];
        let sort = queryParams.sort,
            limit = queryParams.limit,
            skip = queryParams.limit ? (queryParams.page - 1) * queryParams.limit : false,
            returner;

        if (queryParams.scope === 'all') {
            returner = await crudDB.find({}).sort(sort).skip(skip).limit(limit).exec().then(async (data) => {
                response = data;
                let count = await crudDB.count().exec().then();
                return {page: queryParams.page || 1, total_pages: Math.ceil(count / limit), count, data}
            }).catch((err) => {
                return err
            });
        } else if (queryParams.scope === 'allFiltered') {
            returner = await crudDB.find(queryParams.filters.filter, queryParams.filters.returns).sort(sort).skip(skip).limit(limit).exec().then(async (data) => {
                response = data;
                let count = await crudDB.count().exec().then();
                return {page: queryParams.page || 1, total_pages: Math.ceil(count / limit), count, data};
            }).catch((err) => {
                return err
            })
        } else if (queryParams.scope === 'single') {
            returner = await crudDB.findById(queryParams.id).exec().then((data) => {
                response = data;
                return response;
            }).catch((err) => {
                return err
            })
        } else if (queryParams.scope === 'singleByType') {
            returner = await crudDB.findOne(queryParams.data).exec().then((data) => {
                response = data;
                return response;
            }).catch((err) => {
                return err
            });
        } else if (queryParams.scope === 'create') {
            const db = new crudDB();
            for (let key of Object.keys(queryParams.data)) {
                db[key] = queryParams.data[key];
            }
            returner = await db.save().then((data) => {
                response = data;
                return response;
            }).catch((err) => {
                return err
            })
        } else if (queryParams.scope === 'delete') {
            returner = await crudDB.findById(queryParams.id).exec().then(() => {
                crudDB.remove({_id: queryParams.id}, (e) => {
                    if (e) {
                        response = {'type': 'delete', 'success': false, 'message': 'Error deleting' + queryParams.id};
                    } else {
                        response = {
                            'type': 'delete',
                            'success': true,
                            'message': 'Data associated with ' + queryParams.collection + ' ' + queryParams.id + ' has been deleted'
                        };
                    }
                    return response;
                });
            }).catch((err) => {
                return err
            });
        } else if (queryParams.scope === 'deleteAll') {
            // crudDB.remove({}).exec().then((data) => {
            // 	response = {data: data};
            // 	callback(response)
            // })
            callback({error: true, message: 'No permissions to delete.'})
        } else if (queryParams.scope === 'update') {
            returner = await crudDB.findById(queryParams.id).exec().then(async (data) => {
                for (let key of Object.keys(queryParams.data)) {
                    data[key] = queryParams.data[key];
                }
                return await data.save().then((data) => {
                    response = data;
                    return response;
                }).catch((err) => {
                    return err
                })
            })
        } else if (queryParams.scope === 'query') {
            const dat = queryParams.data,
                limit = Number(queryParams.limit),
                page = Number(queryParams.page);
            let query = {},
                sort = '-id',
                meta = null;
            if (dat.author && dat.author.length > 0) {
                query['byline.authors'] = {$elemMatch: {name: {$in: dat.author}}}
            }
            if (dat.edition && dat.edition.length > 0) {
                query['edition'] = {$in: dat.edition}
            }
            if (dat.obsession && dat.obsession.length > 0) {
                query['taxonomies.obsession'] = {$elemMatch: {slug: {$in: dat.obsession}}}
            }
            if (dat.topic && dat.topic.length > 0) {
                query['taxonomies.topic'] = {$elemMatch: {slug: {$in: dat.topic}}}
            }
            if (dat.series && dat.series.length > 0) {
                query['taxonomies.qz_series'] = {$elemMatch: {slug: {$in: dat.series}}}
            }
            if (dat.tags && dat.tags.length > 0) {
                query['taxonomies.tags'] = {$elemMatch: {name: {$regex: dat.tags.join('|'), $options: 'i'}}}
            }
            if (dat.query && dat.query.length > 0) {
                query['$text'] = {$search: dat.query};
                meta = {'score': {$meta: 'textScore'}};
                // sort = {'score': {'$meta': 'textScore'}};
            }
            let results;
            if (dat.ids && dat.ids.length > 0) {
                results = await crudDB.find(query, meta).where({_id: dat.ids}).sort(sort).limit(limit).skip(page - 1).select('id title hero summary byline edition postType date taxonomies permalink').exec().then();
            } else {
                results = await crudDB.find(query, meta).sort(sort).limit(limit).skip((page -1) * limit).select('id title hero summary byline edition postType date taxonomies permalink').exec().then();
            }
            let count = await crudDB.count(query).exec().then();
            returner = {count, page, data: results}
        } else if (queryParams.scope === 'processEntity') {
            let data = queryParams.data,
                wikiDB = connection.meta.wikipedia,
                textDB = connection.meta.text,
                blockDB = connection.meta.block,
                dtypeDB = connection.meta.definitionType,
                {entity, wikipedia} = data;

            returner = {};

            if(entity){
                let entity_exists = await crudDB.findOne({$or: [{lemma: entity.lemma}, {name: entity.name}]}).exec().then();
                if(!entity_exists){
                    entity_exists = new crudDB(entity)
                }

                if(wikipedia) {
                    let wiki_exists = await wikiDB.findOne({$or: [{title: wikipedia.title}, {url: wikipedia.url}]});

                    if(!wiki_exists){
                        wiki_exists = new wikiDB({title: wikipedia.title, url: wikipedia.url, info: wikipedia.info, image: wikipedia.image, block: [], text: []});
                        for(let block of wikipedia.blocks){
                            let { text, type } = block;
                            if(text) {
                                let text_exists = await textDB.findOne({text}).exec().then();
                                if(!text_exists){
                                    text_exists = new textDB({text})
                                }

                                let block_exists = await blockDB.findOne({text: text_exists._id}).exec().then();
                                if(!block_exists){
                                    block_exists = new blockDB({text: text_exists._id, type})
                                }

                                wiki_exists.text.push(text_exists._id);
                                wiki_exists.block.push(block_exists._id);
                                await text_exists.save().then();
                                await block_exists.save().then();
                            }
                        }
                    }

                    let dtype_exists = await dtypeDB.findOne({name: 'wikipedia'}).exec().then()

                    if(!dtype_exists) {
                        dtype_exists = new dtypeDB({name: 'wikipedia'});
                        await dtype_exists.save().then()
                    }

                    entity_exists.definition.push({type: dtype_exists._id, definition: wiki_exists._id});

                    await wiki_exists.save().then();
                    await entity_exists.save().then();

                    returner.entity = entity_exists;
                    returner.wikipedia = wiki_exists;
                }
            }

        }

        return returner
    }
};

module.exports = {CrudAPI, connection};