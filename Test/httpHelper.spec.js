var pathToRoot = '../';
var path = require('path');
var config = require(path.join(pathToRoot, 'config.json'));

var chai = require('chai');
var expect = chai.expect;
var httpHelper = require(path.join(pathToRoot, config.path.require.httpHelper));

describe('Http Helper', () => {
    describe('Get Html', () => {
        it('should get mocking data', () => {

        });
    });
});