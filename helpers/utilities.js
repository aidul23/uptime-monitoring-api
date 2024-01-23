const crypto = require('crypto');
const env = require('./environment');

const utilities = {};

//parse JSON string to object
utilities.parseJSON = (jsonString) => {
    let output;

    try {
        output = JSON.parse(jsonString);
    } catch (error) {   
        output = {};
    }

    return output;
};

//hashing
utilities.hash = (string) => {
    if(typeof(string) === 'string' && string.length > 0) {
        let hash = crypto.createHmac('sha256',env.secretKey)
                        .update(string)
                        .digest('hex');
        return hash;
    }
    else {
        return false;
    }
};



module.exports = utilities;