var path = require('path');
var pathToRoot = path.join(__dirname, '../');

var moduleLocation = require(path.join(pathToRoot, 'constant/require.json'));
var urlLocation = require(path.join(pathToRoot, moduleLocation.url));

var config = require(path.join(pathToRoot, moduleLocation.config));

var Promise = require('bluebird');
var fs = require('fs');
Promise.promisifyAll(fs);
var uiHelper = require(path.join(pathToRoot, moduleLocation.uiHelper));
var _ = require('lodash');
var args = require(path.join(pathToRoot, moduleLocation.args));

var readFileAsHtml = function(inputPath) {
    var file = fs.readFileAsync(path.join(pathToRoot, inputPath), config.fileEncoding);
    return file.then((data) => {
        var dataToString = data.replace('\\"', '"');
        return Promise.resolve(dataToString);
    });  
}

var readFile = function(inputPath) {
    return fs.readFileAsync(path.join(pathToRoot, inputPath), config.fileEncoding);
}

var writeFile = function(inputPath, data) {
    return fs.writeFileAsync(path.join(pathToRoot, inputPath), data, config.fileEncoding);
}

var getFiles = function(inputPath) {
    return fs.readdirAsync(path.join(pathToRoot,inputPath));
}

var getFilesByType = function(inputPath) {
    return Promise.resolve(fs.readdirAsync(inputPath).then((fileNames) => {
        return _.filter(fileNames, (fileName) => {
            return fileName.substr(fileName.length-5, fileName.length) === '.json';
        });
    }));
}

var stats = function(inputPath) {
    return fs.statAsync(path.join(pathToRoot, inputPath));
}

var appendFile = function(inputPath, data) {
    return fs.appendFileAsync(path.join(pathToRoot, inputPath), data, config.fileEncoding);
}

module.exports = { 
    readFile: readFile,
    writeFile: writeFile,
    getFiles: getFiles,
    getFilesByType: getFilesByType,
    appendFile: appendFile,
    readFileAsHtml: readFileAsHtml,
    stats: stats
}