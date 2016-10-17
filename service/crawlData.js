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
var pd = require('pretty-data').pd;
var Promise = require('bluebird');
var _ = require('lodash');

var getMoviesOverview = function () {
    var movieOverviewString = dataService.readFile(dataLocation.movieListOverview);
    return movieOverviewString.then((result) => {
        return JSON.parse(result);
    });
}

var _getMovieInAllGenre = function(pages) {
    var genres = constant.movieGenre;
    var filePath = dataLocation.movieListOverview;
    var movieInAllGenre = [];

    for (let i = 0; i < genres.length; i++) {
        var genre = genres[i];
        var url = templateHelper.movieListByGenre(genre, pages);
        var listHtml = dataService.getHtml(url);
        var movieList = listHtml.then((result) => {
            var listOfMovie = imdbParser.list.movie(result);
            return listOfMovie;
        });
        movieInAllGenre.push(movieList);
    }
    return movieInAllGenre;
}

var buildMovieJsonOverview = function () {
    var movieListByGenre = _getMovieInAllGenre(0);

    var movieListAllGenre = Promise.all(movieListByGenre).then((movieLists) => {
        var movies = _.flatMapDeep(movieLists, (movieList) => {
            return movieList;
        });

        return Promise.resolve(movies);
    });

    return movieListAllGenre;
}

var writeMovieJsonOverview = function (data) {
    var result = dataService.writeFile(dataLocation.movieListOverview, pd.json(JSON.stringify(data)));
    console.log(`Output: ${dataLocation.movieListOverview} (${data.length} items)`)
    return result;
}

module.exports = {
    writeMovieJsonOverview: writeMovieJsonOverview,
    buildMovieJsonOverview: buildMovieJsonOverview
}