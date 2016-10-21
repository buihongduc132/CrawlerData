// // var path = require('path');
// // var pathToRoot = path.join(__dirname, '/');

// // var moduleLocation = require(path.join(pathToRoot, 'constant/require.json'));
// // var args = require(path.join(pathToRoot, moduleLocation.args));
// // var crawlData = require(path.join(pathToRoot, moduleLocation.service.crawlData));

// // console.log(args);

// // // var buildMovieJsonOverview = crawlData.buildMovieJsonOverview();

// // // var writeMovieJsonOverview = buildMovieJsonOverview.then((movies) => {
// // //     return crawlData.writeMovieJsonOverview(movies);
// // // });

// // // var buildMovieJsonOverview = crawlData.buildMovieJsonOverview(args.pages).then(() => {
// // //     console.log(pages);
// // //     console.log('Done Building Movie Overview Json');
// // // });

// var ProgressBar = require('progress');

// // var bar = new ProgressBar(':bar',
// //     {
// //         total: 20,
// //         complete: '=',
// //         incomplete: '-',
// //         clear: true
// //     }
// // );
// // var timer = setInterval(function () {
// //     bar.tick();
// //     if (bar.complete) {
// //         console.log('\ncomplete\n');
// //         clearInterval(timer);
// //     }
// // }, 100);

var uiHelper = require('./Helper/uiHelper.js');

var bar = uiHelper.progressBar(100, 'Testing');

// // bar.tick();

// // var bar = new ProgressBar(':bar',
// //     {
// //         total: 20,
// //         complete: '=',
// //         incomplete: '-',
// //         clear: true
// //     }
// // );
// var timer = setInterval(function () {
//     bar.tick(0.5);
//     if (bar.complete) {
//         console.log('Complete'.success);
//         clearInterval(timer);
//     }
// }, 100);

bar.tick(0);