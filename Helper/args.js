var _ = require('lodash');

var args = require('minimist')(process.argv);

args.getBlankParam = function(paramName) {
    return args._.indexOf(paramName) > -1;
}

if(args.pages === undefined) {
    args.pages = 1;
}
else if(args.pages == 0) {
    args.pages = 999;
}

module.exports = args;
