var path = require('path');
var pathToRoot = path.join(__dirname, '../../');

var moduleLocation = require(path.join(pathToRoot, 'constant/require.json'));
var urlLocation = require(path.join(pathToRoot, 'constant/url.json'));

var config = require(path.join(pathToRoot, moduleLocation.config));
var httpHelper = require(path.join(pathToRoot, moduleLocation.httpHelper));

var _ = require('lodash');

let _getRawUrl = function (ids, redirect = true) {
    let stringIds = _.join(ids, ',');
    let url = `http://www.vidsourceapi.com/WebService.asmx/GetStreamEmbedUrlByIMDBIDs?apikey=${config.api.vidSource}&redirecton=${redirect}&imdbids=${stringIds}`;
    return url;
};

let _getStreamData = function (ids, redirect = true) {
    return httpHelper.getHtml(_getRawUrl(ids, redirect), { "Content-Type": "application/json" }).catch((err) => {
        console.log(err);
    }).then((data) => {
        return data;
    })
}

let _rawMovieStreamData = function (ids, redirect = true) {
    var actualIds = _.map(ids, (id) => {
        return id.replace('tt', '');
    });


    return _getStreamData(actualIds, redirect);
}

let movieStreamData = function (ids, redirect = true) {
    return _rawMovieStreamData(ids, redirect).then((data) =>{

        let rawUrl = data;
        rawUrl = rawUrl.replace(`<?xml version="1.0" encoding="utf-8"?>
<string xmlns="http://www.vidsourceapi.com">`, '').replace(`</string>`, '');
        rawUrl = JSON.parse(rawUrl);

        return rawUrl;
    });
}

module.exports = {
    movieStreamData: movieStreamData,
    _rawMovieStreamData: _rawMovieStreamData,
    _getRawUrl: _getRawUrl
}