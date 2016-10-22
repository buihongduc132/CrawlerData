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
var uiHelper = require(path.join(pathToRoot, moduleLocation.uiHelper));

var pd = require('pretty-data').pd;
var Promise = require('bluebird');
var _ = require('lodash');
var movieDescriptions = undefined;

var _getMovieInAllGenre = function (pages) {
    var genres = constant.movieGenre;
    var filePath = dataLocation.movieListOverview;
    var movieInAllGenre = [];

    let totalPages = genres.length * pages;
    var movieListProgress = uiHelper.progressBar(totalPages, 'Building Movie Overview List')
    let currentPageToShow = 0;
    for (let i = 0; i < genres.length; i++) {
        let genre = genres[i];
        for (let p = 0; p < pages; p++) {
            let currentPage = p + 1;

            let url = templateHelper.movieListByGenre(genre, currentPage);
            let listHtml = dataService.getHtml(url);
            let movieList = listHtml.then((result) => {
                movieListProgress.tick();
                let listOfMovie = imdbParser.list.movie(result);
                return listOfMovie;
            });
            movieInAllGenre.push(movieList);
        }
    }

    return movieInAllGenre;
}

var _addMovieDescription = function(movie, descriptions) {
    var movieInfo = _.find(descriptions, { id: movie.id }) || {};
    movie.description = movieInfo.description || '_blank_description_';
    return movie;
}

var _getMoviesToBuild = function (isOnlyNew) {
    var movieOverviews = dataService.readFile(dataLocation.movieListOverview);

    var oldMovieList = dataService.readFile(dataLocation.oldMovies);

    var newMovies = movieOverviews.then((movieOverviewData) => {;
        let movieOverviewObject = JSON.parse(movieOverviewData);

        if (!isOnlyNew) {
            return Promise.resolve(movieOverviewObject);
        }

        return oldMovieList.then((oldMovies) => {
            let oldMovieObject = JSON.parse(oldMovies);

            return _.reject(movieOverviewObject, (movie) => {
                return oldMovieObject.indexOf(movie.id) > -1;
            });
        });

    })
    return newMovies;
}

var _writeMovieJsonOverview = function (data) {
    var result = dataService.writeFile(dataLocation.movieListOverview, pd.json(JSON.stringify(data))).then(() => {
        var doneMessage = uiHelper.log.done('Built Movie Overview');
        console.log(doneMessage);
        console.log(`Output: ` + `${dataLocation.movieListOverview}`.blue + ` (` + `${data.length}`.blue.bold + ` items)`);
    })
    return result;
}

module.exports = {
    _getMovieInAllGenre: _getMovieInAllGenre,
    _getMoviesToBuild: _getMoviesToBuild,
    _writeMovieJsonOverview: _writeMovieJsonOverview,
    _addMovieDescription: _addMovieDescription
}