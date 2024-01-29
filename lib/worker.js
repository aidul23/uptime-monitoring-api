const data = require('./data');
const {parseJSON} = require('../helpers/utilities');
const url = require('url');
const http = require('http');
const https = require('https');
const {sendTwilioSms} = require('../helpers/notofications');

const worker = {};

worker.getAllChecks = () => {
    data.list('checks', (err, checks) => {
        if(!err && checks && checks.length > 0) {
            checks.array.forEach(check => {
                //read the check data
                data.read('checks', check, (err1, orgCheckData) => {
                    if(!err1 && orgCheckData) {
                        //pass the data to the next process
                        worker.validateCheckData(parseJSON(orgCheckData));
                    } else {
                        console.log('reading single check data');
                    }
                });
            });
        } else {
            console.log('could not find any checks to process');
        }
    });
}

//validate check data
worker.validateCheckData = (orgCheckData) => {
    if(orgCheckData && orgCheckData.id) {
        orgCheckData.state = typeof(orgCheckData.state) === 'string' && ['up', 'down'].indexOf(orgCheckData.state) > -1 ? orgCheckData.state : 'down';

        orgCheckData.lastChecked = typeof(orgCheckData.lastChecked) === 'number' && orgCheckData.lastChecked > 0 ? orgCheckData.lastChecked : false;

        //pass to the next process
        worker.performCheck(orgCheckData);
    } else {
        console.log('check was invalid');
    }
}

worker.performCheck = (orgCheckData) => {
    //prepare the initial check outcome

    let checkOutcome = {
        error: false,
        responseCode: false
    };

    let outcomeSent = false;

    //parse the host name and full url from original data
    const parseUrl = url.parse(orgCheckData.protocol + '://' + orgCheckData.url, true);
    const hostName = parseUrl.hostname;
    const path = parseUrl.path;

    //construct the request
    const reqDetails = {
        'protocol': orgCheckData.protocol+':',
        'hostname': hostName,
        'method': orgCheckData.method.toUpperCase(),
        'path': path,
        'timeout': orgCheckData.timeoutSeconds * 1000, 
    };

    const protocolToUse = orgCheckData.protocol === 'http' ? http : https;

    let req = protocolToUse.request(reqDetails, (res) => {
        //check the status code
        const status = res.statusCode;

        checkOutcome.responseCode = status;

        //update the check outcome
        if(!outcomeSent) {
            worker.processCheckOutcome(orgCheckData, checkOutcome);
            outcomeSent = true;
        }
    });

    req.on('error', (e) => {
        let checkOutcome = {
            error: true,
            value: e
        };

        if(!outcomeSent) {
            worker.processCheckOutcome(orgCheckData, checkOutcome);
            outcomeSent = true;
        }
    });

    req.on('timeout', (e) => {
        let checkOutcome = {
            error: true,
            value: 'timeout'
        };
        if(!outcomeSent) {
            worker.processCheckOutcome(orgCheckData, checkOutcome);
            outcomeSent = true;
        }
    });

    req.end();
};

worker.processCheckOutcome = (orgCheckData, checkOutcome) => {
    //check if checkoutcome is up or down
    let state = !checkOutcome.error && checkOutcome.responseCode && orgCheckData.successCodes.indexOf(checkOutcome.responseCode) > -1 ? 'up' : 'down';

    //decide whether we should allow user or not
    let alertWanted = orgCheckData.lastChecked && orgCheckData.state !== state ? true : false;

    //update the check data
    let newCheckData = orgCheckData;

    newCheckData.state = state;
    newCheckData.lastChecked = Date.now();

    //update the check to db
    data.update('checks', newCheckData.id, newCheckData, (err) => {
        if(!err) {
            if(alertWanted) {
                worker.alertUserToStatusChange(newCheckData);
            }
            else {
                console.log('alert is not needed');
            }
        } else {
            console.log('error trying to save check data of one of the checks!');
        }
    });
}

//send notification to user
worker.alertUserToStatusChange = (newCheckData) => {
    let msg = `Alert: Your check for ${newCheckData.method.toUpperCase()} ${newCheckData.protocol}://${newCheckData.url} is currently ${newCheckData.state}`;

    sendTwilioSms(newCheckData.userPhone, msg, (err) => {
        if(!err) {
            console.log(`user get sms: ${msg}`);
        } else {
            console.log('problem sending sms');
        }
    });
}

worker.checkList = () => {
    setInterval(() => {
        worker.getAllChecks();
    },1000 * 60);
}
//start server
worker.init = () => {
    //excute all the checks
    worker.getAllChecks();

    //call the loop
    worker.checkList();
}

module.exports = worker;