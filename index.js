require('dotenv').config();
const body = require('body-parser');
const app = require('express')();
const server = require('http').Server(app)
const io = require('socket.io')(server, {cookie: false});
const next = require('next');
const cors = require('cors');
const Socket = require('./scripts/socket');

const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({dev});
const handle = nextApp.getRequestHandler();

const PORT = process.env.APP_PORT;
// const schemas = require('./api/schemas/meta/index');
// process.env.API_SCHEMAS = JSON.stringify(Object.assign({}, schemas));

/*
app.prepare();
*/


io.on('connection', socket => {
    Socket.initServer(socket);
});

nextApp.prepare().then(() => {

    app.use(body.json({limit: '1mb'}));
    app.use(cors());

    const api = require('./api');
    app.use('/api', api());

    app.use((req, res, next) => {
        next()
    });

    app.get('*', (req, res) => {
        return handle(req, res)
    });

    server.listen(PORT);

    console.log(`Listening on ${PORT}`)

})
