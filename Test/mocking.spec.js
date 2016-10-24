var path = require('path');
var pathToRoot = path.join(__dirname, '../');

var moduleLocation = require(path.join(pathToRoot, 'constant/require.json')); 
var urlLocation = require(path.join(pathToRoot, moduleLocation.url));
var testData = require(path.join(pathToRoot, moduleLocation.testData));

var chai = require('chai');
chai.use(require('chai-fs'));
var expect = chai.expect;
var mock = require(path.join(pathToRoot, testData.mockRouting));

describe('Mock Routing', () => {
    it('should route to correct for mockData/topRated.html', () => {
        var mockFile = mock.getMockFile(urlLocation.imdb.topRated);
        expect(mockFile).equal('test/mockData/topRated.html');
    });
    it('should have urlRegEx property', () => {
        for(var i = 0 ; i < testData.mockData.length; i++) {
            let mockPath = testData.mockData[i];
            expect(mockPath.urlRegEx).not.equal(undefined);
        }
    })
    it('should route to correct for all items in mockData', () => {
        for(var i = 0 ; i < testData.mockData.length; i++) {
            let mockPath = testData.mockData[i];
            var mockFile = mock.getMockFile(mockPath.seedUrl);
            expect(mockFile).equal(mockPath.path);
        }
    });
    it('all mock files are available', () => {
        var mockFiles = testData.mockData;
        mockFiles.forEach((file) => {
            expect(file.path).is.a.file();
        });
    });
});