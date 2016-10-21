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

    let builtCombined = moviesToBuild.then((result) => {
        let moviesToBuildPromise = [];
        let movies = [];
        let errors = [];
        var errorFiles = [];
        let total = result.length;

        let progressBar = uiHelper.progressBar(total + 1, "Building Combined Detail Json");

        let progressTick = setInterval(() => {
            progressBar.tick(0);
        }, 1000);

        let movieDetails = [];

        for (let i = 0; i < total; i++) {
            let currentMovie = result[i];
            let filePath = `${dataLocation.movieDetail}/${currentMovie.name} ${currentMovie.year}.json`;
            let movieDetail = dataService.readFile(filePath).then((data) => {
                movies.push(data);
                progressBar.tick();
                return Promise.resolve();
            }).catch({ code: 'ENOENT' }, (err) => {
                errors.push(uiHelper.log.error(`${err.path}`, 'File not exists'));
                progressBar.tick();
                return Promise.resolve();
            }).catch((err) => {
                throw new Error('Unhandled Exception');
            })

            moviesToBuildPromise.push(movieDetail);
        }

        return Promise.all(moviesToBuildPromise).then((data) => {
            progressBar.tick();
            clearInterval(progressTick);
            _.uniq(errors).forEach((err) => {
                uiHelper.log.error(err);
            });
            uiHelper.log.done(`Done Combined ${total} Movies Detail Json (With ${errors.length} errors)`);
            return dataService.writeFile(dataLocation.combinedMoviesJson, movies);
        });
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

        let progressTick = setInterval(() => {
            progressBar.tick(0);
        }, 1000);

        let clientError = function (e) {
            return e.code != 200;
        }

        let errors = [];

        for (let i = 0; i < total; i++) {
            let currentMovie = result[i];
            let movieDetail = dataService.getHtml(currentMovie.url).then((movieDetailHtml) => {
                let movieDetail = imdbParser.detailToObject(movieDetailHtml);
                return Promise.resolve(movieDetail);
            }).catch(clientError, (e) => {
                errors.push(uiHelper.log.error(`${e}`, `Http Error`));
                return Promise.resolve();
            }).catch(Promise.TimeoutError, (e) => {
                errors.push(uiHelper.log.error(`Get Html ${currentMovie.url} (${config.timeout}ms})`, `Http Timeout`));
                return Promise.resolve();
            })

            let writeMovieDetail = movieDetail.then((movieDetail) => {
                progressBar.tick(0.5);
                if (movieDetail) {
                    return dataService.writeFile(`${dataLocation.movieDetail}/${movieDetail.title}.json`, pd.json(JSON.stringify(movieDetail))).finally(() => {
                        progressBar.tick(0.5);
                    });
                }
                else {
                    progressBar.tick(0.5);
                    return Promise.resolve();
                }
            });

            moviesToBuildPromise.push(writeMovieDetail);

        }

        return Promise.all(moviesToBuildPromise).then(() => {
            progressBar.tick(total);
            clearInterval(progressTick);
            _.uniq(errors).forEach((err) => {
                console.log(err);
            });
            uiHelper.log.done(`Done writing ${total} movies details (With ${errors.length} errors)`);
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