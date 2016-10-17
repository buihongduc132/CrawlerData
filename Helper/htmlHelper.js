var path = require('path');
var pathToRoot = path.join(__dirname, '../');

var moduleLocation = require(path.join(pathToRoot, 'constant/require.json'));
var urlLocation = require(path.join(pathToRoot, 'constant/url.json'));

var dataService = require(path.join(pathToRoot, moduleLocation.dataService));

var templateHelper = require(path.join(pathToRoot, moduleLocation.templateHelper));

var constant = require(path.join(pathToRoot, moduleLocation.constant));


var getMoviesByGenre = function (genre, pages = 1) {
    var genreUrl = templateHelper.movieListByGenre(genre, pages);
    var listContent = dataService.getHtml(genreUrl);

    return listContent;
}

module.exports = {
    imdb: {
        getMoviesByGenre: getMoviesByGenre
    }
}