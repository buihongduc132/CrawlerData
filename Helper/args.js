var _ = require('lodash');

var args = require('minimist')(process.argv);

args.getBlankParam = function(paramName) {
    return args._.indexOf(paramName) > -1;
}

args.test = args.getBlankParam('test');
module.exports = args;
