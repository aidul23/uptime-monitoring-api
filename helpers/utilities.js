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

//create random string
utilities.createRandomString = (stringLen) => {
    let length = stringLen;
    length = typeof(stringLen) === 'number' && stringLen > 0 ? stringLen : false;

    if(length) {
        let chatSet = "abcdefghijklmnopqrstuvwxyz1234567890";

        let output = "";

        for(let i = 1 ; i <= length ; i++) {
            let randomChat = chatSet.charAt(Math.floor(Math.random() * chatSet.length));
            output += randomChat;
        }
        return output;
    } 

    return false;
};



module.exports = utilities;