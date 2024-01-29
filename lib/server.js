const http = require('http');
const {handleReqRes} = require('../helpers/handleReqRes');

const server = {};

server.config = {
    port: 3000,
};

server.createServer = () => {
    const createServerVariable = http.createServer(server.handleReqRes);
    
    createServerVariable.listen(server.config.port, () => {
        console.log(`server running at port ${server.config.port}`);
    });
}

//handle request and response
server.handleReqRes = handleReqRes;

//start server
server.init = () => {
    server.createServer();
}

module.exports = server;