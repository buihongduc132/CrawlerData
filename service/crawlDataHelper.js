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
var stream = require(path.join(pathToRoot, moduleLocation.stream));

var pd = require('pretty-data').pd;
var Promise = require('bluebird');
var _ = require('lodash');
var movieDescriptions = undefined;

var _getMovieList = function (pages) {
    var genres = constant.movieGenre;
    var filePath = dataLocation.movieListOverview;
    var movieInAllGenre = [];

    let totalPages = genres.length * pages;
    var progressBar = uiHelper.progressBar(totalPages, 'Building Movie Overview List')

    let progressTick = setInterval(() => {
        progressBar.tick(0);
    }, 1000);

    let currentPageToShow = 0;
    for (let i = 0; i < genres.length; i++) {
        let genre = genres[i];
        for (let p = 0; p < pages; p++) {
            let currentPage = p + 1;

            let url = templateHelper.movieListByGenre(genre, currentPage);
            let listHtml = dataService.getHtml(url);
            let movieList = listHtml.then((result) => {
                progressBar.tick();
                let listOfMovie = imdbParser.list.movie(result);
                return listOfMovie;
            });
            movieInAllGenre.push(movieList);
        }
    }

    return Promise.all(movieInAllGenre).then((movieLists) => {
        var movies = _.flatMapDeep(movieLists, (movieList) => {
            return movieList;
        });


        var moviesUnique = _.uniqBy(movies, 'id');

        return Promise.resolve(moviesUnique);
    });
}

var _addMovieExtraInfo = function (movie, extraInfo) {
    var movieInfo = _.find(extraInfo, { id: movie.id }) || {};
    movie.description = movieInfo.description || '';
    return movie;
}

var _getAllMovies = function(pages) {
    var movieListByGenre = _getMovieList(pages);
    var movieListAllGenre = Promise.all(movieListByGenre).then((movieLists) => {
        var movies = _.flatMapDeep(movieLists, (movieList) => {
            return movieList;
        });


        var moviesUnique = _.uniqBy(movies, 'id');

        return Promise.resolve(moviesUnique);
    });

    return movieListByGenre;
}

var _getMoviesToBuild = function (isOnlyNew) {
    var movieOverviews = dataService.readFile(dataLocation.movieListOverview);

    var oldMovieList = dataService.readFile(dataLocation.oldMovies);

    var newMovies = movieOverviews.then((movieOverviewData) => {
        ;
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

var _updateMovieExtraInfo = function (movies, all) {
    return dataService.getCsvFile(dataLocation.movieExtraInfo).then((moviesInCsv) => {
        let moviesUnion = _.uniqBy(_.flatMap(_.union([moviesInCsv, movies])), 'id');

        let allIds = __updateMovieExtraInfoExtraction.__getAllIds(moviesUnion);
        let idChunks = _.chunk(allIds, config.page.vidSource.apiCapacity);
        let promiseGetMovieInfo = __updateMovieExtraInfoExtraction.__getAllStreamPromise(idChunks);

        let allApiResult = Promise.all(promiseGetMovieInfo).then((resultArray) => {
            let objResult = __updateMovieExtraInfoExtraction.__buildObjectFromVidSourceResult(resultArray);
            let combinedResultArray = __updateMovieExtraInfoExtraction.__addDefaultData(objResult);
            let combineAllData = __updateMovieExtraInfoExtraction.__combineAllData(combinedResultArray, moviesInCsv, movies);
            let combinedWithModifiedId = __updateMovieExtraInfoExtraction.__modifyFields(combineAllData);

            return combinedWithModifiedId;
        });

        return allApiResult.then((data) => {
            return dataService.writeCsvFile(dataLocation.movieExtraInfo, data);
        });
    });
};


var __updateMovieExtraInfoExtraction = {
    __combineAllData: function(baseMovies, moviesInCsv, moviesInOverview) {
        baseMovies = _.map(baseMovies, (baseMovie) => {
            let foundMovieInCsv = _.find(moviesInCsv, (movieInCsv) => {
                return baseMovie.MovieIMDBID === movieInCsv.MovieIMDBID;
            });

            let foundMovieInOverview = _.find(moviesInOverview, (movieInOverview) => {
                return baseMovie.MovieIMDBID === movieInOverview.id.replace('tt', '');
            });

            if(foundMovieInCsv) {
                _.assign(baseMovie, foundMovieInCsv);
            }
            if(foundMovieInOverview) {
                _.assign(baseMovie, foundMovieInOverview);
            }

            return baseMovie;
        });

        return _.uniqBy(baseMovies, 'MovieIMDBID');
    },
    __getAllStreamPromise: function(idChunks) {
        let promiseGetMovieInfo = [];
        for (let i = 0; i < idChunks.length; i++) {
            let thisChunk = idChunks[i];

            var movieStreamData = stream.movieStreamUrl(thisChunk).then((data) => {
                return data;
            });
            promiseGetMovieInfo.push(movieStreamData);
        }
        return promiseGetMovieInfo;
    },
    __getAllIds: function (movies) {

        let needToUpdate = function (movie) {
            if (movie.streamUrl) {
                return false;
            }

            return true;
        }

        let allIds = _.map(movies, (movie) => {
            return movie.id;
        });

        return _.filter(allIds, (id) => {
            return id;
        });
    },
    __modifyFields: function (movies) {
        let combinedWithModifiedId = _.map(movies, (combinedResult) => {
            combinedResult.MovieIMDBID = _.padStart(combinedResult.MovieIMDBID, 7, '0');

            return combinedResult;
        });

        return combinedWithModifiedId;
    },
    __buildObjectFromVidSourceResult: function (results) {
        return _.map(results, (result) => {
            let objRaw = JSON.parse(result);
            let objData = objRaw.result;

            return objData;
        });
    },
    __addDefaultData: function (movies) {
        let allKeys = ["name", "url", "id", "year", "streamUrl", "description", "MovieIMDBID"]
        let combinedMovies = _.flatten(movies);
        combinedMovies = _.map(combinedMovies, (combinedResult) => {
            combinedResult.isDone = combinedResult.isDone ? combinedResult.isDone : false;

            _.forEach(allKeys, (key) => {
                if(!combinedResult[key]) {
                    combinedResult[key] = '';
                }
            });

            return combinedResult;
        });

        return combinedMovies;
    }
}

var _writeMovieJsonOverview = function (data) {
    var result = dataService.writeFile(dataLocation.movieListOverview, pd.json(JSON.stringify(data))).then(() => {
        var doneMessage = uiHelper.log.done('Built Movie Overview');
        console.log(doneMessage);
        console.log(`Output: ` + `${dataLocation.movieListOverview}`.blue + ` (` + `${data.length}`.blue.bold + ` items)`);
    }).catch((err) => {
        uiHelper.log.error(err);
    });
    return result;
}

module.exports = {
    _updateMovieExtraInfo: _updateMovieExtraInfo,
    _getMovieList: _getMovieList,
    _getMoviesToBuild: _getMoviesToBuild,
    _writeMovieJsonOverview: _writeMovieJsonOverview,
    _addMovieExtraInfo: _addMovieExtraInfo,
    _getAllMovies: _getAllMovies
}