# Realaasti

Property listing web app for **realaasti.com**: buy, sell and rent apartments, houses, villas, plots and commercial spaces across Andhra Pradesh & Telangana.

## Features

- Home page with search (buy/rent, city, type, keyword), featured listings, and browsing by city and type
- Listings page with filters (purpose, city, type, BHK, budget, keyword) and sorting
- Property detail page with overview, amenities, EMI calculator, enquiry form, share and similar properties
- Post a property for free (saved in the browser)
- Shortlist (saved properties) and contact page
- Indian price formatting (₹ lakh / crore), mobile-friendly layout

It is a plain static site (HTML/CSS/JS) with no build step.

## Run locally

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## Configure

Edit `js/data.js`:

- `SITE`: set your real email, phone and WhatsApp number
- `CITIES`, `TYPES`, `AMENITIES`: adjust to your market
- `SAMPLE_LISTINGS`: these are **demo listings**; replace them with real properties

## Deploy to realaasti.com

Any static host works. With **GitHub Pages**:

1. Repo → Settings → Pages → deploy from the `main` branch, root folder.
2. The `CNAME` file already contains `realaasti.com`.
3. At your domain registrar, add DNS records:
   - `A` records for `@` → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - `CNAME` for `www` → `<your-github-username>.github.io`
4. Enable **Enforce HTTPS** once the certificate is issued.

Netlify, Vercel or Cloudflare Pages also work: point them at this repo with no build command.

## Limitations (next steps)

There is no backend yet. Posted listings, saved properties and enquiries are stored only in the visitor's browser (`localStorage`); enquiries offer a "Send via email" fallback. To make listings and enquiries shared across all users, connect a backend (e.g. Firebase, Supabase, or a small API).
