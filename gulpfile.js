var gulp = require('gulp');

var path = require('path');
var pathToRoot = path.join(__dirname, '/');

var moduleLocation = require(path.join(pathToRoot, 'constant/require.json'));
var args = require(path.join(pathToRoot, moduleLocation.args));
var crawlData = require(path.join(pathToRoot, moduleLocation.service.crawlData));
var converter = require(path.join(pathToRoot, moduleLocation.service.converter));
var uiHelper = require(path.join(pathToRoot, moduleLocation.uiHelper));

gulp.task('buildWordpressXml', () => {
    return converter.buildWordpressXml();
});

gulp.task('buildMovieOverview', () => {
    return crawlData.buildMovieOverview(args.pages, args.singlePage);
});

gulp.task('buildMovieDetailJson', () => {
    return crawlData.buildMovieDetailJson();
});

gulp.task('buildCombinedMovieJson', () => {
    return crawlData.buildCombinedMovieJson(args.onlyNew);
});

gulp.task('updateMovieExtraInfo', () => {
    return crawlData.updateMovieExtraInfo(args.pages);
});

gulp.task('updateMovieStatus', () => {
    return crawlData.updateMovieStatus();
})

gulp.task('buildSeedData', () => {
    console.log(dataService);
});