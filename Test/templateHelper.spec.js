var path = require('path');
var pathToRoot = path.join(__dirname, '../');

var moduleLocation = require(path.join(pathToRoot, 'constant/require.json'));
var urlLocation = require(path.join(pathToRoot, moduleLocation.url));
var testData = require(path.join(pathToRoot, moduleLocation.testData));
var templateHelper = require(path.join(pathToRoot, moduleLocation.templateHelper));

var chai = require('chai');
chai.use(require('chai-fs'));
var expect = chai.expect;
var mock = require(path.join(pathToRoot, testData.mockRouting));

describe('Template Helper', () => {
    describe('movieListByGenre function', () => {

    });
    describe('movieListByPopularity function', () => {
        it('should get the correct url', () => {
            for (var i = 0; i < 100; i++) {
                var url = templateHelper.movieListByPopularity(i);
                var expected = `http://www.imdb.com/search/title?count=250&num_votes=25000,&production_status=released&title_type=feature&view=simple&page=${i}`;
                expect(url).equal(expected);
            }
        });
    });
    describe('movieListByUserRating function', () => {
        it('should get the correct url', () => {
            for (var i = 0; i < 100; i++) {
                var url = templateHelper.movieListByUserRating(i);
                var expected = `http://www.imdb.com/search/title?count=250&num_votes=25000,&production_status=released&title_type=feature&view=simple&page=${i}&sort=user_rating,desc`;
                expect(url).equal(expected);
            }
        });
    });
    describe('movieListByVotes function', () => {
        it('should get the correct url', () => {
            for (var i = 0; i < 100; i++) {
                var url = templateHelper.movieListByVotes(i);
                var expected = `http://www.imdb.com/search/title?count=250&num_votes=25000,&production_status=released&title_type=feature&view=simple&page=${i}&sort=num_votes,desc`;
                expect(url).equal(expected);
            }
        });
    });
});