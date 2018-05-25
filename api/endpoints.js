module.exports = [
    {
        path: '/annual',
        collection: 'annualTraffic',
        limit: 20,
        sort: '-postId',
        search: 'postId',
        db: 'library',
        permissions: {
            all: true,
            create: true,
            single: true,
            singleByType: true,
            delete: true,
            deleteAll: false,
            update: true,
            filters: false
        },
        filters: []
    },
    {
        path: '/peer',
        collection: 'peer39',
        limit: 20,
        sort: '-categoryId',
        search: 'categoryId',
        db: 'library',
        permissions: {
            all: true,
            create: true,
            single: true,
            singleByType: true,
            delete: true,
            deleteAll: false,
            update: true,
            filters: false
        },
        filters: []
    },
/*
    {
        path: '/article',
        collection: 'article',
        limit: 20,
        sort: '-id',
        search: 'title',
        db: 'quartz',
        permissions: {
            all: true,
            create: true,
            single: true,
            singleByType: true,
            delete: true,
            deleteAll: false,
            update: true,
            filters: false
        },
        filters: []
    },
*/
    {
        path: '/library/post',
        collection: 'post',
        limit: 20,
        sort: '-id',
        search: 'postId',
        db: 'library',
        permissions: {
            all: true,
            create: true,
            single: true,
            singleByType: true,
            delete: true,
            deleteAll: false,
            update: true,
            filters: false
        },
        filters: []
    },
    /// Old Below
    {
        path: '/meta/type',
        collection: 'entityType',
        limit: 8000,
        sort: 'abbr',
        search: 'abbr',
        db: 'meta',
        permissions: {
            all: true,
            create: true,
            single: true,
            singleByType: true,
            delete: true,
            deleteAll: false,
            update: true,
            filters: false
        },
        filters: []
    },
    {
        path: '/meta/entity',
        collection: 'entity',
        limit: 8000,
        sort: 'name',
        search: 'name',
        db: 'meta',
        permissions: {
            all: true,
            create: true,
            single: true,
            singleByType: true,
            delete: true,
            deleteAll: false,
            update: true,
            filters: false
        },
        filters: []
    },
/*
    {
        path: '/edition',
        collection: 'edition',
        limit: 50,
        sort: 'name',
        search: 'name',
        db: 'quartz',
        permissions: {
            all: true,
            create: true,
            single: true,
            singleByType: true,
            delete: true,
            deleteAll: false,
            update: true,
            filters: false
        },
        filters: []
    },
    {
        path: '/obsession',
        collection: 'obsession',
        limit: 100,
        sort: 'name',
        search: 'name',
        db: 'quartz',
        permissions: {
            all: true,
            create: true,
            single: true,
            singleByType: true,
            delete: true,
            deleteAll: false,
            update: true,
            filters: false
        },
        filters: []
    },
    {
        path: '/series',
        collection: 'series',
        limit: 50,
        sort: 'name',
        search: 'name',
        db: 'quartz',
        permissions: {
            all: true,
            create: true,
            single: true,
            singleByType: true,
            delete: true,
            deleteAll: false,
            update: true,
            filters: false
        },
        filters: []
    },
    {
        path: '/tag',
        collection: 'tag',
        limit: 50,
        sort: 'name',
        search: 'name',
        db: 'quartz',
        permissions: {
            all: true,
            create: true,
            single: true,
            singleByType: true,
            delete: true,
            deleteAll: false,
            update: true,
            filters: false
        },
        filters: []
    },
    {
        path: '/topic',
        collection: 'topic',
        limit: 50,
        sort: 'name',
        search: 'name',
        db: 'quartz',
        permissions: {
            all: true,
            create: true,
            single: true,
            singleByType: true,
            delete: true,
            deleteAll: false,
            update: true,
            filters: false
        },
        filters: []
    },
    {
        path: '/pdf',
        collection: 'pdf',
        limit: 50,
        sort: 'title',
        search: 'title',
        db: 'quartz',
        permissions: {
            all: true,
            create: true,
            single: true,
            singleByType: true,
            delete: true,
            deleteAll: false,
            update: true,
            filters: false
        },
        filters: []
    },
    {
        path: '/webpage',
        collection: 'webpage',
        limit: 50,
        sort: 'title',
        search: 'title',
        db: 'quartz',
        permissions: {
            all: true,
            create: true,
            single: true,
            singleByType: true,
            delete: true,
            deleteAll: false,
            update: true,
            filters: false
        },
        filters: []
    }
*/
];