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

// TODO: Change from storing data in Movie Overview List to Movie Extra Info.xml

var buildCombinedMovieJson = function (isOnlyNew) {
    let moviesToBuild = crawlDataHelper._getMoviesToBuild(isOnlyNew);

    let builtCombined = moviesToBuild.then((result) => {
        let moviesToBuildPromise = [];
        let movies = new Array();
        let errors = [];
        var errorFiles = [];
        let total = result.length;

        let progressBar = uiHelper.progressBar(total + 1, "Building Combined Detail Json");

        let progressTick = setInterval(() => {
            progressBar.tick(0);
        }, 1000);

        for (let i = 0; i < total; i++) {
            let currentMovie = result[i];
            let filePath = `${dataLocation.movieDetail}/${currentMovie.name} ${currentMovie.year}.json`;
            let movieDetail = dataService.readFile(filePath).then((data) => {
                let movieObject = JSON.parse(data);
                movies.push(movieObject);
                progressBar.tick();
                return Promise.resolve();
            }).catch({ code: 'ENOENT' }, (err) => {
                errors.push(uiHelper.log.error(`${err.path}`, 'File not exists'));
                progressBar.tick();
                return Promise.resolve();
            }).catch((err) => {
                console.log(err);
                throw new Error('Unhandled Exception');
            });

            moviesToBuildPromise.push(movieDetail);
        }

        return Promise.all(moviesToBuildPromise).then((data) => {
            progressBar.tick();
            clearInterval(progressTick);
            _.uniq(errors).forEach((err) => {
                console.log(uiHelper.log.error(err));
            });
            var doneMessage = uiHelper.log.done(`Done Combined ${total} Movies Detail Json (With ${errors.length} errors)`);
            console.log(doneMessage);
            return dataService.writeFile(dataLocation.combinedMoviesJson, pd.json(JSON.stringify(movies)));
        });
    });
}

var buildMovieDetailJson = function () {
    var moviesToBuildPromise = [];
    let total;
    let progressBar;
    let progressTick;
    let succeeded = [];
    let csvData;
    let errors = [];

    return dataService.getCsvFile(dataLocation.movieExtraInfo).then((result) => {
        total = result.length;
        csvData = result;
        progressBar = uiHelper.progressBar(total, "Building Movie Detail Json");
        progressTick = setInterval(() => {
            progressBar.tick(0);
        }, 1000);

        return Promise.resolve(result).each((movie) => {
            return crawlDataHelper._buildMovieDetailJson.__getDetail(movie).then((data) => {
                progressBar.tick(0.5);
                return imdbParser.detailToObject(data);
            }).then((movieDetail) => {
                progressBar.tick(0.5);
                return crawlDataHelper._buildMovieDetailJson.__writeToFile(movieDetail).then(() => {
                    succeeded.push(movieDetail);
                });
            }).catch((err) => {
                errors.push(uiHelper.log.error(`${err}`, 'Building Movie Detail Json'));
                return;
            });
        }).then(() => {
            progressBar.tick(total);
            clearInterval(progressTick);
            _.uniq(errors).forEach((err) => {
                console.log(uiHelper.log.error(err));
            });
        });
    }).then(() => {
        let succeededItems = 0;
        csvData = _.map(csvData, (csvMovie) => {
            if (_.some(succeeded, { 'id': csvMovie.id })) {
                csvMovie.gotDetail = 1;
                succeededItems++;
            }
            return csvMovie;
        });
        return dataService.writeCsvFile(dataLocation.movieExtraInfo, csvData).then(() => {
            var doneMessage = uiHelper.log.done(`Done writing ${succeededItems}/${total} movies details`);
            console.log(doneMessage);
            return;
        });
    });
};

var buildMovieOverview = function (pages, singlePage) {
    // TODO implement
    // x Start getting all movie progress bar
    // x Get list of movie by pages
    // x Get Csv File
    // x Combine all movies in imdb and csv
    // x Assign Movie in CSV to Movie in imdb (*)
    // x End getting all movie progress bar

    // Start getting url for movie Bar
    // x Getting all movies with empty EmbedUrl
    // x Break these movie in chunk of 250
    // x Get Url by chunks
    // x Combine all chunks
    // x Map all url to movie without EmbedUrl
    // End Getting url Bar

    // Write all movie in *
    return crawlDataHelper._getMovieList(pages).then((moviesInImdb) => {
        return dataService.getCsvFile(dataLocation.movieOverview).then((moviesInCsv) => {
            return crawlDataHelper._buildMovieOverview.__combineAllMovies(moviesInImdb, moviesInCsv);
        });
    }).then((combinedMovies) => {
        return crawlDataHelper._buildMovieOverview.__fillingMovieUrlForMovies(combinedMovies);
    }).then((allMoviesUpdated) => {
        return dataService.writeCsvFile(dataLocation.movieOverview);
    }).then(() => {
        var doneMessage = uiHelper.log.done(`Done Building Movie Overview`);
        console.log(doneMessage);
    })
}

var updateMovieExtraInfo = function () {
    return dataService.readFile(dataLocation.movieListOverview).then((movies) => {
        return crawlDataHelper._updateMovieExtraInfo(JSON.parse(movies));
    });
}

var updateMovieStatus = function () {
    var combinedMovies = dataService.readFile(dataLocation.combinedMoviesJson);
    return combinedMovies.then((data) => {
        let movies = JSON.parse(data);

        return dataService.getCsvFile(dataLocation.movieExtraInfo).then((moviesInCsv) => {
            moviesInCsv = _.map(moviesInCsv, (movieInCsv) => {
                if (_.some(movies, (movie) => {
                    return movieInCsv.MovieIMDBID == movie.intId;
                })) {
                    movieInCsv.isDone = true;
                }
                movieInCsv.MovieIMDBID = _.padStart(movieInCsv.MovieIMDBID, 7, '0');

                return movieInCsv;
            });

            return dataService.writeCsvFile(dataLocation.movieExtraInfo, moviesInCsv);
        });
    });
}

module.exports = {
    buildCombinedMovieJson: buildCombinedMovieJson,
    buildMovieOverview: buildMovieOverview,
    buildMovieDetailJson: buildMovieDetailJson,
    updateMovieExtraInfo: updateMovieExtraInfo,
    updateMovieStatus: updateMovieStatus
}