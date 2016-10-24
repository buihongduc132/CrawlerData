var path = require('path');
var pathToRoot = path.join(__dirname, '../../');

var moduleLocation = require(path.join(pathToRoot, 'constant/require.json'));
var urlLocation = require(path.join(pathToRoot, 'constant/url.json'));

var config = require(path.join(pathToRoot, moduleLocation.config));
var httpHelper = require(path.join(pathToRoot, moduleLocation.httpHelper));

var _ = require('lodash');

let _getRawUrl = function(ids, redirect = true) {
    var stringIds = _.join(ids, ',');
    return `http://www.vidsourceapi.com/WebService.asmx/GetStreamEmbedUrlByIMDBIDs?apikey=${config.api.vidSource}&imdbids=${stringIds}&redirecton=${redirect}`
};

let _getStreamData = function(ids, redirect = true) {
    return httpHelper.getHtml(_getRawUrl(ids, redirect), { "Content-Type": "application/json"}).catch((err) => {
        console.log(err);
    }).then((data) => {
        return data;
    })
}

let movieStreamUrl = function(ids, redirect = true) {
    var actualIds = _.map(ids, (id) => {
        return id.replace('tt', '');
    });

    return _getStreamData(actualIds, redirect);
} 

module.exports = {
    movieStreamUrl: movieStreamUrl 
}