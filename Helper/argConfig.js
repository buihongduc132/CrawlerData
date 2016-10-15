const commandLineArgs = require('command-line-args');

const optionDefinitions = [
//   { name: 'verbose', alias: 'v', type: Boolean },
//   { name: 'src', type: String, multiple: true, defaultOption: true },
//   { name: 'timeout', alias: 't', type: Number }
    {
        name: 'iteration',
        alias: 'v',
        type: Number
    }
];

module.exports = commandLineArgs(optionDefinitions);
