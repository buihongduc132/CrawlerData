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
var testData = require(path.join(pathToRoot, moduleLocation.testData));

var constant = require(path.join(pathToRoot, moduleLocation.constant));
var fileHelper = require(path.join(pathToRoot, moduleLocation.fileHelper));

const saveResponse = function (uri, result) {
    const today = new Date();
    const todayFormated = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
    const mockFolderPath = path.join(testData.mockLocation, todayFormated);

    if (!fileHelper.isExistsDir(mockFolderPath)) {
        fileHelper.newDir(mockFolderPath);
    }

    const fileName = uri.replace(/\//g, '-');

    return fileHelper.writeFile(path.join(mockFolderPath, fileName), result.body)
}

const getDataFromWeb = function (uri, inputHeaders) {
    let headers = inputHeaders ? inputHeaders : {};
    headers["accept-language"] = "en-US";
    return request.getAsync({
        method: 'GET',
        uri: uri,
        headers: headers
    }).timeout(config.timeout).then((result) => {
        return saveResponse(uri, result).catch({ code: 'ENAMETOOLONG' }, () => {
            console.log('File Name Too Long. Ignore Writing File'.red.bold);
            return result.body;
        }).finally(() => {
            return result.body;
        })
    });
}

var getHtml = function (uri, inputHeaders) {
    if (args.mock) {
        let pathToFile = mock.getMockFile(uri, 1);

        if (pathToFile == 'PathNotFound') {
            console.log('Error: PathNotFound'.red.bold);
            return getDataFromWeb(uri, inputHeaders);
        }
        else {
            let mockData = mock.getMockData(pathToFile);
            return mockData;;
        }
    }
    else {
        return getDataFromWeb(uri, inputHeaders);
    }
}

module.exports = {
    getHtml: getHtml
}