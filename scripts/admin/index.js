const connection = require('../../api/connection'),
    ObsessionData = require('../../static/training/training_obsessions'),
    EntityData = require('../../static/training/training_entities'),
    fetch = require('isomorphic-unfetch'),
    Admin = {
        processEntity: async ( data, socket = false ) => {
            let entityDB = connection.meta.entity,
                wikiDB = connection.meta.wikipedia,
                textDB = connection.meta.text,
                blockDB = connection.meta.block,
                dtypeDB = connection.meta.definitionType, { entity, wikipedia } = data,
                returner = {};

            if ( entity ) {
                let entity_exists = await entityDB.findOne({
                    $or: [
                        { name: entity.name }
                    ]
                }).exec().then();
                if ( !entity_exists ) {
                    entity_exists = new entityDB(entity);
                    if ( socket ) socket.emit('adminProgress', `Created new entity: ${entity.name}`)
                } else {
                    if(entity_exists.lemma !== entity.lemma){
                        entity_exists.lemma = entity.lemma
                    }
                    if(entity_exists.name !== entity.name){
                        entity_exists.name = entity.name
                    }
                    if(entity_exists.entity !== entity.entity){
                        entity_exists.entity = entity.entity
                    }
                }

                if ( wikipedia && Object.keys(wikipedia).length > 0 ) {
                    let definitions = entity_exists.definition.map(obj => obj.definition),
                        wiki_exists;
                    if(definitions.length === 0) {
                        wiki_exists = await wikiDB.findOne({
                            $or: [
                                { title: wikipedia.title },
                                { url: wikipedia.url }
                            ]
                        });
                    } else {
                        wiki_exists = await wikiDB.findOne({
                            $or: [
                                { title: wikipedia.title },
                                { url: wikipedia.url },
                                { _id: definitions }
                            ]
                        });
                    }

                    if ( !wiki_exists ) {
                        wiki_exists = new wikiDB({
                            title: wikipedia.title,
                            url: wikipedia.url,
                            info: wikipedia.info,
                            image: wikipedia.image,
                            block: [],
                            text: []
                        });
                        if ( socket ) socket.emit('adminProgress', `Created new Wikipedia entry: ${wikipedia.title}`);
                        let i = 1;
                        if ( socket ) socket.emit('adminProgress', `Saving ${wikipedia.blocks.length} text blocks`)
                        for ( let block of wikipedia.blocks ) {
                            let { text, type } = block;
                            if ( text ) {
                                let text_exists = await textDB.findOne({ text }).exec().then();
                                if ( !text_exists ) {
                                    text_exists = new textDB({ text })
                                }

                                let block_exists = await blockDB.findOne({ text: text_exists._id }).exec().then();
                                if ( !block_exists ) {
                                    block_exists = new blockDB({
                                        text: text_exists._id,
                                        type
                                    })
                                }

                                wiki_exists.text.push(text_exists._id);
                                wiki_exists.block.push(block_exists._id);
                                await text_exists.save().then();
                                await block_exists.save().then();
                            }
                            i++;
                        }
                    }

                    let dtype_exists = await dtypeDB.findOne({ name: 'wikipedia' }).exec().then()

                    if ( !dtype_exists ) {
                        dtype_exists = new dtypeDB({ name: 'wikipedia' });
                        await dtype_exists.save().then()
                    }

                    if(!entity_exists.definition.find(obj => obj._id === wiki_exists._id)) {
                        entity_exists.definition.push({
                            type: dtype_exists._id,
                            definition: wiki_exists._id
                        });
                    }

                    await wiki_exists.save().then();

                    if ( socket ) socket.emit('adminProgress', `Saved \nEntity: "${entity_exists.name}" \nWikipedia entry: "${wiki_exists.title}"`);

                    returner.wikipedia = wiki_exists;
                }
                returner.entity = entity_exists;
                await entity_exists.save().then();
            }

            return returner
        },

        wikiSearch: async ( data, socket = false ) => {
            let entityDB = connection.meta.entity,
                wikiDB = connection.meta.wikipedia,
                search_results, { lemma, name } = data,
                lookup = lemma ? [name, lemma] : [name],
                exists = await entityDB.findOne({$or: [{name: lookup}, {lemma: lookup}]}).populate([{path: 'definition.type', select: 'name'}]).exec().then();

            if(!exists || (exists && exists.definition.length === 0)) {
                if ( lemma ) {
                    if ( socket ) socket.emit('adminProgress', `Looking up: ${lemma}`);
                    search_results = await Admin.wikiApi({ name: lemma })
                }

                if ( !search_results ) {
                    if ( socket ) socket.emit('adminProgress', `Looking up: ${name}`);
                    search_results = await Admin.wikiApi({ name })
                }
                if ( search_results.results && search_results.results.results ) {
                    let { content, image, info } = search_results.results.results,
                        url = 'https://en.wikipedia.org/wiki/' + encodeURI(search_results.results.results.name),
                        clean_info = [];

                    content = content ? content.split('\n').filter(o => o).map(obj => {
                        if ( /\s?={2,}\s?/i.test(obj) ) {
                            return {
                                text: obj.split(/\s?={2,}\s?/i).join(''),
                                type: 'header'
                            }
                        } else {
                            return { text: obj }
                        }
                    }) : false;
                    if ( info ) {
                        info = Object.keys(info).map(key => Object.assign({ type: key }, info[ key ]));
                        for ( let i of info ) {
                            if ( Object.keys(i).length > 1 ) {
                                for ( let key of Object.keys(i) ) {
                                    if ( typeof i[ key ] === 'string' && /bulleted list|{{|}}/i.test(i[ key ]) ) {
                                        delete i[ key ]
                                    }
                                }
                                clean_info.push(i)
                            }
                        }
                    }

                    return {
                        results: {
                            content,
                            image,
                            name: search_results.results.results.name,
                            url,
                            info: clean_info
                        },
                        content
                    }
                } else {
                    return { results: false }
                }
            } else if (exists && exists.definition.length > 0){
                let d_object = exists.definition.find(obj => obj.type.name === 'wikipedia'),
                    definition = d_object ? await wikiDB.findOne({_id: d_object.definition}).populate([{path: 'block', populate: {path: 'text', select: 'text'}}]).select('block info url title image').exec().then() : false,
                    {block, info, url, title, image, _id} = definition;
                block = block.map(obj => { if(obj.type){return {type: obj.type, text: obj.text.text }} else { return {text: obj.text.text}}});

                return {results: {content:block, info, url, name: title, image, _id}, content: block}

            } else {
                return {results: false}
            }
        },

        wikiApi: async ( data ) => {
            let search_fetch = await fetch(process.env.GATHERER_API + 'wiki', {
                method: 'post',
                body: JSON.stringify(data),
                headers: { 'Content-Type': 'application/json' }
            });
            return await search_fetch.json()

        },

        initialPayload: async ( socket = false ) => {

            if ( socket ) socket.emit('adminProgress', `Getting initial payload...`);
            let entities = [],
                entityDB = connection.meta.entity,
                existing_entities = await entityDB.find({}).exec().then(),
                entity_data = {},
                obsession_data = [];

            existing_entities = existing_entities.map(obj => obj._doc);

            if ( socket ) socket.emit('adminProgress', `Parsing entity data.`);

            for ( let type of Object.keys(EntityData) ) {
                let tags = EntityData[ type ];
                entity_data[ type ] = [];
                tags = tags.map(obj => {
                    let exists = existing_entities.find(ex => ex.name === obj.name);
                    if ( !exists ) {
                        return obj
                    } else {

                        return Object.assign({
                            count: obj.count,
                            tag_id: obj.tag_id
                        }, exists)
                    }
                });
                for ( let entity of tags ) {
                    let exists = entities.find(( { name } ) => name === entity.name);
                    if ( !exists ) {
                        entities.push(entity);
                        entity_data[ type ].push(entity);
                    }
                }
            }

            if ( socket ) socket.emit('adminProgress', `Parsing obsession data.`);

            for ( let ob of ObsessionData ) {
                let new_ob = ob;

                new_ob.tags = ob.tags.map(obj => {
                    let full = Object.assign(entities.find(n => n.name === obj.name) || obj, { tag_id: obj._id });
                    let exists = existing_entities.find(ex => ex.name === full.name);
                    if ( !exists ) {
                        return full
                    } else {

                        return Object.assign({
                            count: obj.count,
                            tag_id: obj.tag_id
                        }, exists)
                    }
                });
                obsession_data.push(new_ob)
            }
            let types = [ ... new Set([].concat(...entities.map(( { entity } ) => entity ? entity.split(' ') : ''))) ].filter(o => o);

            if ( socket ) socket.emit('adminProgress', `Parsing entity types.`);

            let existing_fetch = await fetch(process.env.API_PATH + 'meta/type'),
                existing_types = await existing_fetch.json();
            for ( let type of types ) {
                let exists = existing_types.data.find(( { abbr } ) => abbr === type);
                if ( !exists ) {
                    let new_fetch = await fetch(process.env.API_PATH + 'meta/type', {
                        method: 'POST',
                        body: JSON.stringify({ abbr: type }),
                        headers: { 'Content-Type': 'application/json' }
                    });
                    exists = await new_fetch.json();
                    existing_types.data.push(exists)

                }
            }

            if ( socket ) socket.emit('initialPayload', {
                obsessions: obsession_data,
                entities: entity_data,
                allEntities: entities,
                entityTypes: existing_types.data
            });

            return {
                obsessions: obsession_data,
                entities: entity_data,
                allEntities: entities,
                entityTypes: existing_types.data
            }

        },

        batchEntity: async ( data, socket = false ) => {
            for ( let entity of data ) {
                let wiki = await Admin.wikiSearch(entity, socket),
                    exists = wiki.content && wiki.content.length > 0,
                    refer = exists && 50 > wiki.content[ 0 ].text.search(/refer to|refers to/i) && wiki.content[ 0 ].text.search(/refer to|refers to/i) > -1;
                if ( !refer && wiki.results && wiki.results.name ) {
                    let { content, results } = wiki, { image, info, name, url, _id } = results;
                    if ( socket ) socket.emit('adminProgress', `Cleaning up: ${name}`);

                    let output = {
                        entity,
                        wikipedia: {
                            title: name,
                            url,
                            image,
                            info,
                            _id,
                            blocks: content
                        }
                    };

                    if ( socket ) socket.emit('adminProgress', `Processing: ${name}`);
                    let processed = await Admin.processEntity(output, socket);

                    socket.emit('updateEntity', processed);
                } else {
                    if ( socket ) socket.emit('adminProgress', `No match: ${entity.name}`);

                }
            }
        }
    };

module.exports = Admin