var path = require('path');
var pathToRoot = path.join(__dirname, '../../');

var moduleLocation = require(path.join(pathToRoot, 'constant/require.json'));
var urlLocation = require(path.join(pathToRoot, moduleLocation.url));
var testData = require(path.join(pathToRoot, moduleLocation.testData));
var stream = require(path.join(pathToRoot, moduleLocation.stream));

var chai = require('chai');
var expect = chai.expect;
var args = require(path.join(pathToRoot, moduleLocation.args));
var config = require(path.join(pathToRoot, moduleLocation.config));

describe('Get data from Vid Source', () => {
    describe('_get Raw Url', () => {
        it('should get the correct raw Url', () => {
            let ids = ['1234567', '2345678', '3456789'];
            let result = stream._getRawUrl(ids);

            let expected = 'http://www.vidsourceapi.com/WebService.asmx/GetStreamEmbedUrlByIMDBIDs?apikey=yQEiCTH84dOJNFQ7&redirecton=true&imdbids=1234567,2345678,3456789';
            expect(result).equal(expected);
        });

    });
    describe('Get raw movie stream response', () => {
        it('should get correct movieStreamUrl (From Mock)', () => {
            let ids = ['tt1234567', 'tt2345678', 'tt3456789'];
            let expected = `<?xml version="1.0" encoding="utf-8"?>
<string xmlns="http://www.vidsourceapi.com">{"status":200,"msg":"OK","result":[{"MovieIMDBID":107120,"ID":"33IQRRoUhBE","EmbedUrl":"https://openload.co/embed/33IQRRoUhBE"},{"MovieIMDBID":918940,"ID":"0lSPqQ04mdU","EmbedUrl":"https://openload.co/embed/0lSPqQ04mdU"},{"MovieIMDBID":1289401,"ID":"NKOOTqXgins","EmbedUrl":"https://openload.co/embed/NKOOTqXgins"},{"MovieIMDBID":1386697,"ID":"rt66WsMxtoA","EmbedUrl":"https://openload.co/embed/rt66WsMxtoA"},{"MovieIMDBID":1431045,"ID":"jUirqMnyzEg","EmbedUrl":"https://openload.co/embed/jUirqMnyzEg"},{"MovieIMDBID":1628841,"ID":"41s7bpD-wsw","EmbedUrl":"https://openload.co/embed/41s7bpD-wsw"},{"MovieIMDBID":1700841,"ID":"yqiiW68MDr4","EmbedUrl":"https://openload.co/embed/yqiiW68MDr4"},{"MovieIMDBID":1935859,"ID":"WNaWnhNVjho","EmbedUrl":"https://openload.co/embed/WNaWnhNVjho"},{"MovieIMDBID":2404435,"ID":"vwUIn-Nb22g","EmbedUrl":"https://openload.co/embed/vwUIn-Nb22g"},{"MovieIMDBID":2660888,"ID":"PnyFnleOz0U","EmbedUrl":"https://openload.co/embed/PnyFnleOz0U"},{"MovieIMDBID":2674426,"ID":"XDOpdcAG70g","EmbedUrl":"https://openload.co/embed/XDOpdcAG70g"},{"MovieIMDBID":2948356,"ID":"-Z6g8THB-_E","EmbedUrl":"https://openload.co/embed/-Z6g8THB-_E"},{"MovieIMDBID":3385516,"ID":"RjfEGUTCrY8","EmbedUrl":"https://openload.co/embed/RjfEGUTCrY8"},{"MovieIMDBID":3498820,"ID":"7EPbDV8CaHI","EmbedUrl":"https://openload.co/embed/7EPbDV8CaHI"},{"MovieIMDBID":3531824,"ID":"RwGkcAdgAEI","EmbedUrl":"https://openload.co/embed/RwGkcAdgAEI"},{"MovieIMDBID":4786282,"ID":"_wyL1kBz_-w","EmbedUrl":"https://openload.co/embed/_wyL1kBz_-w"}]}</string>`;

            return stream._rawMovieStreamData(ids).then((data) => {
                return expect(data).equal(expected);
            })
        });
    });
    describe('Get movie stream data', () => {
        it('should get the parsed object from vidSource', () => {
            let ids = ['tt1234567', 'tt2345678', 'tt3456789'];
            return stream.movieStreamData(ids).then((data) => {
                expect(data.result.length).equal(16);
                expect(data.status).equal(200);
                expect(data.msg).equal('OK');
            })
        });
    });
});
