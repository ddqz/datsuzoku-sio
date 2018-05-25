const Admin = require('../admin'),
    Socket = {

        initServer: async ( socket ) => {
            Socket.socket = socket;
            Socket.socket.on('message', Socket.receiveMessage);
            Socket.socket.on('processEntity', Socket.processEntity);
            Socket.socket.on('batchEntity', Socket.batchEntity);
            Socket.socket.on('wikiSearch', Socket.wikiSearch);
            await Admin.initialPayload(Socket.socket);
            Socket.socket.emit('adminProgress', '...idle')
        },

        receiveMessage: ( data ) => {
            console.log(data)
        },

        sendMessage: ( message ) => {

            Socket.socket.emit('message', { message });

        },

        processEntity: async ( data ) => {
            let process = await Admin.processEntity(data, Socket.socket);

            Socket.socket.emit('updateEntity', process);
            Socket.socket.emit('adminProgress', '...idle');
        },

        wikiSearch: async ( data ) => {
            let search = await Admin.wikiSearch(data, Socket.socket);

            Socket.socket.emit('updateSearch', search);
            Socket.socket.emit('adminProgress', '...idle');
        },

        batchEntity: async ( data ) => {

            let batch = await Admin.batchEntity(data, Socket.socket);
            Socket.socket.emit('adminProgress', '...idle');


        }

    };

module.exports = Socket;