---
featureImage:
featureImageCaption:
layout: 'layouts/feed.html'
metaDesc: News, commentary, and published thinking from Aurus Impact Capital.
pagination:
  data: collections.blog
  size: 10
paginationPrevText: 'Newer'
paginationNextText: 'Older'
paginationAnchor: '#post-list'
permalink: 'insights{% if pagination.pageNumber > 0 %}/page/{{ pagination.pageNumber }}{% endif %}/index.html'
title: 'Insights'
---
