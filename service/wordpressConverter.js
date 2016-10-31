var path = require('path');
var pathToRoot = path.join(__dirname, '../');

var moduleLocation = require(path.join(pathToRoot, 'constant/require.json'));
var urlLocation = require(path.join(pathToRoot, moduleLocation.url));
var config = require(path.join(pathToRoot, moduleLocation.config));
var constant = require(path.join(pathToRoot, moduleLocation.constant));
var moment = require('moment');
var pd = require('pretty-data').pd;
var wpConfig = config.page.wordpress;
var _ = require('lodash');

var getTagUrl = function (tag) {
	return `${wpConfig.homepage}/tag/${tag.replace(/\s/g, '-')}/`;
}

var getRandom = function (length = 10) {
	return Math.round(Math.Random() * length);
}
var buildPageCategories = function (categories) {
	let result = '';
	for (let i = 0; i < categories.length; i++) {
		let category = categories[i];

		result += `
<wp:category><wp:term_id>${getRandom()}</wp:term_id><wp:category_nicename>${getTagUrl(category)}</wp:category_nicename><wp:category_parent></wp:category_parent><wp:cat_name><![CDATA[${category}]]></wp:cat_name>
</wp:category>`;
	}

	return result;
}

buildPageTags = function (tags) {
	let result = '';


	for (let i = 0; i < tags.length; i++) {

		result += `<wp:tag><wp:term_id>${getRandom()}</wp:term_id><wp:tag_slug>${getTagUrl(tag[i])}</wp:tag_slug><wp:tag_name><![CDATA[${tag[i]}]]></wp:tag_name>
</wp:tag>`;
	}

	return result;
}

var buildList = function (data) {
	return `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0"
	xmlns:excerpt="http://wordpress.org/export/1.2/excerpt/"
	xmlns:content="http://purl.org/rss/1.0/modules/content/"
	xmlns:wfw="http://wellformedweb.org/CommentAPI/"
	xmlns:dc="http://purl.org/dc/elements/1.1/"
	xmlns:wp="http://wordpress.org/export/1.2/"
>

<channel>
	<title>Let me take you to your favorite movie.</title>
	<link>Free-${wpConfig.homepage}-${getTagUrl(wpConfig.keyword.url)}</link>
	<description>${wpConfig.pageSlogan}</description>
	<pubDate>Thu, 13 Oct 2016 07:24:53 +0000</pubDate>
	<language></language>
	<wp:wxr_version>1.2</wp:wxr_version>
	<wp:base_site_url>http://wordpress.com/</wp:base_site_url>
	<wp:base_blog_url>Free-${wpConfig.homepage}-${getTagUrl(wpConfig.keyword.url)}</wp:base_blog_url>

	<wp:author><wp:author_id>111385256</wp:author_id>
	<wp:author_login><![CDATA[${wpConfig.admin}]]></wp:author_login>
	<wp:author_email><![CDATA[${wpConfig.admin}@gmail.com]]>
	</wp:author_email>
		<wp:author_display_name><![CDATA[${wpConfig.admin}]]></wp:author_display_name>
		<wp:author_first_name><![CDATA[Herodes]]></wp:author_first_name>
		<wp:author_last_name><![CDATA[Alexandroes]]></wp:author_last_name>
	</wp:author>

	<wp:term><wp:term_id>542817024</wp:term_id><wp:term_taxonomy>nav_menu</wp:term_taxonomy><wp:term_slug><![CDATA[menu-2]]></wp:term_slug><wp:term_name><![CDATA[Menu 2]]></wp:term_name>
</wp:term>
	<wp:term><wp:term_id>1358</wp:term_id><wp:term_taxonomy>nav_menu</wp:term_taxonomy><wp:term_slug><![CDATA[social-links]]></wp:term_slug><wp:term_name><![CDATA[Social Links]]></wp:term_name>
</wp:term>

	<generator>http://wordpress.com/</generator>
<image>
		<url>http://s2.wp.com/i/buttonw-com.png</url>
		<title>${wpConfig.pageName}</title>
		<link>Free-${wpConfig.homepage}-${getTagUrl(wpConfig.keyword.url)}</link>
	</image>
		${data}
</channel>
</rss>
        `;
}


var buildBody = function (data) {
	let getArrayString = function (arrayInput, tag = false, separator = '<br>') {
		if (tag) {
			arrayInput = _.map(arrayInput, (item) => {
				return `<a href="${getTagUrl(item)}">${item}</a>`;
			});
		}

		let finalResult = _.join(arrayInput, separator);
		return finalResult;
	}

	let getContentImage = function (data) {
		return wpConfig.postFormat.haveBodyImage ? `<img class="alignnone size-full wp-image-${data.img.content}" src="${data.poster}"
	alt="${data.title}" width="${wpConfig.posterWidth}" height="1200" />` : '';
	}

	//TODO: Duration is now array. Should get first item.
	var bodyContent = `${getContentImage(data)}<h1 style="font-size: 20px; text-align: center;">${data.title} - Free Movie</h1>

<div style="text-align:center; margin: 50px;">
	<a style="font-size:30px; padding:15px; text-decorator: none; background-color:#6d6d6d; color:white; border-radius:10px; border-color:#0000FF; "
		${data.EmbedUrl ? `href="${data.EmbedUrl}"` : ``}>${data.EmbedUrl ? `Watch Now` : `Coming Soon`}</a>
</div>

<blockquote>
	<p style="margin: 50px; text-align: left;"><strong>Description</strong>: ${data.description || `Coming Soon . . .`}</p>
</blockquote>

<table style="border: 1px solid #CCC; ">
	<tbody>
		<tr>
			<td valign="top" style="padding-left: 5px; border: 1px solid #CCC; width: 60%;"><b>Release</b>: ${data.release}</td>
			<td valign="top" style="padding-left: 5px; border: 1px solid #CCC; width: 40%;"><b>IMDB score</b>: ${data.starRanking}</td>
		</tr>
		<tr>
			<td valign="top" style="padding-left: 5px; border: 1px solid #CCC; width: 60%;"><b>Genre</b>: ${getArrayString(data.genre, true, ', ')}</td>
			<td valign="top" style="padding-left: 5px; border: 1px solid #CCC; width: 40%;"><b>Duration</b>: ${data.duration}s</td>
		</tr>
		<tr>
			<td valign="top" style="padding-left: 5px; border: 1px solid #CCC; width: 60%;"><b>Writer</b>:
					${getArrayString(data.writer)}
			</td>
			<td valign="top" style="padding-left: 5px; border: 1px solid #CCC; width: 40%;"><b>Stars</b>:
					${getArrayString(data.stars, true)}
			</td>
		</tr>
	</tbody>
</table>`;

	return bodyContent;
}

var buildSingle = function (data) {
	let getThumbnailLocation = function(data) {
	// https://images-na.ssl-images-amazon.com/images/M/MV5BMTI1NTc4NjA4M15BMl5BanBnXkFtZTcwNDYwOTgxMQ@@._V1_UY1200_CR100,0,800,1200_AL_.jpg
	// https://alexfreemovie.files.wordpress.com/2016/10/mv5bmzmwmtm4mdu2n15bml5banbnxkftztgwmzq0mjmxmde-_v1_uy1200_cr7308001200_al_1.jpg

		let now = new Date();
		let imgLocation = data.poster.replace(`https://images-na.ssl-images-amazon.com/images/M/`, '')
		.replace('.','-')
		.replace(/,/g,'');

		return `${wpConfig.filesHost}/${now.getFullYear()}/${now.getMonth}/${imgLocation}`;
	}

	var addThumbnail = function (data) {
		return `	<item>
		<title>${data.title}-thumbnail</title>
		<link>${wpConfig.homepage}/${data.postName}-thumbnail/</link>
		<pubDate>${data.nowGmt} +0000</pubDate>
		<dc:creator>${wpConfig.admin}</dc:creator>
		<description></description>
		<content:encoded><![CDATA[]]></content:encoded>
		<excerpt:encoded><![CDATA[]]></excerpt:encoded>
		<wp:post_id>${data.img.thumbnail}</wp:post_id>
		<wp:post_date>${data.nowGmt}</wp:post_date>
		<wp:post_date_gmt>${data.nowGmt}</wp:post_date_gmt>
		<wp:comment_status>open</wp:comment_status>
		<wp:ping_status>closed</wp:ping_status>
		<wp:post_name>${data.postName}-thumbnail</wp:post_name>
		<wp:status>inherit</wp:status>
		<wp:menu_order>0</wp:menu_order>
		<wp:post_type>attachment</wp:post_type>
		<wp:post_password></wp:post_password>
		<wp:post_parent>${data.intId}</wp:post_parent>
		<wp:is_sticky>0</wp:is_sticky>
		<wp:attachment_url>${data.poster}</wp:attachment_url>
		<wp:postmeta>
			<wp:meta_key>pre_import_post_parent</wp:meta_key>
			<wp:meta_value><![CDATA[0]]></wp:meta_value>
		</wp:postmeta>
		<wp:postmeta>
			<wp:meta_key>pre_import_url</wp:meta_key>
			<wp:meta_value><![CDATA[${data.poster}]]></wp:meta_value>
		</wp:postmeta>
		<wp:postmeta>
			<wp:meta_key>_original_import_url</wp:meta_key>
			<wp:meta_value><![CDATA[${data.poster}]]></wp:meta_value>
		</wp:postmeta>
	</item>`;
	}

	let addAttachments = function (data) {
		let result = '';
		result += wpConfig.postFormat.haveThumbnail ? addThumbnail(data) : '';

		return result;
	}
	let getThumbnail = function (data) {
		if (!wpConfig.postFormat.haveThumbnail) {
			return '';
		}

		return `<wp:postmeta>
			<wp:meta_key>_thumbnail_id</wp:meta_key>
			<wp:meta_value><![CDATA[${data.img.thumbnail}]]></wp:meta_value>
		</wp:postmeta>`;
	}
	let buildTag = function (data) {
		let freeTags = [
			`${data.year} Free Movies`,
			`${data.title} Full`,
		]
		let tags = _.union(data.stars, data.genre, freeTags);
		let result = '';

		for (let i = 0; i < tags.length; i++) {
			result += `
		<category domain="post_tag" nicename="${tags[i]}"><![CDATA[${tags[i]}]]></category>`;
		}
		return result;
	}

	let buildCategory = function (category) {
		return `
		<category domain="category" nicename="${category}"><![CDATA[${category}]]></category>`;
	}

	let getTagUrlByDate = function (data) {
		let release = new Date(data.release);
		return `${release.getFullYear}/${release.getMonth}/${release.getDate}`;
	}
	return `
	<item>
		<title>${data.title}</title>
		<link>${wpConfig.homepage}/${getTagUrlByDate(data)}/${data.postName}/</link>
		<pubDate>${data.nowGmt} +0000</pubDate>
		<dc:creator>${wpConfig.admin}</dc:creator>
		<guid isPermaLink="false">${wpConfig.homepage}/?p=${data.intId}</guid>
		<description>${data.summary}</description>
		<content:encoded><![CDATA[${buildBody(data)}]]></content:encoded>
		<excerpt:encoded><![CDATA[]]></excerpt:encoded>
		<wp:post_id>${data.intId}</wp:post_id>
		<wp:post_date>${data.nowGmt}</wp:post_date>
		<wp:post_date_gmt>${data.nowGmt}</wp:post_date_gmt>
		<wp:comment_status>open</wp:comment_status>
		<wp:ping_status>open</wp:ping_status>
		<wp:post_name>${data.postName}</wp:post_name>
		<category domain="post_format" nicename="post-format-aside"><![CDATA[Aside]]></category>
		<wp:status>publish</wp:status>
		<wp:post_parent>0</wp:post_parent>
		<wp:menu_order>0</wp:menu_order>
		<wp:post_type>${wpConfig.postFormat.type}</wp:post_type>
		<wp:post_password></wp:post_password>
		<wp:is_sticky>0</wp:is_sticky>
		${buildCategory(data.year)}
		${buildTag(data)}
		<category domain="category" nicename="${data.year}"><![CDATA[${data.year}]]></category>
		<category domain="post_format" nicename="${constant.postFormat[wpConfig.postFormat.format].nicename}"><![CDATA[${constant.postFormat[wpConfig.postFormat.format].name}]]></category>
		<wp:postmeta>
			<wp:meta_key>_rest_api_published</wp:meta_key>
			<wp:meta_value><![CDATA[1]]></wp:meta_value>
		</wp:postmeta>
		<wp:postmeta>
			<wp:meta_key>switch_like_status</wp:meta_key>
			<wp:meta_value><![CDATA[a:1:{i:0;i:1;}]]></wp:meta_value>
		</wp:postmeta>
		<wp:postmeta>
			<wp:meta_key>_rest_api_client_id</wp:meta_key>
			<wp:meta_value><![CDATA[43452]]></wp:meta_value>
		</wp:postmeta>
		<wp:postmeta>
			<wp:meta_key>_publicize_job_id</wp:meta_key>
			<wp:meta_value><![CDATA[27792209490]]></wp:meta_value>
		</wp:postmeta>
		<wp:postmeta>
			<wp:meta_key>_wpcom_is_markdown</wp:meta_key>
			<wp:meta_value><![CDATA[1]]></wp:meta_value>
		</wp:postmeta>
		<wp:postmeta>
			<wp:meta_key>_wp_desired_post_slug</wp:meta_key>
			<wp:meta_value><![CDATA[${getTagUrl(data.title)}]]></wp:meta_value>
		</wp:postmeta>
		${getThumbnail(data)}
	</item>
	${addAttachments(data)}
`;
}

module.exports = {
	constructXml: function (data) {
		data = JSON.parse(data);
		let result = '';
		const now = moment().format('YYYY-MM-DD hh:mm:ss');
		const nowGmt = moment().subtract({ hours: 7 }).format('YYYY-MM-DD hh:mm:ss');

		for (let i = 0; i < data.length; i++) {
			let currentData = data[i];
			currentData.now = now;
			currentData.nowGmt = nowGmt;

			// result += buildThumbnail(currentData);
			result += buildSingle(currentData);
		}

		result = buildList(result);

		return pd.xml(result);
	}
}