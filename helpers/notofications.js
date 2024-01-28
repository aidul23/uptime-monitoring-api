const https = require('https');
const queryString = require('querystring');
const {twilio} = require('../helpers/environment');

const notifications = {};

//send message to user using twilio api
notifications.sendTwilioSms = (pNumber, msg, callback) => {
    //input validation
    const userNumber = typeof(pNumber) === 'string' && pNumber.trim().length === 10 ? pNumber.trim() : false;

    const userMsg = typeof(msg) === 'string' && msg.trim().length > 0 && msg.trim().length <= 1600 ? msg.trim() : false;

    if(userNumber && userMsg) {
        //configure the request payload
        const payload = {
            From: twilio.fromPhone,
            To: `+358${userNumber}`,
            Body: userMsg,
        };

        //stringify
        const stringifyPayload = queryString.stringify(payload);
        
        //configure the request details
        const reqDetailsObj = {
            hostname: 'api.twilio.com',
            method: 'POST',
            path: `/2010-04-01/Accounts/${twilio.accountSid}/Messages.json`,
            auth: `${twilio.accountSid}:${twilio.authToken}`,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        }

        //instantiate the req obj
        const req = https.request(reqDetailsObj, (res) => {
            //get the status of sent request
            const status = res.statusCode;

            if(status === 200 || status === 201) {
                callback(false);
            } else {
                callback(`status code ${status}`);
            }
        });

        req.on('error', (e) => {
            callback(e);
        });
        req.write(stringifyPayload);
        req.end();
    } else {
        callback('msg or number is missing or invalid');
    }
};

module.exports = notifications;