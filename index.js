const http = require('http');
const {handleReqRes} = require('./helpers/handleReqRes');
const env = require('./helpers/environment');
const data = require('./lib/data');

const app = {};

// testing filesystem
// @TODO: will clean letter

//create data
// data.create('test', 'person', {'name': 'iPhone 15', 'price': '1499 euro'}, (err) => {
//     console.log(`error ${err}`);
// });

//read data
// data.read('test','person', (err,data) => {
//     console.log(err, data);
// });

//update file
// data.update('test', 'person',{'name': 'Aidul Islam', 'number': '01679733976'}, (err) => {
//     console.log(err);
// });

//delete file
// data.delete('test', 'per', (err) => {
//     console.log(err);
// });

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