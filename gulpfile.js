var gulp = require('gulp');

var path = require('path');
var pathToRoot = path.join(__dirname, '/');

var moduleLocation = require(path.join(pathToRoot, 'constant/require.json'));
var args = require(path.join(pathToRoot, moduleLocation.args));
var crawlData = require(path.join(pathToRoot, moduleLocation.service.crawlData));
var uiHelper = require(path.join(pathToRoot, moduleLocation.uiHelper));

gulp.task('buildMovieJsonOverview', () => {
    var buildMovieJsonOverview = crawlData.buildMovieJsonOverview(args.pages).then(() => {
        // uiHelper.log.done('Testing Done Message Done');
    });
});

gulp.task('buildMovieDetailJson', () => {
    var buildMovieDetailJson = crawlData.buildMovieDetailJson().then((data) => {
    });
});

gulp.task('buildCombinedMovieJson', () => {

});

gulp.task('buildSeedData', () => {
    console.log('testing');
});