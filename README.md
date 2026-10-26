# Ember & Cream — Coffee Shop Website

A responsive, static boutique café site built with semantic HTML, CSS, and vanilla JavaScript. No build step required.

## Run locally

From this folder:

```bash
python3 -m http.server 8080
```

Open [http://localhost:8080](http://localhost:8080) in your browser.

Alternatively, open `index.html` directly in a browser (some features like the embedded map work best over HTTP).

## Project structure

```
coffee-shop/
├── index.html          # All sections: hero, about, menu, hours, contact, footer
├── css/styles.css      # Design system, layout, responsive breakpoints
├── js/main.js          # Mobile nav, scroll reveal, menu tabs
├── assets/images/      # Optimized WebP photos (Unsplash)
└── README.md
```

## Customize

- **Brand name:** Search/replace `Ember & Cream` in `index.html`.
- **Contact placeholders:** Update address, phone, email, and social URLs in the Contact section and footer (marked with “Placeholder” tags).
- **Menu:** Edit prices and copy in `index.html` under each `.menu-category`.
- **Hours:** Adjust rows in the `#hours` section.
- **Colors:** CSS variables at the top of `css/styles.css` (`--espresso`, `--cream`, `--caramel`, etc.).

## Deployment

Upload the entire `coffee-shop` folder to any static host (Netlify, Vercel, GitHub Pages, Cloudflare Pages). Set the site root to this directory.

## Accessibility & performance

- Semantic landmarks, skip-friendly heading hierarchy, focus styles
- Lazy-loaded images below the fold; hero image uses `fetchpriority="high"`
- Smooth scroll and reduced-motion-friendly CSS transitions
