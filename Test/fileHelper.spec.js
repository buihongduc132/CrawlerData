var chai = require('chai');
var expect = chai.expect;

var config = require('../config.json');
var pathToRoot = '../';
var path = require('path');
var fileHelper = require(path.join(pathToRoot, config.path.require.fileHelper));

describe('Data Helper', () => {
    describe('Read file', () => {
        it('should find the specific file', () => {
            fileHelper.readFile(config.path.test.readFile).then((result) => {
                expect(result).to.not.be.null;
            });
        });
        it('should return the correct text', () => {
            fileHelper.readFile(config.path.test.readFile).then((result) => {
                expect(result).is.equal('This is test for reading file');
            });
        })
    });
});