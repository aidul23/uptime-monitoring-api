const {aboutHandle} = require('./handlers/routeHandlers/aboutHandler');
const { contactHandle } = require('./handlers/routeHandlers/contactHandler');

const routes = {
    'about': aboutHandle,
    'contact': contactHandle
}

module.exports = routes;