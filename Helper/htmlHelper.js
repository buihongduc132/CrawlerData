var pathToRoot = '../';
var path = require('path');

var moduleLocation = require(path.join(pathToRoot, 'constant/require.json'));
var urlLocation = require(path.join(pathToRoot, 'constant/url.json'));

var httpHelper = require(path.join(pathToRoot, moduleLocation.httpHelper));
var fileHelper = require(path.join(pathToRoot, moduleLocation.fileHelper));

var data = httpHelper.getHtml(urlLocation.imdb.topRated);

var imdb = function() {
    var getTopRated = function() {
        return;
    }
}