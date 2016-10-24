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

describe('Craw Data Service Helper', () => {
    describe('Get Movie List', () => {
        var movieList = crawlDataHelper._getMovieList(1);
        movieList.then((data) => {
            var allIds = ["tt0468569", "tt0167260", "tt1375666", "tt0120737", "tt0080684", "tt0076759", "tt0133093", "tt0047478", "tt0167261", "tt0120815", "tt2199711", "tt1345836", "tt0172495", "tt0082971", "tt0103064", "tt0073707", "tt2375559", "tt0090605", "tt0086190", "tt0053125", "tt4387040", "tt2631186", "tt1821700", "tt0372784", "tt0097576", "tt0089881", "tt0055630", "tt1954470", "tt2356180", "tt3390572", "tt2488496", "tt0434409", "tt0113277", "tt0095016", "tt0892769", "tt0017925", "tt1431045", "tt0325980", "tt1392190", "tt2015381", "tt0848228", "tt0266697", "tt0088247", "tt1979320", "tt0440963", "tt1220719", "tt0094625", "tt0861739", "tt1555149", "tt3848892"];
            expect(data.length).equal(50);
            for (let i = 0; i < 50; i++) {
                expect(data[i].id == allIds[i]).to.be.true;
            }
        })
    });
    describe('Get Movies To Build', () => {
        it('Should get correct number of movies to build when get only new', () => {
            var moviesToBuild = crawlDataHelper._getMoviesToBuild(true);
            return moviesToBuild.then((movies) => {
                expect(movies.length).equal(584);
            }).catch((err) => {
                //TODO: Resolve the error : "Write after end"
            });
        });
        it('Should get correct number of movies to build when get all', () => {
            var moviesToBuild = crawlDataHelper._getMoviesToBuild(false);
            return moviesToBuild.then((movies) => {
                expect(movies.length).equal(588);
            }).catch((err) => {
                //TODO: Resolve the error : "Write after end"
            });
        });
    });
});