const environment = {}

environment.development = {
    port: 3000,
    envName: "development"
};

environment.production = {
    port: 4000,
    envName: "production"
};

const currentEnv = typeof(process.env.NODE_ENV) === 'string' ? process.env.NODE_ENV : 'development';

const envToExport = typeof(environment[currentEnv]) === 'object' ? environment[currentEnv] : environment.development;

module.exports = envToExport;