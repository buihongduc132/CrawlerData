var _ = require('lodash');
var path = require('path');
var pathToRoot = path.join(__dirname, '../');

var moduleLocation = require(path.join(pathToRoot, 'constant/require.json'));

var config = require(path.join(pathToRoot, moduleLocation.config));

var args = require('minimist')(process.argv);

args.getCommand = function (paramName) {
    return args._.indexOf(paramName) > -1;
}

if (args.pages === undefined) {
    args.pages = config.defaultPages;
}

module.exports = args;
