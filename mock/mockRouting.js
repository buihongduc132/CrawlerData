var pathToRoot = '../';
var path = require('path');
var config = require(path.join(pathToRoot, 'config.json'));

var _ = require('lodash');
var mockPaths = config.path.test.mockData;

var getMockFile = function(uri) {
    var result = _.find(mockPaths, (path) => {
        return path.url == uri;
    });

    return result ? result.path : result;
}

module.exports = {
    getMockFile: getMockFile    
}