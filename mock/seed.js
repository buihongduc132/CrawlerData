var path = require('path');
var pathToRoot = path.join(__dirname, '../');

var moduleLocation = require(path.join(pathToRoot, 'constant/require.json')); 
var urlLocation = require(path.join(pathToRoot, 'constant/url.json'));
var testData = require(path.join(pathToRoot, 'constant/testData.json'));

var httpHelper = require(path.join(pathToRoot, moduleLocation.httpHelper));
var fileHelper = require(path.join(pathToRoot, moduleLocation.fileHelper));

(() => {
    testData.mockData.forEach((mockItem) => {
        var htmlResult = httpHelper.getHtml(mockItem.url);

        var fsWrite = htmlResult.then((result) => {
            return fileHelper.writeFile(mockItem.path, result.body);
        });

        var doneFunction = fsWrite.then(() => {
            console.log(`Done: ${mockItem.path}`);
        });
    });
})();
