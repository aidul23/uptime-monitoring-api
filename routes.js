const { userHandle } = require('./handlers/routeHandlers/userHandler');
const { tokenHandle } = require('./handlers/routeHandlers/tokenHandler');
const { checkHandle } = require('./handlers/routeHandlers/checkHandler');

const routes = {
    'user': userHandle,
    'token': tokenHandle,
    'check': checkHandle
}

module.exports = routes;