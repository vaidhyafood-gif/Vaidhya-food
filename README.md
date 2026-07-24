# Vaidhya Foods Website — Setup Notes

## Structure
- Static multi-page site (no framework) — deploys directly to Vercel.
- `index.html`, `about.html`, `products.html`, `product-*.html` (6 pages),
  `distributors.html`, `quality.html`, `private-label.html`, `blog.html`, `contact.html`
- `partials/header.html`, `partials/footer.html` — loaded on every page via `assets/js/main.js`
  so nav/footer only need editing in one place.
- `assets/img/` — catalogue photography cropped clean of text/graphics.
- `api/enquiry.js`, `api/private-label-upload.js` — Vercel serverless functions.

## Before going live, three things need your input:

### 1. Email sending (Gmail SMTP)
In Vercel → Project → Settings → Environment Variables, add:
- `GMAIL_USER` = vaidhyafood@gmail.com
- `GMAIL_APP_PASSWORD` = an App Password generated at myaccount.google.com/apppasswords
  (requires 2-Step Verification turned on for the account first)

### 2. Brochure downloads (3 languages)
`assets/js/main.js` has a `BROCHURE_LINKS` object currently pointing all three
languages at the same Drive folder. Send over the direct links to the
Hindi / Odia / English catalogue files and I'll wire them in.

### 3. Instagram auto-sync on the Blog page
True live auto-posting from Instagram needs a connected Meta Business
account + Instagram Graph API access token (Meta app review required).
Until that's set up, the Blog page uses a curated set of catalogue photos
+ written SEO articles, with a manual link out to @vaidhya.foods — this
also happens to be better for SEO than an embed, since Google can actually
index the article text.

### Known platform limit — packaging upload size
Vercel serverless functions cap request bodies around 4.5MB. The upload
form enforces a 5MB file limit client-side, but a file right at that ceiling
may fail server-side once base64-encoded (~37% larger). If large packaging
files become common, the fix is either (a) accepting slightly smaller files,
or (b) upgrading to direct-to-storage upload (e.g. Vercel Blob) — happy to
build that next if needed.

### WhatsApp — current behavior
All enquiry forms open a pre-filled WhatsApp chat (`wa.me`) for the visitor
to hit send, and simultaneously email the team automatically. This needs
zero setup. True silent/automatic WhatsApp delivery (no visitor tap required)
needs the WhatsApp Business Cloud API with a verified Meta Business account —
let us know if you want that upgrade later.

## Deploying
1. `npm install` (installs nodemailer)
2. Push to a GitHub repo, import into Vercel, set the two env vars above.
3. Point vaidhyafood.com's DNS at the Vercel project.
