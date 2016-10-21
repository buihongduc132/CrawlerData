var path = require('path');
var pathToRoot = path.join(__dirname, '../');

var moduleLocation = require(path.join(pathToRoot, 'constant/require.json'));
var urlLocation = require(path.join(pathToRoot, moduleLocation.url));
var config = require(path.join(pathToRoot, moduleLocation.config));
var moment = require('moment');

var template = {
    single: function(data) {
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
	<link>${config.homepage}</link>
	<description>Free movie for everyone.</description>
	<pubDate>Thu, 13 Oct 2016 07:24:53 +0000</pubDate>
	<language></language>
	<wp:wxr_version>1.2</wp:wxr_version>
	<wp:base_site_url>http://wordpress.com/</wp:base_site_url>
	<wp:base_blog_url>${config.homepage}</wp:base_blog_url>

	<wp:author><wp:author_id>111385256</wp:author_id><wp:author_login><![CDATA[herodesalex243]]></wp:author_login><wp:author_email><![CDATA[herodesalex243@gmail.com]]></wp:author_email><wp:author_display_name><![CDATA[herodesalex243]]></wp:author_display_name><wp:author_first_name><![CDATA[Herodes]]></wp:author_first_name><wp:author_last_name><![CDATA[Alexandroes]]></wp:author_last_name></wp:author>

	<wp:category><wp:term_id>48041</wp:term_id><wp:category_nicename>2015</wp:category_nicename><wp:category_parent></wp:category_parent><wp:cat_name><![CDATA[2015]]></wp:cat_name>
</wp:category>
	<wp:category><wp:term_id>708859</wp:term_id><wp:category_nicename>2016</wp:category_nicename><wp:category_parent></wp:category_parent><wp:cat_name><![CDATA[2016]]></wp:cat_name>
</wp:category>
	<wp:category><wp:term_id>1</wp:term_id><wp:category_nicename>uncategorized</wp:category_nicename><wp:category_parent></wp:category_parent><wp:cat_name><![CDATA[Uncategorized]]></wp:cat_name>
</wp:category>
	<wp:tag><wp:term_id>2592796</wp:term_id><wp:tag_slug>testingtag1</wp:tag_slug><wp:tag_name><![CDATA[TestingTag1]]></wp:tag_name>
</wp:tag>
	<wp:tag><wp:term_id>2592797</wp:term_id><wp:tag_slug>testingtag2</wp:tag_slug><wp:tag_name><![CDATA[TestingTag2]]></wp:tag_name>
</wp:tag>
	<wp:tag><wp:term_id>542817020</wp:term_id><wp:tag_slug>testingtag3</wp:tag_slug><wp:tag_name><![CDATA[TestingTag3]]></wp:tag_name>
</wp:tag>
	<wp:tag><wp:term_id>542817023</wp:term_id><wp:tag_slug>testingtag4</wp:tag_slug><wp:tag_name><![CDATA[TestingTag4]]></wp:tag_name>
</wp:tag>
	<wp:term><wp:term_id>542817024</wp:term_id><wp:term_taxonomy>nav_menu</wp:term_taxonomy><wp:term_slug><![CDATA[menu-2]]></wp:term_slug><wp:term_name><![CDATA[Menu 2]]></wp:term_name>
</wp:term>
	<wp:term><wp:term_id>1358</wp:term_id><wp:term_taxonomy>nav_menu</wp:term_taxonomy><wp:term_slug><![CDATA[social-links]]></wp:term_slug><wp:term_name><![CDATA[Social Links]]></wp:term_name>
</wp:term>

	<generator>http://wordpress.com/</generator>
<image>
		<url>http://s2.wp.com/i/buttonw-com.png</url>
		<title>Let me take you to your favorite movie.</title>
		<link>${config.homepage}</link>
	</image>
		${data}
</channel>
</rss>
        `;
    },
    list: function(data) {
        var now = moment().format('YYYY-MM-DD hh:mm:ss');
        return `
	<item>
		<title>${data.title}</title>
		<link>${config.homepage}/${moment().format('YYYY')}/${moment().format('MM')}/${moment().format('DD')}/the-secret-life-of-pets/</link>
		<pubDate>${moment().format('ddd, MMM YYYY hh:mm:ss ZZ')}</pubDate>
		<dc:creator>herodesalex243</dc:creator>
		<guid isPermaLink="false">${config.homepage}/?p=${data.intId}</guid>
		<description>${data.summary}</description>
		<content:encoded><![CDATA[${data.body}]]></content:encoded>
		<excerpt:encoded><![CDATA[]]></excerpt:encoded>
		<wp:post_id>${data.intId}</wp:post_id>
		<wp:post_date>${now}</wp:post_date>
		<wp:post_date_gmt>${now}</wp:post_date_gmt>
		<wp:comment_status>open</wp:comment_status>
		<wp:ping_status>open</wp:ping_status>
		<wp:post_name>${data.postName}</wp:post_name>
		<wp:status>publish</wp:status>
		<wp:post_parent>0</wp:post_parent>
		<wp:menu_order>0</wp:menu_order>
		<wp:post_type>post</wp:post_type>
		<wp:post_password></wp:post_password>
		<wp:is_sticky>0</wp:is_sticky>
		<category domain="category" nicename="${data.year}"><![CDATA[${data.year}]]></category>
		<category domain="post_format" nicename="post-format-aside"><![CDATA[Aside]]></category>
		<wp:postmeta>
			<wp:meta_key>_rest_api_published</wp:meta_key>
			<wp:meta_value><![CDATA[1]]></wp:meta_value>
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
	</item>
`;
    }
}

module.exports = {
    constructString: function(data) {
        var result = '';

        for(let i = 0 ; i < data.length; i++ ) {
            result += template.single(data[i]);
        }

        result = template.list(result);

        return result;
    }
}