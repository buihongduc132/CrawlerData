var path = require('path');
var pathToRoot = path.join(__dirname, '../');

var moduleLocation = require(path.join(pathToRoot, 'constant/require.json'));
var args = require(path.join(pathToRoot, moduleLocation.args));

module.exports = {
    movieListByGenre: function (genre, page = 1) {
        if(args.mock) {
            genre = 'action';
        }

        var urlTemplate = `http://www.imdb.com/search/title?genres=${genre}&sort=user_rating,desc&title_type=feature&num_votes=25000,&pf_rd_m=A2FGELUUNOQJNL&pf_rd_p=2406822102&pf_rd_r=1V8KNKKMTGS5AFZ0F8HH&pf_rd_s=right-6&pf_rd_t=15506&pf_rd_i=top&ref_=chttp_gnr_1&page=${page}`;

        return urlTemplate;
    },
    testHtml: function() {
    return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Document</title>
    </head>
    <body>
        <div class="class-one">class one</div>
        <div id="id-one" data="id-one-data">id one</div>
        <div class="class-two">class 2.1</div>
        <div class="class-two">class 2.2</div>
        <div class="class-two">class 2.3</div>
    </body>
    </html>`;
    }
}