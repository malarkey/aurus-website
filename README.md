# Eleventy + Netlify CMS Boilerplate

A reusable Eleventy starter for brochure sites, insights publishing, and small editorial projects.

## Included

- Eleventy v3
- Netlify CMS admin at `/admin/`
- Insights posts with category and tag archive pages
- RSS feed generation
- Neutral starter content and placeholder assets

## Install

```bash
npm install
```

## Develop

```bash
npm run start
```

The development server runs at [http://localhost:8080](http://localhost:8080).

## Build

```bash
npm run build
```

Static files are written to `dist/`.

## Content Model

- `src/index.md`: homepage
- `src/about.md`: about page
- `src/blog.md`: paginated insights index
- `src/contact.md`: contact page
- `src/investors.md`: investors page
- `src/governance.md`: governance page
- `src/partners.md`: partnerships page
- `src/posts/*.md`: insights posts
- `src/_data/site.json`: site-wide metadata
- `src/_data/navigation.json`: main navigation
- `src/_data/footer_navigation.json`: footer navigation

## Netlify CMS

The CMS is configured for Git Gateway on the `main` branch. Before launching a real site:

1. Update `src/_data/site.json` with your production URL and contact details.
2. Replace the sample posts and legal copy.
3. Enable Netlify Identity and Git Gateway in your Netlify project.
