const rssPlugin = require("@11ty/eleventy-plugin-rss");
const markdownIt = require("markdown-it");

// Filters
const dateFilter = require("./src/filters/date-filter.js");
const md = markdownIt({ html: true });

module.exports = function(eleventyConfig) {
// Filters
eleventyConfig.addFilter("dateFilter", dateFilter);
eleventyConfig.addFilter("markdown", (content) => {
if (!content) {
return "";
}

return md.render(content);
});

// BLOG FILTERS
eleventyConfig.addFilter("filterBlogByCategory", (posts, category) => {
return posts.filter(post =>
post.data.postCategories && post.data.postCategories.includes(category)
);
});

// ADD BLOG TAG FILTER
eleventyConfig.addFilter("filterBlogByTag", (posts, tag) => {
return posts.filter(post =>
post.data.postTags && post.data.postTags.includes(tag)
);
});

eleventyConfig.addFilter("filterFaqsByCategory", (faqs, category) => {
if (!Array.isArray(faqs)) {
return [];
}

return faqs.filter(faq => {
const faqCategories = faq?.data?.categories;

if (Array.isArray(faqCategories)) {
return faqCategories.includes(category);
}

if (typeof faqCategories === "string") {
return faqCategories === category;
}

return false;
});
});

// Plugins
eleventyConfig.addPlugin(rssPlugin);

// Passthrough copy
eleventyConfig.addPassthroughCopy("src/admin");
eleventyConfig.addPassthroughCopy("src/css");
eleventyConfig.addPassthroughCopy("src/js");
eleventyConfig.addPassthroughCopy("src/images");

// COLLECTIONS

eleventyConfig.addCollection("blog", (collection) => {
return [...collection.getFilteredByGlob("./src/posts/*.md")].reverse();
});

eleventyConfig.addCollection("faqs", (collection) => {
return [...collection.getFilteredByGlob("./src/faqs/*.md")];
});

// BLOG TAXONOMY COLLECTIONS
eleventyConfig.addCollection("postCategories", (collection) => {
let categories = new Set();
collection.getFilteredByGlob("./src/posts/*.md").forEach(post => {
if (post.data.postCategories) {
post.data.postCategories.forEach(cat => categories.add(cat));
}
});
return Array.from(categories).sort();
});

eleventyConfig.addCollection("postTags", (collection) => {
let tags = new Set();
collection.getFilteredByGlob("./src/posts/*.md").forEach(post => {
if (post.data.postTags) {
post.data.postTags.forEach(tag => tags.add(tag));
}
});
return Array.from(tags).sort();
});

// GENERATE BLOG CATEGORY PAGES
eleventyConfig.addCollection("blogCategoryPages", function(collectionApi) {
const categories = new Set();
const posts = collectionApi.getFilteredByGlob("./src/posts/*.md");

posts.forEach(post => {
if (post.data.postCategories) {
post.data.postCategories.forEach(cat => categories.add(cat));
}
});

return Array.from(categories).map(category => {
return {
title: `${category}`,
category: category,
permalink: `/insights/category/${category.toLowerCase().replace(/\s+/g, '-')}/`,
layout: "layouts/base.html"
};
});
});

// ADD BLOG TAG PAGES COLLECTION
eleventyConfig.addCollection("blogTagPages", function(collectionApi) {
const tags = new Set();
const posts = collectionApi.getFilteredByGlob("./src/posts/*.md");

posts.forEach(post => {
if (post.data.postTags) {
post.data.postTags.forEach(tag => tags.add(tag));
}
});

return Array.from(tags).map(tag => {
return {
title: `${tag}`,
tag: tag,
permalink: `/insights/tag/${tag.toLowerCase().replace(/\s+/g, '-')}/`,
layout: "layouts/base.html"
};
});
});

// Use .eleventyignore, not .gitignore
eleventyConfig.setUseGitIgnore(false);

// Directory structure
return {
markdownTemplateEngine: "njk",
dataTemplateEngine: "njk",
htmlTemplateEngine: "njk",
dir: {
input: "src",
output: "dist"
}
};
};
