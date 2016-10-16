var pathToRoot = '../';
var path = require('path');

var moduleLocation = require(path.join(pathToRoot, 'constant/require.json')); 
var urlLocation = require(path.join(pathToRoot, 'constant/url.json'));
var testData = require(path.join(pathToRoot, 'constant/testData.json'));

var chai = require('chai');
chai.use(require('chai-fs'));
var expect = chai.expect;
var mock = require(path.join(pathToRoot, testData.mockRouting));

describe('Mock Routing', () => {
    it('should route to correct path', () => {
        var mockFile = mock.getMockFile(urlLocation.imdb.topRated);
        expect(mockFile.length).above(0);
        expect(mockFile).equal('mock/mockData/topRated.html');

    });
    it('all mock files are available', () => {
        var mockFiles = testData.mockData;
        mockFiles.forEach((file) => {
            expect(file.path).is.a.file();
        });
    });
});