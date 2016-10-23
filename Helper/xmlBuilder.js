var cheerio = require('cheerio');

var getPostName = function (postTitle) {
    return postTitle ? postTitle.replace(/\s|\(/g, '-').replace(/\)$/, '') : '<Blank Title>';
}

var getLinkId = function (rawId) {
    return rawId ? rawId.replace(/^tt/, '') : '<Blank Id>';
}

var getThumbnailId = function (rawId) {
    return rawId * 11;
}

var getContentImgId = function (rawId) {
    return rawId * 111;
}

module.exports = {
    getSelector(data, selector) {
        let $ = cheerio.load(data);
        return $(selector);
    },
    getMovieDetail(data) {
        var getSelector = this.getSelector;

        function getTextDetail(data, selector) {
            let $ = cheerio.load(data);
            var selector = $(selector).text();
            return selector;
        };

        function getListData(data, selector) {

            let $ = cheerio.load(data);
            var rawHtml = $(selector);

            var list = [];
            for (var i = 0; i < rawHtml.length; i++) {
                var current = rawHtml[i];
                list.push(current.children[0].data);
            }
            return list;
        };

        function getDataFromAttribute(data, selector, attribute) {
            return getSelector(data, selector).attr(attribute);
        }

        var result = {
            title: getDataFromAttribute(data, 'meta[property="og:title"]', 'content'),
            starRanking: getTextDetail(data, 'div.ratingValue>strong>span'),
            metaScore: getTextDetail(data, '.metacriticScore.score_favorable.titleReviewBarSubItem>span'),
            director: getTextDetail(data, '.credit_summary_item>span[itemprop="director"]>a'),
            writer: getListData(data, '.credit_summary_item>span[itemprop="creator"]>a>span'),
            stars: getListData(data, '.credit_summary_item>span[itemprop="actors"]>a>span'),
            duration: getTextDetail(data, '#titleDetails>div>time[itemprop="duration"]'),
            genre: getListData(data, '.subtext>a>span[itemprop="genre"]'),
            release: getDataFromAttribute(data, 'div.subtext>a>meta[itemprop="datePublished"]', 'content'),
            poster: getDataFromAttribute(data, 'meta[property="og:image"]', 'content'),
            alsoLike: '',
            summary: getTextDetail(data, '.summary_text'),
            storyline: getTextDetail(data, '#titleStoryLine>div[itemprop="description"]>p'),
            year: getTextDetail(data, '#titleYear>a'),
            uri: getDataFromAttribute(data, 'meta[property="og:url"]', 'content'),
            id: getDataFromAttribute(data, 'meta[property="pageId"]', 'content')
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

// {
//     "title": "Goat (2016)",
//     "starRanking": "",
//     "metaScore": "",
//     "director": "",
//     "writer": [],
//     "stars": [],
//     "duration": "",
//     "genre": [],
//     "poster": "https://images-na.ssl-images-amazon.com/images/M/MV5BMTUxNjg1ODY3Ml5BMl5BanBnXkFtZTgwODEyNjUzOTE@._V1_UY1200_CR90,0,630,1200_AL_.jpg",
//     "alsoLike": "",
//     "summary": "",
//     "storyline": "",
//     "year": "",
//     "uri": "http://www.imdb.com/title/tt4437216/",
//     "id": "tt4437216"
// }