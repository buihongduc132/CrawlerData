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

var buildCombinedNewMovieJson = function() {

}

var buildMovieDetailJson = function (isOnlyNew) {
    let newMovieInfo = crawlDataHelper._getMoviesToBuild(isOnlyNew);

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
    buildMovieJsonOverview: buildMovieJsonOverview,
    buildMovieDetailJson: buildMovieDetailJson
}