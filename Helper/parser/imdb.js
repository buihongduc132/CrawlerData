var path = require('path');
var pathToRoot = path.join(__dirname, '../../');

var moduleLocation = require(path.join(pathToRoot, 'constant/require.json'));
var commonParser = require(path.join(pathToRoot, moduleLocation.parser.common));
var url = require(path.join(pathToRoot, moduleLocation.url));
var config = require(path.join(pathToRoot, moduleLocation.config));

var cheerio = require('cheerio');

let getPostName = function (postTitle) {
    return postTitle ? postTitle.replace(/\s|\(/g, '-').replace(/\)$/, '') : '<Blank Title>';
};

let getIdFromString = function (input) {
    var regPattern = /tt\d{5,10}/;
    var match = input.match(regPattern);
    if (match.length > 0) {
        return match[0];
    }
    return '';
}

let getLinkId = function (rawId) {
    return rawId ? rawId.replace(/^tt/, '') : '<Blank Id>';
};
let getThumbnailId = function (rawId) {
    return rawId * 11;
};

let getContentImgId = function (rawId) {
    return rawId * 111;
};

let contentBody = function (data) {
    return ``;
}

module.exports = {
    getPostName: getPostName,
    getLinkId: getLinkId,
    getThumbnailId: getThumbnailId,
    getContentImgId: getContentImgId,
    list: {
        movie: function (data) {
            let $ = cheerio.load(data);
            var result = commonParser.getSelector(data, '.lister-item-header');
            var movieList = [];
            for (let i = 0; i < result.length; i++) {
                var resultHtml = $(result[i]);

                movieList.push({
                    name: resultHtml.find('a').text() || '_Blank_name',
                    url: url.imdb.root + resultHtml.find('a').attr('href') || '_Blank_url',
                    id: getIdFromString(path.join(url.imdb.root, resultHtml.find('a').attr('href'))) || '_Blank_id',
                    year: resultHtml.find('span.lister-item-year').text() || '_Blank_year_'
                })
            }

            return movieList;
        }
    },
    //TODO: Change Director to push to array instead of fixed array
    detailToObject: function (data) {
        var result = {
            title: commonParser.getDataFromAttribute(data, 'meta[property="og:title"]', 'content') || '_Blank_title_',
            starRanking: commonParser.getTextDetail(data, 'div.ratingValue>strong>span') || '_Blank_starRanking_',
            metaScore: commonParser.getTextDetail(data, '.metacriticScore.score_favorable.titleReviewBarSubItem>span') || '_Blank_metaScore_',
            director: [commonParser.getTextDetail(data, '.credit_summary_item>span[itemprop="director"]>a') || '_Blank_director_'],
            writer: commonParser.getListData(data, '.credit_summary_item>span[itemprop="creator"]>a>span') || '_Blank_writer_',
            stars: commonParser.getListData(data, '.credit_summary_item>span[itemprop="actors"]>a>span') || '_Blank_stars_',
            duration: commonParser.getListData(data, '#titleDetails>div>time[itemprop="duration"]') || '_Blank_duration_', //Get only first duration
            genre: commonParser.getListData(data, '.subtext>a>span[itemprop="genre"]') || '_Blank_genre_',
            release: commonParser.getDataFromAttribute(data, 'div.subtext>a>meta[itemprop="datePublished"]', 'content') || '_Blank_release_',
            poster: commonParser.getDataFromAttribute(data, 'meta[property="og:image"]', 'content') || '_Blank_poster_',
            alsoLike: '_Blank_alsoLike_',
            summary: commonParser.getTextDetail(data, '.summary_text') || '_Blank_summary_',
            storyline: commonParser.getTextDetail(data, '#titleStoryLine>div[itemprop="description"]>p') || '_Blank_storyline_',
            year: commonParser.getTextDetail(data, '#titleYear>a') || '_Blank_year_',
            uri: commonParser.getDataFromAttribute(data, 'meta[property="og:url"]', 'content') || '_Blank_uri_',
            id: commonParser.getDataFromAttribute(data, 'meta[property="pageId"]', 'content') || '_Blank_id_',
            body: contentBody(data)
        }

        let getWiderPoster = function(posterUrl) {
            let pattern = /(https?:\/\/images-na\.ssl-images-amazon\.com\/images\/M\/.+@\._V1_UY\d{1,5}_CR\d{1,4},0,)\d{1,4}(,\d{1,5}_AL_\.jpg)/;
            let newPoster = posterUrl.replace(pattern, `$1${config.page.wordpress.posterWidth}$2`);

            return newPoster;
        }
        result.poster = getWiderPoster(result.poster);
        result.postName = getPostName(result.title);
        result.duration = result.duration[0];
        result.intId = getLinkId(result.id);
        result.img = {
            thumbnail: getThumbnailId(result.intId).toString(),
            content: getContentImgId(result.intId).toString()
        };

        return result;
    }
}