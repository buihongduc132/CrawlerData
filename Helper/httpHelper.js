var pathToRoot = '../';
var path = require('path');

var moduleLocation = require(path.join(__dirname, pathToRoot, 'constant/require.json')); 
var urlLocation = require(path.join(__dirname, pathToRoot, 'constant/url.json'));
var testData = require(path.join(__dirname, pathToRoot, 'constant/testData.json'));

var request = require('request');
var Promise = require('bluebird');
Promise.promisifyAll(request);
var args = require(path.join(__dirname, pathToRoot, moduleLocation.args));
var mock = require(path.join(__dirname, pathToRoot, testData.mockRouting));

var templateHelper = require(path.join(__dirname, pathToRoot, moduleLocation.templateHelper));

var constant = require(path.join(__dirname, pathToRoot, moduleLocation.constant));

var getHtml = function (uri) {
    if (args.mock) {
        var pathToFile = mock.getMockFile(uri, 1);
        var mockData = mock.getMockData(pathToFile);
        return mockData;
    }
    else {
        return request.getAsync({
            method: 'GET',
            uri: uri
        }).then((result) => {
            return Promise.resolve(result.body);
        });
    }
}

module.exports = {
    getHtml: getHtml
}
