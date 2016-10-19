var path = require('path');
var pathToRoot = path.join(__dirname, '/');

var moduleLocation = require(path.join(pathToRoot, 'constant/require.json'));
var args = require(path.join(pathToRoot, moduleLocation.args));
var crawlData = require(path.join(pathToRoot, moduleLocation.service.crawlData));

// var buildMovieJsonOverview = crawlData.buildMovieJsonOverview();

// var writeMovieJsonOverview = buildMovieJsonOverview.then((movies) => {
//     return crawlData.writeMovieJsonOverview(movies);
// });

var buildMovieJsonOverview = crawlData.buildMovieJsonOverview().then(() => {
    console.log('Done Building Movie Json Overview');
});