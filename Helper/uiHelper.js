var ProgressBar = require('progress');
var colors = require('colors');
var path = require('path');
var pathToRoot = path.join(__dirname, '../');

var moduleLocation = require(path.join(pathToRoot, 'constant/require.json'));

var config = require(path.join(pathToRoot, moduleLocation.config));
var dataService = require(path.join(pathToRoot, moduleLocation.dataService));
var dataLocation = require(path.join(pathToRoot, moduleLocation.dataLocation));
var moment = require('moment');

console.log(path.join(pathToRoot, moduleLocation.dataService));

colors.setTheme({
    success: ['green', 'bold', 'underline'],
    error: ['red', 'bold'],
    title: ['blue', 'bold'],
    progressRemain: 'bgRed',
    progressDone: 'bgGreen'
});


var _doneMessage = function (text) {
    return _getTextTemplate(text).white.bgGreen;
}

var _getSpace = function (length) {
    var result = '';
    for (let i = 0; i < length; i++) {
        result += ' ';
    }

    return result;
}

var _getTextTemplate = function (text) {
    var indient = _getSpace(4);
    var textLengthSpace = _getSpace(text.length);
    return `${indient}${textLengthSpace}${indient}
${indient}${text}${indient}
${indient}${textLengthSpace}${indient}`;
}

var _getLogTemplate = function (text, type) {
    return `${moment().format('YYYY-MM-DD hh:mm:ss')}: ${type || 'Error'} - ${text}\n`;
}

var bar = function (total, action) {
    var progressBar = new ProgressBar(action.success + ': :bar' + ' :percent'.green.bold + ' of ' + ':total'.red + ' items. Time: ' + ':elapseds'.title,
        {
            total: total,
            complete: ' '.progressDone,
            incomplete: ' '.progressRemain,
            clear: true,
            width: 50
        }
    );

    progressBar.done = function (action) {
        console.log(_doneMessage(text));
    }

    return progressBar;
}

module.exports = {
    progressBar: bar,
    log: {
        done: function (text) {
            // console.log(_doneMessage(text));
            return _doneMessage(text)
        },
        error: function (text) {
            var logTemplate = _getLogTemplate(text);
            Promise.resolve(dataService.appendFile(dataLocation.errorLog, logTemplate));
            return logTemplate.red;
        },
        exception: function (text) {
            throw new Error(_getLogTemplate(text).red.underline);
        }
    }
}