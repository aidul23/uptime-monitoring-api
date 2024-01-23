const data = require('../../lib/data');
const {hash} = require('../../helpers/utilities');
const {parseJSON} = require('../../helpers/utilities');

const handler = {}

handler.userHandle = (requestProperties, callback) => {
    const acceptedMethods = ['get','post','put','delete'];

    if(acceptedMethods.indexOf(requestProperties.method) > -1) {
        handler._users[requestProperties.method](requestProperties,callback);
    } else {
        callback(405);
    }
    
};

handler._users = {};

handler._users.post = (requestProperties, callback) => {
    const fName = typeof(requestProperties.body.fName) === 'string' && requestProperties.body.fName.trim().length > 0 ? requestProperties.body.fName : false;

    const lName = typeof(requestProperties.body.lName) === 'string' && requestProperties.body.lName.trim().length > 0 ? requestProperties.body.lName : false;

    const pNumber = typeof(requestProperties.body.pNumber) === 'string' && requestProperties.body.pNumber.trim().length == 10 ? requestProperties.body.pNumber : false; 

    const password = typeof(requestProperties.body.password) === 'string' && requestProperties.body.password.trim().length > 0 ? requestProperties.body.password : false;

    const tosAgree = typeof(requestProperties.body.tosAgree) === 'boolean' ? requestProperties.body.tosAgree : false;
    
    if(fName && lName && pNumber && password && tosAgree) {
        // user exist or not
        data.read('users', pNumber, (err) => {
            if(err) {

                let userObj = {
                    fName: fName,
                    lName: lName,
                    pNumber: pNumber,
                    password: hash(password),
                    tosAgree: tosAgree,
                };

                //store user to DB
                data.create('users', 
                pNumber, userObj, (err2) => {
                    if(!err2) {
                        callback(200, {
                            message: 'user created successfully'
                        });
                    } else {
                        callback(500, {
                            error: 'could not create user'
                        });
                    }
                });
            } else {
                callback(500, {
                    error: 'Server side problem',
                });
            }
        });
    } else {
        callback(400, {
            error: 'You have a req problem',
        });
    }
}

handler._users.get = (requestProperties, callback) => {
    //check the phone number is valid
    const pNumber = typeof(requestProperties.queryStringObject.pNumber) === 'string' && requestProperties.queryStringObject.pNumber.trim().length == 10 ? requestProperties.queryStringObject.pNumber : false; 

    if(pNumber) {
        data.read('users', pNumber, (err, u) => {
            const user = {...parseJSON(u)};

            if(!err && user) {

                delete user.password;
                callback(200, user);
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

handler._users.put = (requestProperties, callback) => {
    const fName = typeof(requestProperties.body.fName) === 'string' && requestProperties.body.fName.trim().length > 0 ? requestProperties.body.fName : false;

    const lName = typeof(requestProperties.body.lName) === 'string' && requestProperties.body.lName.trim().length > 0 ? requestProperties.body.lName : false;

    const pNumber = typeof(requestProperties.body.pNumber) === 'string' && requestProperties.body.pNumber.trim().length == 10 ? requestProperties.body.pNumber : false; 

    const password = typeof(requestProperties.body.password) === 'string' && requestProperties.body.password.trim().length > 0 ? requestProperties.body.password : false;

    if(pNumber) {
        if(fName || lName || password) {
            data.read('users', pNumber, (err, uData) => {
                const userData = {...parseJSON(uData)};

                if(!err && userData) {
                    if(fName) {
                        userData.fName = fName;
                    }

                    if(lName) {
                        userData.lName = lName;
                    }

                    if(password) {
                        userData.password = hash(password);
                    }

                    //update to database
                    data.update('users', pNumber, userData, (err1) => {
                        if(!err1) {
                            callback(200, {
                                message: 'user updated successfully'
                            });
                        } else {
                            callback(500, {
                                error: 'server side problem'
                            });
                        }
                    });
                    
                } else {
                    callback(400, {
                        error: 'problem in request'
                    });
                }
            });
        } else {
            callback(400, {
                error: 'problem in request'
            });
        }
    } else {
        callback(400, {
            error: 'invalid phone number'
        });
    }
}

handler._users.delete = (requestProperties, callback) => {
    const pNumber = typeof(requestProperties.queryStringObject.pNumber) === 'string' && requestProperties.queryStringObject.pNumber.trim().length == 10 ? requestProperties.queryStringObject.pNumber : false; 

    if(pNumber) {
        data.read('users', pNumber, (err, userData) => {
            if(!err && userData) {
                data.delete('users', pNumber, (err1) => {
                    if(!err1) {
                        callback(200, {
                            message: 'user successfully deleted'
                        });
                    } else {
                        callback(500, {
                            error: 'server side error'
                        });
                    }
                });
            } else {
                callback(500, {
                    error: 'server side error'
                });
            }
        });
    } else {
        callback(400, {
            error: 'problem in request'
        });
    }
}

module.exports = handler;