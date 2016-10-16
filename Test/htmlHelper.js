var pathToRoot = '../';
var path = require('path');

var moduleLocation = require(path.join(pathToRoot, 'constant/require.json')); 
var urlLocation = require(path.join(pathToRoot, 'constant/url.json'));
var testData = require(path.join(pathToRoot, 'constant/testData.json'));

var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var htmlHelper = require(path.join(pathToRoot, moduleLocation.htmlHelper));

describe('Html Helper', () => {
    it('should get the mock data', () => {
        // htmlHelper.
    });
});