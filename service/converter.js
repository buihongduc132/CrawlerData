var path = require('path');
var pathToRoot = path.join(__dirname, '../');

var moduleLocation = require(path.join(pathToRoot, 'constant/require.json'));
var urlLocation = require(path.join(pathToRoot, 'constant/url.json'));

var dataService = require(path.join(pathToRoot, moduleLocation.dataService));
var templateHelper = require(path.join(pathToRoot, moduleLocation.templateHelper));
var constant = require(path.join(pathToRoot, moduleLocation.constant));
var args = require(path.join(pathToRoot, moduleLocation.args));
var htmlHelper = require(path.join(pathToRoot, moduleLocation.htmlHelper));
var imdbParser = require(path.join(pathToRoot, moduleLocation.parser.imdb));
var dataLocation = require(path.join(pathToRoot, moduleLocation.dataLocation));
var config = require(path.join(pathToRoot, moduleLocation.config));
var crawlDataHelper = require(path.join(pathToRoot, moduleLocation.service.crawlDataHelper));
var pd = require('pretty-data').pd;
var Promise = require('bluebird');
var _ = require('lodash');
var uiHelper = require(path.join(pathToRoot, moduleLocation.uiHelper));

var wpConverter = require(path.join(pathToRoot, moduleLocation.service.wordpressConverter));

var buildWordpressXml = function() {
    var combinedMovies = dataService.readFile(dataLocation.combinedMoviesJson);

    combinedMovies.then((data) => {
        let movies = JSON.parse(data);

        let wpXml = wpConverter.constructXml(data);

        dataService.writeFile(dataLocation.wordpressXml, wpXml).then(() => {
            uiHelper.log.done("buildWordpressXml Completed");
        })
    });
}

module.exports = { 
    buildWordpressXml: buildWordpressXml
}