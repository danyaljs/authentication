const fs = require('fs'),
    path = require('path'),
    dotenv = require('dotenv');

const envPath = process.env.SERVER_ENV || path.join(__dirname, '.env');
let envConfig;
try {
    envConfig = dotenv.parse(fs.readFileSync(envPath));
    // Override ENV variables
    for (const key in envConfig)
        process.env[key] = envConfig[key];
} catch (e) {
    console.error("Error in reading '.env' file with path='%s'. Make sure it exists.", envPath);
    process.exit(1);
}
const variables = {
    // Required variables
    JWT_SECRET_CODE: {required: true},
    MONGO_URL: {required: true},

    // Optional Variables with default value
    API_PORT: {default: 3020}
}

const requiredButNotDefined = [];

for (const variableName in variables) {
    const variable = variables[variableName];

    // If variable is required
    if (variable.required) {
        // If it's not defined
        if (process.env[variableName] === undefined)
            requiredButNotDefined.push(variableName);
        else if (typeof variable.process === 'function')
            process.env[variableName] = variable.process(process.env[variableName]);
    } else {
        // If variable has a default value
        if (variable.default !== undefined && process.env[variableName] === undefined)
            process.env[variableName] = variable.default;

        if (typeof variable.process === 'function')
            process.env[variableName] = variable.process(process.env[variableName]);
    }
}

if (requiredButNotDefined.length) {
    let errMsg = 'These env variables should be defined:';

    for (const variableName of requiredButNotDefined) errMsg += '\n' + `    - '${variableName}'`;

    console.error(errMsg);

    process.exit(1);
}


process.DOTENVED = true;
