# Fruit & Veg — Website Build Plan

A multi-page marketing site for an agricultural company. Brand: bold text-based "Fruit&Veg" logo, green + orange palette, fresh/clean editorial farm aesthetic inspired by top-tier Lovable templates (think modern produce brands — generous whitespace, warm earthy accents, crisp photography).

## Design System (built first, used everywhere)
- Palette: deep farm green (primary), vibrant orange (accent), cream/off-white background, charcoal text
- Typography: bold display sans for headings (logo + hero), clean humanist sans for body
- Components: rounded cards, soft shadows, organic motion on scroll, badge/pill tags for product categories
- Text-based logo: `Fruit&Veg` in heavy weight, green "Fruit" + orange "&Veg" (or similar bold treatment)

## Phased Delivery
We'll ship one phase per turn so you can review before we move on.

### Phase 1 — Foundation + Home
- Design tokens in `src/styles.css` (green/orange palette, fonts, radii, shadows)
- Shared `Header` (logo + nav) and `Footer` (address, email, quick links)
- Home page (`/`): hero with tagline, value props, featured products, services teaser, CTA to contact
- SEO meta, sitemap.xml, robots.txt

### Phase 2 — About
- `/about` route: story, vision, mission, core values (6 cards), brand positioning
- Hero image of farm

### Phase 3 — Services
- `/services` route: 5 service categories (Supply, Partnership, Investment, Storage, Agro-processing) with sub-bullets and icons

### Phase 4 — Products
- `/products` route: current farm produce (Okro, Pepper, Tomato, Maize) highlighted, plus fresh produce, processed, and branded sections
- Product cards with generated imagery

### Phase 5 — Membership + Why Choose Us
- `/membership` route: benefits, target customers, "Why Choose Us"
- Registration CTA (static for now, wires to email/contact later)

### Phase 6 — Contact
- `/contact` route: head office (Lagos), farm address (Araromi-Owu, Ikire Apomu, Osun), email `fruitvegfarm@gmail.com`, supply-request form (mailto for now; backend later when phone is provided)

### Phase 7 (later, on request)
- Lovable Cloud backend: membership signup, supply request form submissions, admin inbox
- Add phone number when provided
- Optional: blog/news, investor portal

## Technical Notes
- TanStack Start file-based routing, one file per page under `src/routes/`
- Each route has its own `head()` meta for SEO
- Images generated via imagegen (farm, produce shots) — saved to `src/assets/`
- All colors via semantic tokens — no hardcoded hex in components

---

Ready to start with **Phase 1 (Foundation + Home)** on your approval.