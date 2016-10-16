var pathToRoot = '../';
var path = require('path');

var moduleLocation = require(path.join(pathToRoot, 'constant/require.json')); 
var urlLocation = require(path.join(pathToRoot, 'constant/url.json'));
var testData = require(path.join(pathToRoot, 'constant/testData.json'));

var chai = require('chai');
var expect = chai.expect;
var args = require(path.join(pathToRoot, moduleLocation.args));

describe('Environment Arguments Helper', () => {
    it('should get test argument', () => {
        expect(args.test).equal(true);
    });
    it('should be able to get a blank param', () => {
        expect(args.getBlankParam('test')).equal(true)
    });
    it('should return false for params does not exists', () => {
        expect(args.getBlankParam('ThisParamIsNotExists')).equal(false);
    });
});