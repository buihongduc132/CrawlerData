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
            return dataService.writeFile(`${dataLocation.movieDetail}/${templateHelper.getFilename(movieDetail.title)}.json`, pd.json(JSON.stringify(movieDetail)));
        }
        else {
            return Promise.resolve();
        }
    }
}



let _buildMovieOverview = {
    __filterInvalidMovies: function (movies) {
        let filteredMovies = _.filter(movies, (movie) => {
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
            allNewMovies = _.filter(allNewMovies, (newMovie) => {
                return newMovie;
            });

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
        let total = imdbIds.length + csvIds.length - commonMovieIds.length;
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

            _.assign(commonMovie, _.find(csvMovies, { 'id': commonMovie.id }));

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
    }).catch((err) => {
        uiHelper.log.error(err);
        return [];
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

var __compareIds = function (movieIMDBID, Id) {
    return _.padStart(movieIMDBID, 7, '0') == Id.replace('tt', '');
}

const _updateMovieExtraInfo = function (movies) {
    return dataService.getFiles(dataLocation.movieDetail).then((files) => {
        _.map(files, (file) => {
            return dataService.readFile(path.join(dataLocation.movieDetail, file))
                .then((jsonFile) => {
                    let detailData = JSON.parse(jsonFile);

                    let extraInfo = _.find(movies, (movie) => {
                        return movie.id == detailData.id;
                    });

                    detailData.description = extraInfo ? extraInfo.description : '';
                    detailData.fileName = templateHelper.getFilename(detailData.title);

                    return detailData;
                })
                .then((updatedData) => {
                    return dataService.writeFile(path.join(dataLocation.movieDetail, templateHelper.getFilename(updatedData.fileName) + '.json'),  pd.json(JSON.stringify(updatedData)));
                })

        });
        return;
    });
}

module.exports = {
    _getMovieList: _getMovieList,
    _addMovieExtraInfo: _addMovieExtraInfo,
    _getAllMovies: _getAllMovies,
    _buildMovieDetailJson: _buildMovieDetailJson,
    _buildMovieOverview: _buildMovieOverview,
    _updateMovieExtraInfo: _updateMovieExtraInfo
}