var path = require('path');
var pathToRoot = path.join(__dirname, '../');

var moduleLocation = require(path.join(pathToRoot, 'constant/require.json')); 
var urlLocation = require(path.join(pathToRoot, moduleLocation.url));
var testData = require(path.join(pathToRoot, moduleLocation.testData));

var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var httpHelper = require(path.join(pathToRoot, moduleLocation.httpHelper));
var mock = require(path.join(pathToRoot, testData.mockRouting));
var args = require(path.join(pathToRoot, moduleLocation.args));

describe('Http Helper', () => {
    describe('Get Html', () => {
        it('should get mocking data when testing', () => {
            expect(args.mock).to.be.true;
            var getMockData = sinon.spy(mock, 'getMockFile');
            httpHelper.getHtml('http://www.imdb.com/chart/top');
            sinon.assert.calledOnce(getMockData);
        });
    });
});