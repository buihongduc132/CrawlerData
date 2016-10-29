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

var _buildMovieDetailJson = {
    __getDetail: function (movie) {
        let errors = [];
        let clientError = function (e) {
            return e.code != 200;
        }

        return dataService.getHtml(movie.url).then((movieDetail) => {
            _.assign(movieDetail, movie);
            return Promise.resolve(movieDetail);
        }).catch(clientError, (e) => {
            uiHelper.log.error(`${e}`, `Http Error`);
            return Promise.resolve(false);
        }).catch(Promise.TimeoutError, (e) => {
            uiHelper.log.error(`Get Html ${currentMovie.url} (${config.timeout}ms})`, `Http Timeout`);
            return Promise.resolve(false);
        });
    },
    __writeToFile: function (movieDetail) {
        if (movieDetail) {
            // movieDetail = _addMovieExtraInfo(movieDetail, movieExtraInfo);
            return dataService.writeFile(`${dataLocation.movieDetail}/${movieDetail.title}.json`, pd.json(JSON.stringify(movieDetail)));
        }
        else {
            return Promise.resolve();
        }
    }
}



let _buildMovieOverview = {
    __filterInvalidMovies: function(movies) {
        let filteredMovies =  _.filter(movies, (movie) => {
            return /^tt\d{5,10}$/.test(movie.id);
        });

        return filteredMovies;
    },
    __fillingMovieUrlForMovies: function (movies) {
        let total = movies.length;

        let moviesWithoutEmbedUrl = _.reject(movies, (movie) => {
            return movie.EmbedUrl;
        });

        let newMoviesNumber = moviesWithoutEmbedUrl.length;
        let progressBar = uiHelper.progressBar(total, `Getting EmbedUrl ${newMoviesNumber}/${total} (Step 2/2)`);
        let progressTick = setInterval(() => {
            progressBar.tick(0);
        }, 1000);
        let movieWithoutEmbedUrlIds = _.map(moviesWithoutEmbedUrl, 'id');

        let idChunks = _.chunk(movieWithoutEmbedUrlIds, config.page.vidSource.apiCapacity);

        let movieDataFromApiInChunk = [];
        for (let i = 0; i < idChunks.length; i++) {
            let dataFromApi = stream.movieStreamData(idChunks[i]);
            movieDataFromApiInChunk.push(dataFromApi);
        };

        let movieChunks = []
        return Promise.all(movieDataFromApiInChunk).then((movieChunks) => {
            let allNewMovies = _.flatten(movieChunks);
            let fixMoviesIdsFromApi = _.map(allNewMovies, (movie) => {
                movie.MovieIMDBID = 'tt' + _.padStart(movie.MovieIMDBID, 7, '00');
                movie.id = movie.MovieIMDBID;
                progressBar.tick(0.3);

                return movie;
            })
            return _.sortBy(fixMoviesIdsFromApi, 'id');
        }).then((moviesFromApi) => {
            return _.map(movies, (movie) => {
                let foundNewMovie = _.find(moviesFromApi, (movieFromApi) => {
                    return movieFromApi.id == movie.id;
                });

                if (foundNewMovie) {
                    movie.EmbedUrl = foundNewMovie.EmbedUrl;
                }
                progressBar.tick(0.3);
                return movie;
            });
        }).then((movies) => {
            progressBar.tick(total)
            clearInterval(progressTick);
            var doneMessage = uiHelper.log.done(`Done getting Embed URL for all movies (2/2)`);
            console.log(doneMessage);
            return movies
        })
    },
    __combineAllMovies: function (imdbMovies, csvMovies) {
        imdbMovies = _.sortBy(imdbMovies, 'id');
        let imdbIds = _.map(imdbMovies, 'id'); //A
        let csvIds = _.map(csvMovies, 'id'); //B
        let commonMovieIds = _.intersection(imdbIds, csvIds); //I
        let total = imdbIds.length + csvIds.length - commonMovieIds;
        let progressBar = uiHelper.progressBar(total, "Combining all movies (From CSV and IMDB) (Step 1/2)");

        let progressTick = setInterval(() => {
            progressBar.tick(0);
        }, 1000);
        // TODO : Remove Comment
        let onlyImdbIds = _.reject(imdbIds, (id) => {
            progressBar.tick(0.25);
            return commonMovieIds.indexOf(id) > -1;
        });

        let onlyCsvIds = _.reject(csvIds, (id) => {
            progressBar.tick(0.25);
            return commonMovieIds.indexOf(id) > -1;
        });

        let onlyImdbMovies = _.filter(imdbMovies, (movie) => {
            progressBar.tick(0.25);
            return onlyImdbIds.indexOf(movie.id) > -1;
        });

        let onlyCsvMovies = _.filter(csvMovies, (movie) => {
            progressBar.tick(0.25);
            return onlyCsvIds.indexOf(movie.id) > -1;
        });

        let commonImdbMovies = _.reject(imdbMovies, (movie) => {
            progressBar.tick(0.25);
            return onlyImdbIds.indexOf(movie.id) > -1;
        });

        let commonMovies = commonImdbMovies;
        commonMovies = _.map(commonMovies, (commonMovie) => {
            progressBar.tick(0.25);

            _.assign(commonMovie, _.find(csvMovies, {'id': commonMovie.id}));

            return commonMovie;
        });

        let allMovies = _.concat(commonMovies, onlyImdbMovies, onlyCsvMovies);
        let allMoviesSorted = _.sortBy(allMovies, 'id');
        let uniqueList = _.uniqBy(allMoviesSorted, 'id');

        progressBar.tick(total)
        clearInterval(progressTick);
        var doneMessage = uiHelper.log.done(`Done Combining all movies in CSV and IMDB (1/2)`);
        console.log(doneMessage);
        return uniqueList;
    }
}


var _getMovieListMeta = function (url) {
    let listHtml = dataService.getHtml(url);
    return listHtml.then((result) => {
        let listOfMovie = imdbParser.list.movie(result);
        return listOfMovie;
    });
}

var _getMoviesMetaInList = function (pages, singlePage) {
    var movieListPromise = [];
    let totalPages = singlePage ? 3 : pages * 3;
    var progressBar = uiHelper.progressBar(totalPages, 'Building Movie Overview List')

    let progressTick = setInterval(() => {
        progressBar.tick(0);
    }, 1000);

    for (let p = 0; p < pages; p++) {
        let currentPage = p + 1;
        if (!singlePage || (singlePage && currentPage == pages)) {
            let movieListByPopularity = _getMovieListMeta(templateHelper.movieListByPopularity(currentPage)).then((moviesList) => {
                progressBar.tick();
                return moviesList;
            });
            let movieListByUserRating = _getMovieListMeta(templateHelper.movieListByUserRating(currentPage)).then((moviesList) => {
                progressBar.tick();
                return moviesList;
            });
            let movieListByVotes = _getMovieListMeta(templateHelper.movieListByVotes(currentPage)).then((moviesList) => {
                progressBar.tick();
                return moviesList;
            });
            movieListPromise.push(movieListByPopularity);
            movieListPromise.push(movieListByUserRating);
            movieListPromise.push(movieListByVotes);
        }
    }

    return Promise.all(movieListPromise).then((movieLists) => {
        clearInterval(progressTick);
        return Promise.resolve(movieLists);
    });
}

var _getMovieList = function (pages, singlePage) {
    return Promise.all(_getMoviesMetaInList(pages, singlePage)).then((movieLists) => {
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
    movie.EmbedUrl = movieInfo.EmbedUrl || '';
    newMovie.isDone = 0;
    newMovie.gotDetail = 0;
    return movie;
}

var _getAllMovies = function (pages, singlePage) {
    var movieList = _getMovieList(pages, singlePage);
    var movieListAllGenre = Promise.all(movieList).then((movieLists) => {
        var movies = _.flatMapDeep(movieLists, (movieList) => {
            return movieList;
        });


        var moviesUnique = _.uniqBy(movies, 'id');

        return Promise.resolve(moviesUnique);
    });

    return movieList;
}

//Deprecated
var _getMoviesToBuild = function () {
    let movieOverviews = dataService.readFile(dataLocation.movieListOverview);
    let extraInfoList = dataService.getCsvFile(dataLocation.movieExtraInfo);

    let newMovies = Promise.all([movieOverviews, extraInfoList]).then((result) => {

        let movieOverviewsData = JSON.parse(result[0]);
        let extraInfoListData = result[1];

        let moviesWithExtraInfo = _.map(movieOverviewsData, (movie) => {
            let movieExtraInfo = _.find(extraInfoListData, (extraInfoData) => {
                let csvMovieId = _.padStart(extraInfoData.MovieIMDBID, 7, '0');
                let overviewMovieId = movie.id.replace('tt', '');
                return csvMovieId == overviewMovieId;
            });

            let movieWithExtraInfo = _.assign(movie, movieExtraInfo);

            return movieWithExtraInfo;
        });

        return moviesWithExtraInfo;
    });

    return newMovies;
}

// var _updateMovieExtraInfo = function (movies, all) {
//     return dataService.getCsvFile(dataLocation.movieExtraInfo).then((moviesInCsv) => {
//         let moviesUnion = _.uniqBy(_.flatMap(_.union([moviesInCsv, movies])), 'id');

//         let allIds = __updateMovieExtraInfoExtraction.__getAllIds(moviesUnion);
//         let idChunks = _.chunk(allIds, config.page.vidSource.apiCapacity);
//         let promiseGetMovieInfo = __updateMovieExtraInfoExtraction.__getAllStreamPromise(idChunks);

//         let allApiResult = Promise.all(promiseGetMovieInfo).then((objResult) => {
//             let combineAllData = __updateMovieExtraInfoExtraction.__combineAllData(objResult, movies);
//             let updateOldData = __updateMovieExtraInfoExtraction.__updateOldData(combineAllData, moviesInCsv);

//             return updateOldData;
//         });

//         return allApiResult.then((data) => {
//             return dataService.writeCsvFile(dataLocation.movieExtraInfo, data).then(() => {
//                 var doneMessage = uiHelper.log.done('Done update movie extra info');
//                 console.log(doneMessage);
//             });
//         });
//     });
// };

var __compareIds = function (movieIMDBID, Id) {
    return _.padStart(movieIMDBID, 7, '0') == Id.replace('tt', '');
}

// var __updateMovieExtraInfoExtraction = {
//     __updateOldData: function (newMovies, oldMovies) {
//         return _.map(newMovies, (newMovie) => {
//             let newData = _.find(oldMovies, { 'id': newMovie.id });
//             if (newData) {
//                 newMovie.description = newData.description;
//                 newMovie.isDone = newData.isDone ? 1 : 0;
//                 newMovie.gotDetail = newData.gotDetail ? 1 : 0;
//             }

//             return newMovie;
//         });
//     },
//     __combineAllData: function (baseMovies, moviesInOverview) {
//         baseMovies = _.flatten(baseMovies);
//         let allMovies = _.concat(baseMovies, moviesInOverview);

//         var progressBar = uiHelper.progressBar(allMovies.length, 'Combine All Movies')

//         let progressTick = setInterval(() => {
//             progressBar.tick(0);
//         }, 1000);

//         let combinedMovies = _.map(allMovies, (resultMovie) => {
//             if (resultMovie.id && resultMovie.MovieIMDBID) {
//                 return resultMovie;
//             }
//             else if (resultMovie.MovieIMDBID) {
//                 let foundMovieInOverview = _.find(moviesInOverview, (movieInOverview) => {
//                     return __compareIds(resultMovie.MovieIMDBID, movieInOverview.id);
//                 })

//                 _.assign(resultMovie, foundMovieInOverview);
//             }
//             else if (resultMovie.id) {
//                 let foundMovieInBaseMovie = _.find(baseMovies, (baseMovie) => {
//                     return __compareIds(baseMovie.MovieIMDBID, resultMovie.id);
//                 });

//                 _.assign(resultMovie, foundMovieInBaseMovie);
//             }
//             var movieWithDefaultData = __updateMovieExtraInfoExtraction.__addDefaultData(resultMovie);

//             progressBar.tick();

//             return movieWithDefaultData;
//         });

//         let sortArray = _.sortBy(combinedMovies, ['id']);
//         clearInterval(progressTick);

//         return _.sortedUniqBy(sortArray, 'id');
//     },
//     __getAllStreamPromise: function (idChunks) {
//         let promiseGetMovieInfo = [];

//         var progressBar = uiHelper.progressBar(idChunks.length, 'Getting Chunks of movies')

//         let progressTick = setInterval(() => {
//             progressBar.tick(0);
//         }, 1000);

//         for (let i = 0; i < idChunks.length; i++) {
//             let thisChunk = idChunks[i];

//             var movieStreamData = stream.movieStreamData(thisChunk).then((data) => {
//                 progressBar.tick();
//                 return data;
//             });
//             promiseGetMovieInfo.push(movieStreamData);
//         }

//         return Promise.all(promiseGetMovieInfo).then((resultArray) => {
//             clearInterval(progressTick);
//             let objResult = __updateMovieExtraInfoExtraction.__buildObjectFromVidSourceResult(resultArray);

//             return objResult;
//         });
//     },
//     __getAllIds: function (movies) {

//         let needToUpdate = function (movie) {
//             if (movie.streamUrl) {
//                 return false;
//             }

//             return true;
//         }

//         let allIds = _.map(movies, (movie) => {
//             return movie.id;
//         });

//         return _.filter(allIds, (id) => {
//             return id;
//         });
//     },
//     __buildObjectFromVidSourceResult: function (results) {
//         return _.map(results, (objRaw) => {
//             let objData = objRaw.result;

//             return objData;
//         });
//     },
//     __addDefaultData: function (movie) {
//         if (!movie.MovieIMDBID) {
//             movie.MovieIMDBID = movie.id.replace('tt', '');
//         }
//         if (!movie.id) {
//             movie.id = 'tt' + _.padStart(movie.MovieIMDBID, 7, '0');
//         }

//         movie.MovieIMDBID = _.padStart(movie.MovieIMDBID, 7, '0');

//         movie.isDone = movie.isDone ? movie.isDone : 0;
//         movie.gotDetail = movie.gotDetail ? movie.gotDetail : 0;
//         movie.description = movie.description ? movie.description : '';

//         return movie;
//     }
// }

// var _writeMovieJsonOverview = function (data) {
//     var result = dataService.writeFile(dataLocation.movieListOverview, pd.json(JSON.stringify(data))).then(() => {
//         var doneMessage = uiHelper.log.done('Built Movie Overview');
//         console.log(doneMessage);
//         console.log(`Output: ` + `${dataLocation.movieListOverview}`.blue + ` (` + `${data.length}`.blue.bold + ` items)`);
//     }).catch((err) => {
//         uiHelper.log.error(err);
//     });
//     return result;
// }

module.exports = {
    // _updateMovieExtraInfo: _updateMovieExtraInfo,
    _getMovieList: _getMovieList,
    _getMoviesToBuild: _getMoviesToBuild,
    // _writeMovieJsonOverview: _writeMovieJsonOverview,
    _addMovieExtraInfo: _addMovieExtraInfo,
    _getAllMovies: _getAllMovies,
    _buildMovieDetailJson: _buildMovieDetailJson,
    _buildMovieOverview: _buildMovieOverview
}