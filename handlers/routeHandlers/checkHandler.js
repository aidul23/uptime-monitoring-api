const data = require('../../lib/data');
const {parseJSON, createRandomString} = require('../../helpers/utilities');
const tokenHandle = require('./tokenHandler'); 
const {maxChecks} = require('../../helpers/environment')

const handler = {}

handler.checkHandle = (requestProperties, callback) => {
    const acceptedMethods = ['get','post','put','delete'];

    if(acceptedMethods.indexOf(requestProperties.method) > -1) {
        handler._check[requestProperties.method](requestProperties,callback);
    } else {
        callback(405);
    }
    
};

handler._check = {};

handler._check.post = (requestProperties, callback) => {
    let protocol = typeof(requestProperties.body.protocol) === 'string' &&
                    ['http','https'].indexOf(requestProperties.body.protocol) > -1 ? requestProperties.body.protocol : false;

    let url = typeof(requestProperties.body.url) === 'string' &&
                    requestProperties.body.url.trim().length > 0 ? requestProperties.body.url : false;
    
    let method = typeof(requestProperties.body.method) === 'string' &&
                     ['GET','POST','PUT','DELETE'].indexOf(requestProperties.body.method) > -1 ? requestProperties.body.method : false;

    let successCodes = typeof(requestProperties.body.successCodes) === 'object' &&
                     requestProperties.body.successCodes instanceof Array ? requestProperties.body.successCodes : false;

    let timeoutSeconds = typeof(requestProperties.body.timeoutSeconds) === 'number' && 
                    requestProperties.body.timeoutSeconds % 1 === 0 && requestProperties.body.timeoutSeconds >= 1 && requestProperties.body.timeoutSeconds <= 5 ? requestProperties.body.timeoutSeconds : false;

    if(protocol && url && method && successCodes && timeoutSeconds) {
        let token = typeof(requestProperties.headerObject.token === 'string') ? requestProperties.headerObject.token : false;

        data.read('tokens',token, (err1, tokenData) => {
            if(!err1 && tokenData) {
                let userPhone = parseJSON(tokenData).pNumber;

                data.read('users', userPhone, (err2,userData) => {
                    if(!err2 && userData) {
                        tokenHandle._token.verify(token, userPhone, (tokenIsValid) => {
                            if(tokenIsValid) {
                                let userObj = parseJSON(userData);

                                let userChecks = typeof(userObj.checks) === 'object' && userObj.checks instanceof Array ? userObj.checks : [];

                                if(userChecks.length < maxChecks) {
                                    let checkID = createRandomString(20);
                                    let checkObj = {
                                        'id': checkID,
                                        'userPhone': userPhone,
                                        'protocol': protocol,
                                        'url': url,
                                        'method': method,
                                        'successCodes': successCodes,
                                        'timeoutSeconds': timeoutSeconds
                                    };

                                    data.create('checks', checkID, checkObj, (err3) => {
                                        if(!err3) {
                                            //add check id to users object
                                            userObj.checks = userChecks;
                                            userObj.checks.push(checkID);

                                            data.update('users',userPhone,userObj, (err4) => {
                                                if(!err4) {
                                                    callback(200, checkObj);
                                                } else {
                                                    callback(500, {
                                                        error: 'server side problem!'
                                                    });
                                                }
                                            });
                                        } else {
                                            callback(500, {
                                                error: 'server side problem!'
                                            });
                                        }
                                    });
                                } else {
                                    callback(401, {
                                        error: 'already reach max limit!'
                                    });
                                }
                            } else {
                                callback(403, {
                                    error: 'auth problem!'
                                });
                            }
                        });
                    } else {
                        callback(403, {
                            error: 'user not found!'
                        });
                    }
                });
            } else {
                callback(403, {
                    error: 'Auth failed!'
                });
            }
        });
    } else {
        callback(400, {
            error: 'problem in request'
        });
    }
}

handler._check.get = (requestProperties, callback) => {
    const id = typeof(requestProperties.queryStringObject.id) === 'string' && requestProperties.queryStringObject.id.trim().length == 20 ? requestProperties.queryStringObject.id : false; 

    if(id) {
        data.read('checks', id, (err, checkData) => {
            if(!err && checkData) {
                let token = typeof(requestProperties.headerObject.token === 'string') ? requestProperties.headerObject.token : false;
                tokenHandle._token.verify(token, parseJSON(checkData).userPhone, (tokenIsValid) => {
                    if(tokenIsValid) {
                        callback(200, parseJSON(checkData));
                    } else {
                        callback(403, {
                            error: 'auth fail'
                        });
                    }
                });
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

handler._check.put = (requestProperties, callback) => {
    let id = typeof(requestProperties.body.id) === 'string' &&
                    requestProperties.body.id.trim().length === 20 ? requestProperties.body.id : false;

    let protocol = typeof(requestProperties.body.protocol) === 'string' &&
                    ['http','https'].indexOf(requestProperties.body.protocol) > -1 ? requestProperties.body.protocol : false;

    let url = typeof(requestProperties.body.url) === 'string' &&
                    requestProperties.body.url.trim().length > 0 ? requestProperties.body.url : false;
    
    let method = typeof(requestProperties.body.method) === 'string' &&
                     ['GET','POST','PUT','DELETE'].indexOf(requestProperties.body.method) > -1 ? requestProperties.body.method : false;

    let successCodes = typeof(requestProperties.body.successCodes) === 'object' &&
                     requestProperties.body.successCodes instanceof Array ? requestProperties.body.successCodes : false;

    let timeoutSeconds = typeof(requestProperties.body.timeoutSeconds) === 'number' && 
                    requestProperties.body.timeoutSeconds % 1 === 0 && requestProperties.body.timeoutSeconds >= 1 && requestProperties.body.timeoutSeconds <= 5 ? requestProperties.body.timeoutSeconds : false;
    
    if(id) {
        if(protocol || url || method || successCodes || timeoutSeconds) {
            data.read('checks', id, (err1, checkData) => {
                if(!err1 && checkData) {
                    let checkObj = parseJSON(checkData);

                    let token = typeof(requestProperties.headerObject.token === 'string') ? requestProperties.headerObject.token : false;

                    tokenHandle._token.verify(token, checkObj.userPhone, (tokenIsValid) => {
                        if(tokenIsValid) {
                            if(protocol) {
                                checkObj.protocol = protocol;
                            }
                            if(url) {
                                checkObj.protocol = url;
                            }
                            if(method) {
                                checkObj.method = method;
                            }
                            if(successCodes) {
                                checkObj.successCodes = successCodes;
                            }
                            if(timeoutSeconds) {
                                checkObj.timeoutSeconds = timeoutSeconds;
                            }

                            //update the checkObj
                            data.update('checks', id, checkObj, (err2) => {
                                if(!err2) {
                                    callback(200);
                                } else {
                                    callback(500, {
                                        error: 'server side error'
                                    });
                                }
                            });
                        } else {
                            callback(403, {
                                error: 'auth error'
                            });
                        }
                    });
                } else {
                    callback(500, {
                        error: 'server side error'
                    });
                }
            })
        } else {
            callback(400, {
                error: 'you must provide at least one field to update'
            });
        }
    } else {
        callback(400, {
            error: 'problem in request'
        });
    }
}

handler._check.delete = (requestProperties, callback) => {
    const id = typeof(requestProperties.queryStringObject.id) === 'string' && requestProperties.queryStringObject.id.trim().length == 20 ? requestProperties.queryStringObject.id : false; 

    if(id) {
        data.read('checks', id, (err, checkData) => {
            if(!err && checkData) {
                let token = typeof(requestProperties.headerObject.token === 'string') ? requestProperties.headerObject.token : false;
                tokenHandle._token.verify(token, parseJSON(checkData).userPhone, (tokenIsValid) => {
                    if(tokenIsValid) {
                        //delete the check data
                        data.delete('checks', id, (err1) => {
                            if(!err1) {
                                data.read('users', parseJSON(userData).userPhone, (err2, userData) => {
                                    let userObj = parseJSON(userData);

                                    if(!err2 && userData) {
                                        let userChecks = typeof(userObj.checks) === 'object' && 
                                        userObj.checks instanceof Array ? userObj.checks : [];

                                        //remove the deleted check id from userlist of checks
                                        let checkPosition = userChecks.indexOf(id);

                                        if(checkPosition > -1) {
                                            userChecks.splice(checkPosition, 1);
                                            //update the user data
                                            userObj.checks = userChecks;
                                            data.update('users', userObj.pNumber, userObj, (err4) => {
                                                if(!err4) {
                                                    callback(200)
                                                } else {
                                                    callback(500, {
                                                        error: 'There is a server side problem'
                                                    });
                                                }
                                            });
                                        } else {
                                            callback(500, {
                                                error: 'check id not found'
                                            });
                                        }
                                    } else {
                                        callback(500, {
                                            error: 'server side problem'
                                        });
                                    }
                                });
                            } else {
                                callback(500, {
                                    error: 'server side problem'
                                });
                            }
                        });
                    } else {
                        callback(403, {
                            error: 'auth fail'
                        });
                    }
                });
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

module.exports = handler;