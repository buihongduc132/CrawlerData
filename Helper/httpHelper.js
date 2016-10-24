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
var config = require(path.join(pathToRoot, moduleLocation.config));
var templateHelper = require(path.join(pathToRoot, moduleLocation.templateHelper));

var constant = require(path.join(pathToRoot, moduleLocation.constant));


var getHtml = function (uri, inputHeaders) {
    if (args.mock) {
        let pathToFile = mock.getMockFile(uri, 1);
        let mockData = mock.getMockData(pathToFile);
        return mockData;
    }
    else {
        let headers = inputHeaders ? inputHeaders : {};
        headers["accept-language"] = "en-US";
        return request.getAsync({
            method: 'GET',
            uri: uri, 
            headers: headers
        }).timeout(config.timeout).then((result) => {
            return Promise.resolve(result.body);
        });
    }
}

module.exports = {
    getHtml: getHtml
}