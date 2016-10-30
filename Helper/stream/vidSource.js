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
    return httpHelper.getHtml(_getRawUrl(ids, redirect)).catch((err) => {
        uiHelper.log.error(err);
    });
}

let _rawMovieStreamData = function (ids, redirect = true) {
    var actualIds = _.map(ids, (id) => {
        return id.replace('tt', '');
    });


    return _getStreamData(actualIds, redirect);
}

let movieStreamData = function (ids, redirect = true) {
    let streamData = _rawMovieStreamData(ids, redirect).then((data) => {
        let rawUrl = data;

        try {
            rawUrl = rawUrl.replace(`<?xml version="1.0" encoding="utf-8"?>`, '')
                .replace(`<string xmlns="http://www.vidsourceapi.com">`, '')
                .replace(`</string>`, '')
                .substring(2);
            rawUrl = JSON.parse(rawUrl);
        } catch (error) {
            rawUrl = {
                status: 0,
                msg: 'FAILED',
                result: []
            };
        }

        return Promise.resolve(rawUrl.result);
    });

    return streamData;
}

module.exports = {
    movieStreamData: movieStreamData,
    // _rawMovieStreamData: _rawMovieStreamData,
    _getRawUrl: _getRawUrl
}