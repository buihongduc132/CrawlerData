var pathToRoot = '../';
var path = require('path');
var config = require(path.join(pathToRoot, 'config.json'));

var httpHelper = require(path.join(pathToRoot, config.path.require.httpHelper));
var fileHelper = require(path.join(pathToRoot, config.path.require.fileHelper));

(() => {
    config.path.test.mockData.forEach((mockItem) => {
        var htmlResult = httpHelper.getHtml(mockItem.url);

        var fsWrite = htmlResult.then((result) => {
            return fileHelper.writeFile(mockItem.path, result.body);
        });

        var doneFunction = fsWrite.then(() => {
            console.log(`Done: ${mockItem.path}`);
        });
    });
})();
