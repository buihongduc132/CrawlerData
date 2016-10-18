var gulp = require('gulp');

var pathToRoot = '/';
var path = require('path');


var moduleLocation = require(path.join(__dirname, pathToRoot, 'constant/require.json'));
var args = require(path.join(__dirname, pathToRoot, moduleLocation.args));
var crawlData = require(path.join(__dirname, pathToRoot, moduleLocation.service.crawlData));

// var buildMovieJsonOverview = crawlData.buildMovieJsonOverview();

// var writeMovieJsonOverview = buildMovieJsonOverview.then((movies) => {
//     return crawlData.writeMovieJsonOverview(movies);
// });

var getNewMovies = crawlData.getNewMovies().then((data) => {
    console.log(data.length);
});

// // var getAllMovies = crawlData.getAllMovieDetail().then((data) => {
// //     // console.log(data);
// // })

// var fs = require('fs');
// var Promise = require('bluebird');
// Promise.promisifyAll(fs);
// var cheerio = require('cheerio');

// // var readTestHtml = fs.readFileAsync('./testHtml.html', 'utf-8');

// // var writeTestHtml = readTestHtml.then((data) => {
// //     let $ = cheerio.load(data);
// //     var html = $('html').attr('lang');
// //     console.log(html);
// //     // console.log(data);

// //     return fs.writeFile('./testHtmlOutput.html', data, 'utf-8');
// // });

// // var result = writeTestHtml.then((data) => {
// //     console.log('done');
// // });

// var readTestJson = fs.readFileAsync('./testData/testJson.json', 'utf-8');

// var writeTestJson = readTestJson.then((data) => {
//     console.log(data);

//     return fs.writeFile('./testData/testJsonOutput.json', data, 'utf-8');
// })

// var result = writeTestJson.then((data) => {
//     console.log('done');
// })