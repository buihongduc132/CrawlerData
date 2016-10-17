var path = require('path');
var pathToRoot = path.join(__dirname, '../');

var moduleLocation = require(path.join(pathToRoot, 'constant/require.json'));
var urlLocation = require(path.join(pathToRoot, 'constant/url.json'));

var fileHelper = require(path.join(pathToRoot, moduleLocation.fileHelper));
var httpHelper = require(path.join(pathToRoot, moduleLocation.httpHelper));

module.exports = {
    readFile: fileHelper.readFile,
    writeFile: fileHelper.writeFile,
    getFiles: fileHelper.getFiles,
    getFilesByType: fileHelper.getFilesByType,
    appendFile: fileHelper.appendFile,
    getHtml: httpHelper.getHtml
}
