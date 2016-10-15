var request = require('request');
var Promise = require('bluebird');
var config = require.main.require('./config.json');

Promise.promisifyAll(request);
var fileHelper = require.main.require(config.path.require.fileHelper);

var getHtml = function(uri) {
    return request.getAsync({
        method: 'GET',
        uri: uri
    });
}

var getFile = function(path, fileName) {
    return fileHelper.readFile(path, fileName);
}

module.exports = {
    getHtml: getHtml,
    getFile: getFile
}
