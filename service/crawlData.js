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


// _getMovieInAllGenre: _getMovieInAllGenre,
// _getMoviesToBuild: _getMoviesToBuild,
// _writeMovieJsonOverview: _writeMovieJsonOverview

var buildCombinedNewMovieJson = function (isOnlyNew) {
    let moviesToBuild = crawlDataHelper._getMoviesToBuild(isOnlyNew);
    let progressBar;
    var errorFiles = [];

    let moviesToBuildPromise = [];
    let movies = [];
    var total;

    let moviesData = moviesToBuild.then((result) => {
        total = result.length;
        progressBar = uiHelper.progressBar(total+1, "Building Combined Detail Json");

        var progressTick = setInterval(() => {
            progressBar.tick(0);
        }, 1000);

        let movieDetails = [];

        for (let i = 0; i < total; i++) {
            let currentMovie = result[i];
            let filePath = `${dataLocation.movieDetail}/${currentMovie.name} ${currentMovie.year}.json`;
            let movieDetail = dataService.readFile(filePath).then((data) => {
                movies.push(data);
                progressBar.tick();
            }).catch(() => {
                progressBar.tick();
                errorFiles.push(filePath);
            });

            moviesToBuildPromise.push(movieDetail);
        }

        return Promise.all(moviesToBuildPromise);
    });

    var readAllMovies = moviesData.then(() => {
        progressBar.tick();
        uiHelper.log.done(`Done Combined ${total} Movies Detail Json`);
        return dataService.writeFile(dataLocation.combinedMoviesJson, movies);
    });

    return readAllMovies;
}

var buildMovieDetailJson = function (isOnlyNew) {
    let moviesToBuild = crawlDataHelper._getMoviesToBuild(isOnlyNew);
    var moviesToBuildPromise = [];

    let movies = moviesToBuild.then((result) => {
        let total = result.length;
        let progressBar = uiHelper.progressBar(total, "Building Movie Detail Json");
        let moviesToBuildPromise = [];

        var progressTick = setInterval(() => {
            progressBar.tick(0);
        }, 1000);

        for (let i = 0; i < total; i++) {
            let currentMovie = result[i];

            let movieDetail = dataService.getHtml(currentMovie.url).then((movieDetailHtml) => {
                let movieDetail = imdbParser.detailToObject(movieDetailHtml);
                return Promise.resolve(movieDetail);
            });

            let writeMovieDetail = movieDetail.then((movieDetail) => {

                return dataService.writeFile(`${dataLocation.movieDetail}/${movieDetail.title}.json`, pd.json(JSON.stringify(movieDetail))).catch((err) => {
                    console.log(err);
                    progressBar.tick();
                }).then(() => {
                    progressBar.tick();
                });
            });

            moviesToBuildPromise.push(writeMovieDetail);
        }

        return Promise.all(moviesToBuildPromise).then(() => {
            clearInterval(progressTick);
            uiHelper.log.done(`Done writing ${total} movies details`);
        });
    });

    return movies;
}
var buildMovieJsonOverview = function (pages) {
    var movieListByGenre = crawlDataHelper._getMovieInAllGenre(pages);

    var movieListAllGenre = Promise.all(movieListByGenre).then((movieLists) => {
        var movies = _.flatMapDeep(movieLists, (movieList) => {
            return movieList;
        });

        var moviesUnique = _.uniqBy(movies, 'id');

        return Promise.resolve(moviesUnique);
    });


    var writeMovieJsonOverview = movieListAllGenre.then((movies) => {
        return crawlDataHelper._writeMovieJsonOverview(movies);
    });

    return writeMovieJsonOverview;
}

module.exports = {
    buildCombinedNewMovieJson: buildCombinedNewMovieJson,
    buildMovieJsonOverview: buildMovieJsonOverview,
    buildMovieDetailJson: buildMovieDetailJson
}