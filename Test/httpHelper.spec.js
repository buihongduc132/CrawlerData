var pathToRoot = '../';
var path = require('path');

var moduleLocation = require(path.join(pathToRoot, 'constant/require.json')); 
var urlLocation = require(path.join(pathToRoot, 'constant/url.json'));
var testData = require(path.join(pathToRoot, 'constant/testData.json'));

var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var httpHelper = require(path.join(pathToRoot, moduleLocation.httpHelper));
var args = require(path.join(pathToRoot, moduleLocation.args));
var mock = require(path.join(pathToRoot, testData.mockRouting));

describe('Http Helper', () => {
    describe('Get Html', () => {
        it('should get mocking data when testing', () => {
            expect(args.test).to.be.true;
            var getMockData = sinon.spy(mock, 'getMockFile');
            httpHelper.getHtml('http://www.imdb.com/chart/top');
            sinon.assert.calledOnce(getMockData);
        });
    });
});