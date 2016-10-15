var pathToRoot = '../';
var path = require('path');
var config = require(path.join(pathToRoot, 'config.json'));

var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var httpHelper = require(path.join(pathToRoot, config.path.require.httpHelper));
var args = require(path.join(pathToRoot, config.path.require.args));
var mock = require(path.join(pathToRoot, config.path.test.mockRouting));

describe('Http Helper', () => {
    describe('Get Html', () => {
        it('should get mocking data when testing', () => {
            expect(args.test).to.be.true;
            var getMockData = sinon.spy(mock, 'getMockFile');

            httpHelper.getHtml('testingUri');
            sinon.assert.calledOnce(getMockData);
        });
    });
});