var pathToRoot = '../';
var path = require('path');

var moduleLocation = require(path.join(pathToRoot, 'constant/require.json')); 
var urlLocation = require(path.join(pathToRoot, 'constant/url.json'));
var testData = require(path.join(pathToRoot, 'constant/testData.json'));

var request = require('request');
var Promise = require('bluebird');
Promise.promisifyAll(request);
var args = require(path.join(pathToRoot, moduleLocation.args));
var mock = require(path.join(pathToRoot, testData.mockRouting));

var templateHelper = require(path.join(pathToRoot, moduleLocation.templateHelper));

var constant = require(path.join(pathToRoot, moduleLocation.constant));

var getHtml = function (uri) {
    if (args.test) {
        var pathToFile = mock.getMockFile(uri, 1);
        var mockData = mock.getMockData(pathToFile);
        return mockData;
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
