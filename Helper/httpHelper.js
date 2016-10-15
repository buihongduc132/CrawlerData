var pathToRoot = '../';
var path = require('path');
var config = require(path.join(pathToRoot, 'config.json'));

var request = require('request');
var Promise = require('bluebird');
Promise.promisifyAll(request);
var args = require(path.join(pathToRoot, config.path.require.args));

var getHtml = function (uri) {
    if (args.test) {
        
    }
    else {
        return request.getAsync({
            method: 'GET',
            uri: uri
        });
    }
}

module.exports = {
    getHtml: getHtml
}
