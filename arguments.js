const commandLineArgs = require('command-line-args');

const optionDefinitions = [
    { name: 
        'verbose', 
        alias: 'v', 
        type: Boolean 
    },
    { name: 
        'src', 
        type: String, 
        multiple: true 
    },
    { name: 
        'timeout', 
        alias: 't', 
        type: Number 
    }
];


module.exports = commandLineArgs(optionDefinitions);