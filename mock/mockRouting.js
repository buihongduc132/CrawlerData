var pathToRoot = '../';
var path = require('path');

var moduleLocation = require(path.join(pathToRoot, 'constant/require.json')); 
var urlLocation = require(path.join(pathToRoot, 'constant/url.json'));
var testData = require(path.join(pathToRoot, 'constant/testData.json'));

var _ = require('lodash');
var mockPaths = testData.mockData;

var getMockFile = function(uri) {
    var result = _.find(mockPaths, (path) => {
        return path.url == uri;
    });

    return result ? result.path : result;
}

module.exports = {
    getMockFile: getMockFile    
}