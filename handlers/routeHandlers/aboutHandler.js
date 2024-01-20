const handler = {}

handler.aboutHandle = (requestProperties, callback) => {
    console.log(requestProperties);
    callback(200, {
        message: 'About page'
    });
};

module.exports = handler;