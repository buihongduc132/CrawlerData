var gulp = require('gulp');

var pathToRoot = '/';
var path = require('path');


var moduleLocation = require(path.join(__dirname, pathToRoot, 'constant/require.json'));
var args = require(path.join(__dirname, pathToRoot, moduleLocation.args));
var crawlData = require(path.join(__dirname, pathToRoot, moduleLocation.service.crawlData));

var buildMovieJsonOverview = crawlData.buildMovieJsonOverview();

// var writeMovieJsonOverview = buildMovieJsonOverview.then((movies) => {
//     return crawlData.writeMovieJsonOverview(movies);
// });

var getNewMovies = crawlData.getNewMovies().then((data) => {
    console.log(data.length);
});