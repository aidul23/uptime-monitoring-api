const {aboutHandle} = require('./handlers/routeHandlers/aboutHandler');
const { contactHandle } = require('./handlers/routeHandlers/contactHandler');
const { userHandle } = require('./handlers/routeHandlers/userHandler');

const routes = {
    'about': aboutHandle,
    'contact': contactHandle,
    'user': userHandle,
}

module.exports = routes;