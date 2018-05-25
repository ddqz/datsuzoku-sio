const express = require('express');
const endpoints = require('./endpoints');
const {CrudAPI, connection} = require('./crud');

const apiRoutes = () => {
    const router = express.Router();

    for (let c = 0, len = endpoints.length; c < len; c++) {
        let endpoint = endpoints[c];
        let collection = endpoint.collection;
        let route_path = endpoint.path;
        let limit = endpoint.limit;
        let sort = endpoint.sort;
        let page = 1;
        let db = endpoint.db;

        if (endpoint.permissions.all) {
            router.get(route_path, async (req, res) => {
                let l = Number(req.query.limit) || limit,
                    p = Number(req.query.page) || page,
                    results = await CrudAPI.run({scope: 'all', collection: collection, db: db, limit: l, page: p, sort: sort}).then()
                res.json(results);
            });
        }

        if (endpoint.permissions.create) {
            router.post(route_path, async (req, res) => {
                let results = await CrudAPI.run({scope: 'create', collection: collection, db: db, data: req.body}).then()
                res.json(results);
            });
        }

        if (endpoint.permissions.single) {
            router.get(route_path + '/:id', async (req, res) => {

                let id = req.params.id ? req.params.id : false;
                if (id) {
                    let results = await CrudAPI.run({scope: 'single', collection: collection, db: db, id: id}).then();
                    res.json(results);

                } else {
                    res.json({error: true, message: 'Bad ID'})
                }
            });
        }

        if (endpoint.permissions.singleByType) {
            router.get(route_path + '/' + endpoint.search.charAt(0) + '/:name', async (req, res) => {

                let id = req.params.name;
                let body = {};
                body[endpoint.search] = id;

                let results = await CrudAPI.run({scope: 'singleByType', collection: collection, db: db, data: body}).then();
                res.json(results);
            });
        }

        if (endpoint.permissions.delete) {
            router.delete(route_path + '/:id', async (req, res) => {

                let id = req.params.id ? req.params.id : false;
                if (id) {
                    let results = await CrudAPI.run({scope: 'delete', collection: collection, db: db, id: id}).then();
                    res.json(results);
                } else {
                    res.json({error: true, message: 'Bad ID'});
                }
            });
        }

        if (endpoint.permissions.deleteAll) {
            router.delete(route_path + '/', async (req, res) => {

                let results = await CrudAPI.run({scope: 'deleteAll', collection: collection, db: db}).then()
                res.json(results);
            });
        }

        if (endpoint.permissions.update) {
            router.put(route_path + '/:id', async (req, res) => {

                let id = req.params.id ? req.params.id : false;
                if (id) {
                    let results = await CrudAPI.run({scope: 'update', collection: collection, db: db, id: id, data: req.body}).then()
                    res.json(results);
                } else {
                    res.json({error: true, message: 'Bad ID'})
                }
            });
        }

        if (endpoint.permissions.filters) {
            for (let f = 0, len = endpoint.filters.length; f < len; f++) {
                router.get(route_path + '/' + endpoint.filters[f].path, async (req, res) => {
                    let l = Number(req.query.limit) || limit,
                        p = Number(req.query.page) || page,
                        results = await CrudAPI.run({
                        scope: 'allFiltered',
                        collection: collection,
                        db: db,
                        limit: l,
                        page: p,
                        sort: sort,
                        filters: endpoint.filters[f]
                    }).then()
                    res.json(results);
                });
            }
        }

    }

    router.post('/process/entity', async (req, res) => {
        let results = await CrudAPI.run({scope: 'processEntity', collection: 'entity', db: 'meta', data: req.body}).then();
        res.json(results);
    });

    return router
};

module.exports = apiRoutes;