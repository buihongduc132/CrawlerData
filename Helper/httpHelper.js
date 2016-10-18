var path = require('path');
var pathToRoot = path.join(__dirname, '../');

var moduleLocation = require(path.join(pathToRoot, 'constant/require.json'));
var urlLocation = require(path.join(pathToRoot, moduleLocation.url));
var testData = require(path.join(pathToRoot, moduleLocation.testData));

var request = require('request');
var Promise = require('bluebird');
Promise.promisifyAll(request);
var args = require(path.join(pathToRoot, moduleLocation.args));
var mock = require(path.join(pathToRoot, testData.mockRouting));

var templateHelper = require(path.join(pathToRoot, moduleLocation.templateHelper));

var constant = require(path.join(pathToRoot, moduleLocation.constant));

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
