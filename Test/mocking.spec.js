var pathToRoot = '../';
var path = require('path');
var config = require(path.join(pathToRoot, 'config.json'));

var chai = require('chai');
chai.use(require('chai-fs'));
var expect = chai.expect;
var mock = require(path.join(pathToRoot, config.path.test.mockRouting));

describe('Mock Routing', () => {
    it('should route to correct path', () => {
        var mockFile = mock.getMockFile(config.host.imdb.topRated);
        expect(mockFile.length).above(0);
        expect(mockFile).equal('mock/mockData/topRated.html');

    });
    it('all mock files are available', () => {
        var mockFiles = config.path.test.mockData;
        mockFiles.forEach((file) => {
            expect(file.path).is.a.file();
        });
    });
});