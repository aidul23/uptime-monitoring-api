const {aboutHandle} = require('./handlers/routeHandlers/aboutHandler');
const { contactHandle } = require('./handlers/routeHandlers/contactHandler');
const { userHandle } = require('./handlers/routeHandlers/userHandler');
const { tokenHandle } = require('./handlers/routeHandlers/tokenHandler');
const { checkHandle } = require('./handlers/routeHandlers/checkHandler');

const routes = {
    'about': aboutHandle,
    'contact': contactHandle,
    'user': userHandle,
    'token': tokenHandle,
    'check': checkHandle
}

module.exports = routes;