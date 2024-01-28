const environment = {}

environment.development = {
    port: 3000,
    envName: "development",
    secretKey: "dfheifanfrjoa",
    maxChecks: 5,
    twilio: {
        fromPhone: '+16076788269',
        accountSid: 'AC18919a985eacb7d2ef376767991f6e65',
        authToken: '7fea0ef8ec2b7cd87288673e8944bd33',
    },
};

environment.production = {
    port: 4000,
    envName: "production",
    secretKey: "grhthgcokberh",
    maxChecks: 5,
    twilio: {
        fromPhone: '+15005550006',
        accountSid: 'AC18919a985eacb7d2ef376767991f6e65',
        authToken: '7fea0ef8ec2b7cd87288673e8944bd33',
    },
};

const currentEnv = typeof(process.env.NODE_ENV) === 'string' ? process.env.NODE_ENV : 'development';

const envToExport = typeof(environment[currentEnv]) === 'object' ? environment[currentEnv] : environment.development;

module.exports = envToExport;