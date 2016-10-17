var path = require('path');
var pathToRoot = path.join(__dirname, '../../');

var moduleLocation = require(path.join(pathToRoot, 'constant/require.json'));
var urlLocation = require(path.join(pathToRoot, 'constant/url.json'));
var testData = require(path.join(pathToRoot, 'constant/testData.json'));

var chai = require('chai');
var expect = chai.expect;

var constant = require(path.join(pathToRoot, moduleLocation.constant));
var templateHelper = require(path.join(pathToRoot, moduleLocation.templateHelper));

var commonParser = require(path.join(pathToRoot, moduleLocation.parser.common));

describe('Common parser', () => {
    var data = templateHelper.testHtml();
    describe('Get text detail', () => {
        it('should get correct text with specific id', () => {
            var result = commonParser.getTextDetail(data, ('#id-one'));
            expect(result).equal('id one');
        });
        it('should get correct text with specific class', () => {
            var result = commonParser.getTextDetail(data, ('.class-one'));
            expect(result).equal('class one');
        });
    });
    describe('Get data attribute', () => {
        it('should get the correct data attribute', () => {
            var result = commonParser.getDataFromAttribute(data, '#id-one', 'data');
            expect(result).equal('id-one-data');
        });
    })
    describe('Get list data', () => {
        it('should get the list for the same selector', () => {
            var result = commonParser.getListData(data, '.class-two');
            expect(result.length).equal(3);
            expect(result).deep.equal([
                "class 2.1", "class 2.2", "class 2.3"
            ])
        })
    })
});
