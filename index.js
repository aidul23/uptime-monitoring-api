const http = require('http');
const {handleReqRes} = require('./helpers/handleReqRes');
const env = require('./helpers/environment')

const app = {};

app.createServer = () => {
    const server = http.createServer(app.handleReqRes);
    
    server.listen(env.port, () => {
        console.log(`server running at port ${env.port}`);
    })
}

//handle request and response
app.handleReqRes = handleReqRes;

//start server
app.createServer();