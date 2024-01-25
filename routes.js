const {aboutHandle} = require('./handlers/routeHandlers/aboutHandler');
const { contactHandle } = require('./handlers/routeHandlers/contactHandler');
const { userHandle } = require('./handlers/routeHandlers/userHandler');
const { tokenHandle } = require('./handlers/routeHandlers/tokenHandler');

const routes = {
    'about': aboutHandle,
    'contact': contactHandle,
    'user': userHandle,
    'token': tokenHandle,
}

module.exports = routes;