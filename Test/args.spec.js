var pathToRoot = '../';
var path = require('path');
var config = require(path.join(pathToRoot, 'config.json'));

var chai = require('chai');
var expect = chai.expect;
var args = require(path.join(pathToRoot, config.path.require.args));

describe('Environment Arguments Helper', () => {
    it('should get test argument', () => {
        expect(args.test).equal(true);
    });
});