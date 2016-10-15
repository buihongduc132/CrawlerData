var pathToRoot = '../';
var path = require('path');
var config = require(path.join(pathToRoot, 'config.json'));

var Promise = require('bluebird');
var fs = require('fs');
Promise.promisifyAll(fs);
var _ = require('lodash');
var args = require(path.join(pathToRoot, config.path.require.args));

var readFile = function(inputPath) {
    return fs.readFileAsync(inputPath, config.fileEncoding);
}

var writeFile = function(inputPath, data) {
    return fs.writeFileAsync(inputPath, data, config.fileEncoding);
}

var getFiles = function(inputPath) {
    return fs.readdirAsync(inputPath);
}

var getFilesByType = function(inputPath) {
    return Promise.resolve(fs.readdirAsync(inputPath).then((fileNames) => {
        return _.filter(fileNames, (fileName) => {
            return fileName.substr(fileName.length-5, fileName.length) === '.json';
        });
    }));
}

module.exports = { 
    readFile: readFile,
    writeFile: writeFile,
    getFiles: getFiles,
    getFilesByType: getFilesByType
}