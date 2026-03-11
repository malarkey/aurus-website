---
layout: layouts/page.html
permalink: /faqs/
title: Frequently asked questions
metaDesc: Answers to common questions about Aurus Impact Capital.
showSubnav: true
---

{% set investorFaqs = collections.faqs | filterFaqsByCategory("investor") %}
{% set aboutFaqs = collections.faqs | filterFaqsByCategory("about") %}
{% set generalFaqs = collections.faqs | filterFaqsByCategory("general") %}

{% if investorFaqs.length %}
<hr data-function="spacer">

<h2>Investor FAQs</h2>

{% for faqItem in investorFaqs %}
<details>
<summary>{{ faqItem.data.question }}</summary>
<p>{{ faqItem.data.answer }}</p>
</details>
{% endfor %}
{% else %}
<p>No investor FAQs are published yet.</p>
{% endif %}

{% if aboutFaqs.length %}
<hr data-function="spacer">

<h2>About FAQs</h2>

{% for faqItem in aboutFaqs %}
<details>
<summary>{{ faqItem.data.question }}</summary>
<p>{{ faqItem.data.answer }}</p>
</details>
{% endfor %}
{% else %}
<p>No about FAQs are published yet.</p>
{% endif %}



{% if generalFaqs.length %}
<hr data-function="spacer">

<h2>General FAQs</h2>

{% for faqItem in generalFaqs %}
<details>
<summary>{{ faqItem.data.question }}</summary>
<p>{{ faqItem.data.answer }}</p>
</details>
{% endfor %}
{% else %}
<p>No general FAQs are published yet.</p>
{% endif %}
