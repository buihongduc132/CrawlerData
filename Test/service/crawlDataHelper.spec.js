var path = require('path');
var pathToRoot = path.join(__dirname, '../../');

var moduleLocation = require(path.join(pathToRoot, 'constant/require.json')); 
var urlLocation = require(path.join(pathToRoot, moduleLocation.url));
var testData = require(path.join(pathToRoot, moduleLocation.testData));
var crawlData = require(path.join(pathToRoot, moduleLocation.service.crawlData));

var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var args = require(path.join(pathToRoot, moduleLocation.args));
var config = require(path.join(pathToRoot, moduleLocation.config));  
var mockCrawlData = require(path.join(pathToRoot, moduleLocation.service.crawlData));

describe('Craw Data Service Helper', () => {
    // describe('Get Html', () => {
    //     it('should get mocking data when testing', () => {
    //         expect(args.mock).to.be.true;
    //         var getMockData = sinon.spy(mock, 'getMockFile');
    //         httpHelper.getHtml('http://www.imdb.com/chart/top');
    //         sinon.assert.calledOnce(getMockData);
    //     });
    // });
    describe('_getMovieList', () => {
        it('should call _getMovieList once', () => {
            var _getMovieListMock = sinon.spy(mockCrawlData, '_getMovieList');
            sinon.assert.calledOnce(_getMovieListMock);
        });
    });
});