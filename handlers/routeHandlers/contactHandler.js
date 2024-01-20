const handler = {}

handler.contactHandle = (requestProperties, callback) => {
    console.log(requestProperties);
    callback(200, {
        message: 'Contact page'
    });
};

module.exports = handler;