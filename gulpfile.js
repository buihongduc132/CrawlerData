var gulp = require('gulp');

var pathToRoot = './';
var path = {
    join: function(pathToRoot, url) {
        return pathToRoot + url;
    } 
};

var moduleLocation = require(path.join(__dirname, pathToRoot, 'constant/require.json'));
var args = require(path.join(__dirname, pathToRoot, moduleLocation.args));
var crawlData = require(path.join(__dirname, pathToRoot, moduleLocation.service.crawlData));

gulp.task('getMovieList', () => {
    crawlData.buildMovieJson();
})