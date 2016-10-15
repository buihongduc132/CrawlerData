var pathToRoot = '../';
var path = require('path');
var config = require(path.join(pathToRoot, 'config.json'));

var request = require('request');
var Promise = require('bluebird');
Promise.promisifyAll(request);
var args = require(path.join(pathToRoot, config.path.require.args));
var httpHelper = require(path.join(pathToRoot, config.path.httpHelper));
var fsHelper = require(path.join(pathToRoot, config.path.fsHelper));

// var refreshMockData = function() {
//     var 
// }