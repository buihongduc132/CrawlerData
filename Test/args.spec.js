var path = require('path');
var pathToRoot = path.join(__dirname, '../');

var moduleLocation = require(path.join(pathToRoot, 'constant/require.json')); 
var urlLocation = require(path.join(pathToRoot, moduleLocation.url));
var testData = require(path.join(pathToRoot, moduleLocation.testData));

var chai = require('chai');
var expect = chai.expect;
var args = require(path.join(pathToRoot, moduleLocation.args));
var config = require(path.join(pathToRoot, moduleLocation.config));  

describe('Environment Arguments Helper', () => {
    it('should get test argument', () => {
        expect(args.mock).equal(true);
    });
    it('should be able to get an command', () => {
        expect(args.getCommand('test')).equal(true);
    });
    it('should return false for commands does not exists', () => {
        expect(args.getCommand('ThisCommandIsNotExists')).equal(false);
    });
    it('should return false for non exists params', () => {
        expect(args.falseParam).equal(undefined);
    });
    it('should get mock params', () => {
        expect(args.mock).equal(true);
    });
    it('should get default params', () => {
        expect(args.pages).equal(config.defaultPages-1);
    });
});