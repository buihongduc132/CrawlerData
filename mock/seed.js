var path = require('path');
var pathToRoot = path.join(__dirname, '../');

var moduleLocation = require(path.join(pathToRoot, 'constant/require.json')); 
var urlLocation = require(path.join(pathToRoot, moduleLocation.url));
var testData = require(path.join(pathToRoot, moduleLocation.testData));

var httpHelper = require(path.join(pathToRoot, moduleLocation.httpHelper));
var fileHelper = require(path.join(pathToRoot, moduleLocation.fileHelper));

(() => {
    testData.mockData.forEach((mockItem) => {
        var htmlResult = httpHelper.getHtml(mockItem.seedUrl);

        var fsWrite = htmlResult.then((result) => {
            return fileHelper.writeFile(mockItem.path, result);
        });

        var doneFunction = fsWrite.then(() => {
            console.log(`Done: ${mockItem.path}`);
        });
    });
})();
