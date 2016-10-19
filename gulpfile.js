var gulp = require('gulp');

var path = require('path');
var pathToRoot = path.join(__dirname, '/');

var moduleLocation = require(path.join(pathToRoot, 'constant/require.json'));
var args = require(path.join(pathToRoot, moduleLocation.args));
var crawlData = require(path.join(pathToRoot, moduleLocation.service.crawlData));

gulp.task('buildMovieJsonOverview', () => {
    var buildMovieJsonOverview = crawlData.buildMovieJsonOverview().then(() => {
        console.log('Done Building Movie Json Overview');
    });
});

gulp.task('buildNewMovieJson', () => {
    var buildAllNewMovieJson = crawlData.buildAllNewMovieJson().then((data) => {
        console.log("Done Building New Movie Json");
    });
});

gulp.task('buildSeedData', () => {
    console.log('testing');
});