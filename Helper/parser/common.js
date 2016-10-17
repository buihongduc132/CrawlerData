var cheerio = require('cheerio');

var getSelector = function (data, selector) {
    let $ = cheerio.load(data);
    return $(selector);
};

var getTextDetail = function (data, selector) {
    let $ = cheerio.load(data);
    var selector = $(selector).text();
    return selector;
};

var getDataFromAttribute = function (data, selector, attribute) {
    return getSelector(data, selector).attr(attribute);
};

var getListData = function (data, selector) {
    let $ = cheerio.load(data);
    var rawHtml = $(selector);

    var list = [];

    for (var i = 0; i < rawHtml.length; i++) {
        var current = rawHtml[i];
        list.push(current.children[0].data);
    }
    return list;
};

module.exports = {
    getSelector: getSelector,
    getTextDetail: getTextDetail,
    getDataFromAttribute: getDataFromAttribute,
    getListData: getListData
}