var Promise = require('bluebird');
var fs = require('fs');
var path = require('path');
Promise.promisifyAll(fs);
var config = require('../config.json');

var readFile = function(inputPath) {
    return fs.readFileAsync(inputPath, config.fileEncoding);
}

var writeFile = function(inputPath) {
    throw new Error('Not yet implemented (readFile)');
}

module.exports = { 
    readFile: readFile,
    writeFile: writeFile
}