var path = require('path');
var pathToRoot = path.join(__dirname, '../../');

var moduleLocation = require(path.join(pathToRoot, 'constant/require.json'));
var urlLocation = require(path.join(pathToRoot, moduleLocation.url));
var testData = require(path.join(pathToRoot, moduleLocation.testData));
var crawlData = require(path.join(pathToRoot, moduleLocation.service.crawlData));
var crawlDataHelper = require(path.join(pathToRoot, moduleLocation.service.crawlDataHelper));
var dataService = require(path.join(pathToRoot, moduleLocation.dataService));

var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var args = require(path.join(pathToRoot, moduleLocation.args));
var config = require(path.join(pathToRoot, moduleLocation.config));
var mockCrawlData = require(path.join(pathToRoot, moduleLocation.service.crawlData));
var mockCrawlDataHelper = require(path.join(pathToRoot, moduleLocation.service.crawlDataHelper));
var _ = require('lodash');
var Promise = require('bluebird');

describe('Craw Data Service Helper', () => {
    describe('Get Correct Number Of Movies', () => {
        var movieList = crawlDataHelper._getMovieList(1);
        return movieList.then((data) => {
            return expect(data.length).equal(395);
        });
    });
    describe('Get Movies To Build', () => {
        it('Should get correct number of movies to build', () => {
            var moviesToBuildOnlyNew = crawlDataHelper._getMoviesToBuild(true);
            var moviesToBuildAll = crawlDataHelper._getMoviesToBuild(false);
            return Promise.all([moviesToBuildOnlyNew, moviesToBuildAll]).spread((newMovies, allMovies) => {
                expect(newMovies.length).equal(2222);
                expect(allMovies.length).equal(334523);
            });
        });
    });
});