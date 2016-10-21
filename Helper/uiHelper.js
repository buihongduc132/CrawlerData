var ProgressBar = require('progress');
var colors = require('colors');

colors.setTheme({
    success: ['green', 'bold', 'underline'],
    error: ['red', 'bold'],
    title: ['blue', 'bold'],
    progressRemain: 'bgRed',
    progressDone: 'bgGreen'
});


var _doneMessage = function(text) {
    return _getTextTemplate(text).white.bgGreen;
}

var _getSpace = function(length) {
    var result = '';
    for(let i = 0 ; i < length; i++) {
        result += ' ';
    }

    return result;
}

var _getTextTemplate = function(text) {
    var indient = _getSpace(4);
    var textLengthSpace = _getSpace(text.length);
    return `${indient}${textLengthSpace}${indient}
${indient}${text}${indient}
${indient}${textLengthSpace}${indient}`;
}

var bar = function (total, action) {
    var progressBar = new ProgressBar(action.success + ': :bar' + ' Time: :elapseds'.title,
        {
            total: total,
            complete: ' '.progressRemain,
            incomplete: ' '.progressDone,
            clear: true,
            width: 50
        }
    );

    progressBar.done = function(action) {
        console.log(_doneMessage(text));
    }

    return progressBar;
}

module.exports = {
    progressBar: bar,
    log: {
        done: function(text) {
            console.log(_doneMessage(text));
        }
    }
}