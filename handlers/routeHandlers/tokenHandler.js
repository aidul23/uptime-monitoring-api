const data = require('../../lib/data');
const {hash} = require('../../helpers/utilities');
const {createRandomString} = require('../../helpers/utilities');
const {parseJSON} = require('../../helpers/utilities');

const handler = {}

handler.tokenHandle = (requestProperties, callback) => {
    const acceptedMethods = ['get','post','put','delete'];

    if(acceptedMethods.indexOf(requestProperties.method) > -1) {
        handler._token[requestProperties.method](requestProperties,callback);
    } else {
        callback(405);
    }
    
};

handler._token = {};

handler._token.post = (requestProperties, callback) => {
    const pNumber = typeof(requestProperties.body.pNumber) === 'string' && requestProperties.body.pNumber.trim().length == 10 ? requestProperties.body.pNumber : false; 

    const password = typeof(requestProperties.body.password) === 'string' && requestProperties.body.password.trim().length > 0 ? requestProperties.body.password : false;

    if(pNumber && password) {
        data.read('users',pNumber, (err, userData) => {
            let hashedPassword = hash(password);
            if(hashedPassword === parseJSON(userData).password) {
                let tokenId = createRandomString(20);
                let expire = Date.now() + 60 * 60 * 1000;
                let tokenObj = {
                    'pNumber': pNumber,
                    'id': tokenId,
                    'expire': expire
                };

                //store the token in DB
                data.create('tokens', tokenId, tokenObj, (err2) => {
                    if(!err) {
                        callback(200, tokenObj);
                    } else {
                        callback(500, {
                            error: 'server error'
                        });
                    }
                });
            } else {
                callback(400, {
                    error: 'password is not valid'
                });
            }
        });
    } else {
        callback(400, {
            error: 'problem in request'
        });
    }
}

handler._token.get = (requestProperties, callback) => {
    //check the token id is valid
    const id = typeof(requestProperties.queryStringObject.id) === 'string' && requestProperties.queryStringObject.id.trim().length == 20 ? requestProperties.queryStringObject.id : false; 

    if(id) {
        data.read('tokens', id, (err, t) => {
            const tokenData = {...parseJSON(t)};

            if(!err && tokenData) {
                callback(200, tokenData);
            } else {
                callback(404, {
                    error: 'not found'
                });
            }
        })
    } else {
        callback(404, {
            error: 'not found'
        });
    }
}

handler._token.put = (requestProperties, callback) => {
    
}

handler._token.delete = (requestProperties, callback) => {
    
}

module.exports = handler;