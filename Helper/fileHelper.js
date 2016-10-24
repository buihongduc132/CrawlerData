var path = require('path');
var pathToRoot = path.join(__dirname, '../');

var moduleLocation = require(path.join(pathToRoot, 'constant/require.json'));
var urlLocation = require(path.join(pathToRoot, moduleLocation.url));
var config = require(path.join(pathToRoot, moduleLocation.config));
var Promise = require('bluebird');
var fs = require('fs');
Promise.promisifyAll(fs);
var _ = require('lodash');
var args = require(path.join(pathToRoot, moduleLocation.args));
var Converter = require("csvtojson").Converter;
var json2csv = require('json2csv');
var csvConverter = new Converter({});
Promise.promisifyAll(csvConverter);

var readFileAsHtml = function (inputPath) {
    var file = fs.readFileAsync(path.join(pathToRoot, inputPath), config.fileEncoding);
    return file.then((data) => {
        var dataToString = data.replace('\\"', '"');
        return Promise.resolve(dataToString);
    });
}

var readFile = function (inputPath) {
    return fs.readFileAsync(path.join(pathToRoot, inputPath), config.fileEncoding);
}

var writeFile = function (inputPath, data) {
    return fs.writeFileAsync(path.join(pathToRoot, inputPath), data, config.fileEncoding);
}

var getFiles = function (inputPath) {
    return fs.readdirAsync(path.join(pathToRoot, inputPath));
}

var getCsvFile = function (inputPath) {
    return csvConverter.fromFileAsync(path.join(pathToRoot, inputPath));
}

var writeCsvFile = function (inputPath, data) {
    var csv = json2csv({ data: data, fields: _.keys(data[0]) });
    // Promise.resolve(data).then((result) => {
        // console.log(data);
    // })
    return fs.writeFileAsync(path.join(pathToRoot, inputPath), csv, config.fileEncoding);
}

var getFilesByType = function (inputPath) {
    return Promise.resolve(fs.readdirAsync(inputPath).then((fileNames) => {
        return _.filter(fileNames, (fileName) => {
            return fileName.substr(fileName.length - 5, fileName.length) === '.json';
        });
    }));
}

var stats = function (inputPath) {
    return fs.statAsync(path.join(pathToRoot, inputPath));
}

var appendFile = function (inputPath, data) {
    return fs.appendFileAsync(path.join(pathToRoot, inputPath), data, config.fileEncoding);
}

module.exports = {
    writeCsvFile: writeCsvFile,
    readFile: readFile,
    writeFile: writeFile,
    getFiles: getFiles,
    getFilesByType: getFilesByType,
    appendFile: appendFile,
    readFileAsHtml: readFileAsHtml,
    stats: stats,
    getCsvFile: getCsvFile
}