
module.exports = {
    list: {
        detailUrlByRanking: function (data) {
            throw new Error('not yet implemented (rankingListParser)');
        },
        detailUrlByCategory: function (data) {
            throw new Error('not yet implemented (categoryListParser)');
        },
        listCategories: function (data) {
            throw new Error('not yet implemented (listCategories)');
        }
    },
    detailToObject: function (data) {
        let getPostName = function (postTitle) {
            return postTitle ? postTitle.replace(/\s|\(/g, '-').replace(/\)$/, '') : '<Blank Title>';
        };

        let getLinkId = function (rawId) {
            return rawId ? rawId.replace(/^tt/, '') : '<Blank Id>';
        };
        let getThumbnailId = function (rawId) {
            return rawId * 11;
        };

        let getContentImgId = function (rawId) {
            return rawId * 111;
        };

        var result = {
            title: getDataFromAttribute(data, 'meta[property="og:title"]', 'content'),
            starRaking: getTextDetail(data, 'div.ratingValue>strong>span'),
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