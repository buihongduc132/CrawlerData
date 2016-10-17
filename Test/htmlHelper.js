var path = require('path');
var pathToRoot = path.join(__dirname, '../');

var moduleLocation = require(path.join(pathToRoot, 'constant/require.json'));
var urlLocation = require(path.join(pathToRoot, 'constant/url.json'));
var testData = require(path.join(pathToRoot, 'constant/testData.json'));

var chai = require('chai');
var expect = chai.expect;

var constant = require(path.join(pathToRoot, moduleLocation.constant));
var templateHelper = require(path.join(pathToRoot, moduleLocation.templateHelper));

var htmlHelper = require(path.join(pathToRoot, moduleLocation.htmlHelper));

describe('Html Helper', () => {
    describe('Imdb Functions', () => {
        it('should get the mock data', () => {
            var result = htmlHelper.imdb.getMoviesByGenre(constant.movieGenre[0], 1);
            result.then((data) => {
                var test = data.match(/<html>/);
                expect(test.length).above(0);
            });
        });
    });
});