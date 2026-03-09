---
layout: layouts/page.html
permalink: /faqs/
title: Frequently asked questions
metaDesc: Answers to common questions about Aurus Impact Capital.
---

{% set generalFaqs = collections.faqs | filterFaqsByCategory("general") %}

{% if generalFaqs.length %}
{% for faqItem in generalFaqs %}
<details>
<summary>{{ faqItem.data.question }}</summary>
<p>{{ faqItem.data.answer }}</p>
</details>
{% endfor %}
{% else %}
<p>No general FAQs are published yet.</p>
{% endif %}
