var path = require('path');
var pathToRoot = path.join(__dirname, '../');

var moduleLocation = require(path.join(pathToRoot, 'constant/require.json'));
var urlLocation = require(path.join(pathToRoot, moduleLocation.url));
var testData = require(path.join(pathToRoot, moduleLocation.testData));

var _ = require('lodash');
var mockPaths = testData.mockData;
var fileHelper = require(path.join(pathToRoot, moduleLocation.fileHelper));

var getMockFile = function (uri) {
    var result = _.find(mockPaths, (pathRegex) => {
        if(pathRegex.disabled) {
            return false;
        }

        if (!pathRegex.urlRegEx) {
            return false;
            // throw new Error('Url Regex Not Found');
        }

        let regTest = new RegExp(pathRegex.urlRegEx);

        let testResult = regTest.test(uri);
        return testResult;
    });
    return result ? result.path : 'PathNotFound';
}

var getMockData = function (inputPath) {
    return fileHelper.readFile(inputPath);
}

module.exports = {
    getMockFile: getMockFile,
    getMockData: getMockData
}