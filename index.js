// // var gulp = require('gulp');

// // var path = require('path');
// // var pathToRoot = path.join(__dirname, '/');

// // var moduleLocation = require(path.join(pathToRoot, 'constant/require.json'));
// // var args = require(path.join(pathToRoot, moduleLocation.args));
// // var crawlData = require(path.join(pathToRoot, moduleLocation.service.crawlData));
// // var converter = require(path.join(pathToRoot, moduleLocation.service.converter));
// // var uiHelper = require(path.join(pathToRoot, moduleLocation.uiHelper));

// // //  crawlData.buildCombinedMovieJson();

// // uiHelper.log.error('testing');

// //Converter Class 
// var Converter = require("csvtojson").Converter;
// var converter = new Converter({});
// var Promise = require('bluebird');
// Promise.promisifyAll(converter);
// var _ = require('lodash');

// // converter.fromFileAsync("./mock/moviesDescription.csv").then((result) => {
// //     console.log(result);

// //     var testingResult = _.find(result, { id: 'tt0094625' });
// //     console.log(testingResult);
// // });


// var movieDescriptions = undefined;
// for (var i = 0; i < 10; i++) {
//     if (!movieDescriptions) {
//         converter.fromFileAsync("./mock/moviesDescription.csv").then((result) => {
//             movieDescription = result;
//             // var movieInfo = _.find(movieDescription, { id: movie.id });
//             // movie.description = movieInfo.description;
//             console.log("Read Description");
//             // return Promise.resolve(movie);
//         });
//     }
// }

var fs = require('fs');
var Promise = require('bluebird');
Promise.promisifyAll(fs);

var data = [1,2,3];

Promise.resolve(fs.writeFileAsync('./testingFile.json', JSON.stringify(data)));