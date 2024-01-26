const environment = {}

environment.development = {
    port: 3000,
    envName: "development",
    secretKey: "dfheifanfrjoa",
    maxChecks: 5,
};

environment.production = {
    port: 4000,
    envName: "production",
    secretKey: "grhthgcokberh",
    maxChecks: 5,
};

const currentEnv = typeof(process.env.NODE_ENV) === 'string' ? process.env.NODE_ENV : 'development';

const envToExport = typeof(environment[currentEnv]) === 'object' ? environment[currentEnv] : environment.development;

module.exports = envToExport;