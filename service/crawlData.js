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
var pd = require('pretty-data').pd;
var Promise = require('bluebird');
var _ = require('lodash');

var _getMovieInAllGenre = function (pages) {
    var genres = constant.movieGenre;
    var filePath = dataLocation.movieListOverview;
    var movieInAllGenre = [];
    var maxPage = pages || config.maxPage;

    for (let i = 0; i < genres.length; i++) {
        var genre = genres[i];
        for (let p = 0; p < maxPage; p++) {
            let currentPage = p+1;

            let url = templateHelper.movieListByGenre(genre, currentPage);
            let listHtml = dataService.getHtml(url);
            let movieList = listHtml.then((result) => {
                let listOfMovie = imdbParser.list.movie(result);
                return listOfMovie;
            });
            movieInAllGenre.push(movieList);
        }
    }

    return movieInAllGenre;
}

var getMoviesOverview = function () {
    var movieOverviewString = dataService.readFile(dataLocation.movieListOverview);
    return movieOverviewString.then((result) => {
        return JSON.parse(result);
    });
}

var buildAllNewMovieJson = function () {
    let newMovieInfo = getNewMovies();

    return Promise.each(newMovieInfo, (movieInfo) => {
        var movieUrl = movieInfo.url;

        var movieDetailHtml = dataService.getHtml(movieUrl);

        var movieDetail = movieDetailHtml.then((movieDetailHtml) => {
            var movieDetail = imdbParser.detailToObject(movieDetailHtml);

            return Promise.resolve(movieDetail);
        });

        var writeMovieDetail = movieDetail.then((movieDetail) => {
            return dataService.writeFile(`${dataLocation.movieDetail}/${movieDetail.title}.json`, pd.json(JSON.stringify(movieDetail)))
                .then(() => {
                    console.log(`Movie Detail write to ${movieDetail.title}.json`);
                });
        });

        return writeMovieDetail;
    });
}

var getNewMovies = function () {
    var movieOverviews = dataService.readFile(dataLocation.movieListOverview);

    var oldMovieList = dataService.readFile(dataLocation.oldMovies);

    var newMovies = movieOverviews.then((movieOverviewData) => {
        let movieOverviewObject = JSON.parse(movieOverviewData);

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
    var result = dataService.writeFile(dataLocation.movieListOverview, pd.json(JSON.stringify(data)));
    console.log(`Output: ${dataLocation.movieListOverview} (${data.length} items)`)
    return result;
}

var buildMovieJsonOverview = function () {
    var movieListByGenre = _getMovieInAllGenre(0);

    var movieListAllGenre = Promise.all(movieListByGenre).then((movieLists) => {
        var movies = _.flatMapDeep(movieLists, (movieList) => {
            return movieList;
        });

        var moviesUnique = _.uniqBy(movies, 'id');

        return Promise.resolve(moviesUnique);
    });


    var writeMovieJsonOverview = movieListAllGenre.then((movies) => {
        return _writeMovieJsonOverview(movies);
    });

    return writeMovieJsonOverview;
}

module.exports = {
    buildMovieJsonOverview: buildMovieJsonOverview,
    buildAllNewMovieJson: buildAllNewMovieJson,
    getNewMovies: getNewMovies
}