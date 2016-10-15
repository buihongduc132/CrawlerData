var pathToRoot = '../';
var path = require('path');
var config = require(path.join(pathToRoot, 'config.json'));

var request = require('request');
var Promise = require('bluebird');
Promise.promisifyAll(request);
var args = require(path.join(pathToRoot, config.path.require.args));
var mock = require(path.join(pathToRoot, config.path.test.mockRouting));

var getHtml = function (uri) {
    if (args.test) {
        var testHtmlPage = mock.getMockFile(uri);
        return Promise.resolve()
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
