var path = require('path');
var pathToRoot = path.join(__dirname, '../../');

var moduleLocation = require(path.join(pathToRoot, 'constant/require.json'));
var commonParser = require(path.join(pathToRoot, moduleLocation.parser.common));
var url = require(path.join(pathToRoot, moduleLocation.url));

var cheerio = require('cheerio');

let getPostName = function (postTitle) {
    return postTitle ? postTitle.replace(/\s|\(/g, '-').replace(/\)$/, '') : '<Blank Title>';
};

let getIdFromString = function (input) {
    var regPattern = /tt\d{5,10}/;
    var match = input.match(regPattern);
    if(match.length > 0) {
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

module.exports = {
    getPostName: getPostName,
    getLinkId: getLinkId,
    getThumbnailId: getThumbnailId,
    getContentImgId: getContentImgId,
    list: {
        movie: function (data) {
            let $ = cheerio.load(data);
            var result = commonParser.getSelector(data, '.lister-item-header>a');
            var movieList = [];
            for (let i = 0; i < result.length; i++) {
                var resultHtml = $(result[i]);

                movieList.push({
                    name: resultHtml.text(),
                    url: path.join(url.imdb.root, resultHtml.attr('href')),
                    id: getIdFromString(path.join(url.imdb.root, resultHtml.attr('href')))
                })
            }

            return movieList;
        }
    },
    detailToObject: function (data) {
        var result = {
            title: commonParser.getDataFromAttribute(data, 'meta[property="og:title"]', 'content'),
            starRaking: commonParser.getTextDetail(data, 'div.ratingValue>strong>span'),
            metaScore: commonParser.getTextDetail(data, '.metacriticScore.score_favorable.titleReviewBarSubItem>span'),
            director: commonParser.getTextDetail(data, '.credit_summary_item>span[itemprop="director"]>a'),
            writer: commonParser.getListData(data, '.credit_summary_item>span[itemprop="creator"]>a>span'),
            stars: commonParser.getListData(data, '.credit_summary_item>span[itemprop="actors"]>a>span'),
            duration: commonParser.getTextDetail(data, '#titleDetails>div>time[itemprop="duration"]'),
            genre: commonParser.getListData(data, '.subtext>a>span[itemprop="genre"]'),
            release: commonParser.getDataFromAttribute(data, 'div.subtext>a>meta[itemprop="datePublished"]', 'content'),
            poster: commonParser.getDataFromAttribute(data, 'meta[property="og:image"]', 'content'),
            alsoLike: '',
            summary: commonParser.getTextDetail(data, '.summary_text'),
            storyline: commonParser.getTextDetail(data, '#titleStoryLine>div[itemprop="description"]>p'),
            year: commonParser.getTextDetail(data, '#titleYear>a'),
            uri: commonParser.getDataFromAttribute(data, 'meta[property="og:url"]', 'content'),
            id: commonParser.getDataFromAttribute(data, 'meta[property="pageId"]', 'content')
        }

        result.postName = getPostName(result.title);
        result.intId = getLinkId(result.id);
        result.img = {
            thumbnail: getThumbnailId(result.intId),
            content: getContentImgId(result.intId)
        };

        return result;
    }
}