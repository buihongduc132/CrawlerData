var path = require('path');
var pathToRoot = path.join(__dirname, '../../');

var moduleLocation = require(path.join(pathToRoot, 'constant/require.json'));
var urlLocation = require(path.join(pathToRoot, 'constant/url.json'));
var testData = require(path.join(pathToRoot, 'constant/testData.json'));

var chai = require('chai');
var expect = chai.expect;

var constant = require(path.join(pathToRoot, moduleLocation.constant));
var templateHelper = require(path.join(pathToRoot, moduleLocation.templateHelper));

var imdbParser = require(path.join(pathToRoot, moduleLocation.parser.imdb));

describe('Imdb parser', () => {
    describe('Get post name', () => {
        it('should convert post name to url friendly', () => {
            var result = imdbParser.getPostName('This is testing post name');
            expect(result).equal('This-is-testing-post-name');
        });
    });
    describe('Get link id', () => {
        it('should get the id(123456) from tt123456', () => {
            var result = imdbParser.getLinkId('tt515231');
            expect(result).equal('515231');
        });
    });
    describe('Get thumbnail ID', () => {
        it('should get thumbnail id by a map operation(*11)', () => {
            var result = imdbParser.getThumbnailId('515231');
            expect(result).equal(515231*11);
        });
    });
    describe('Get content image ', () => {
        it('should get contain image Id id by a map operation(*111)', () => {
            var result = imdbParser.getContentImgId('515231');
            expect(result).equal(515231*111);
        })
    });
});