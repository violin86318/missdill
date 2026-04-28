# Notes: MissDill Website Planning

## Current Prototype
- Static files:
  - `index.html`
  - `styles.css`
  - `app.js`
  - `assets/`
- Implemented prototype modules:
  - Immersive brand hero.
  - Data-driven seasonal bouquet/product grid.
  - Product detail modal.
  - Mini program transaction entry.
  - Mini program handoff preview state.
  - Atelier/story section.
  - Floral class section.
  - Video content module with Lovart-generated 7s vertical video.
  - Ecommerce/backend recommendation section.
  - Custom order form with local validation.
  - Local cart drawer interaction.
  - Local analytics preview in `window.missDillAnalytics`.
- Native mini program MVP under `miniprogram/`:
  - Home, shop, product detail, class detail, custom order, cart, and about pages.
  - Order confirmation page added for fulfillment mode, date, time slot, contact, card message, and notes.
  - Local catalog data mirrors website product IDs.
  - Cart and custom leads use local storage for MVP preview.
  - Order previews use local storage for MVP preview.
  - Website checkout now generates a compact cart handoff path such as `/pages/cart/cart?items=spring-pink-bouquet%3A1&source=website`.
  - Mini program cart can parse the handoff query through `miniprogram/utils/handoff.js`.
  - Backend contract lives in `miniprogram/BACKEND_CONTRACT.md`.
  - Payment remains a backend placeholder; no fake payment flow is implemented.

## Public Content Signals
- Account identity:
  - Brand: MissDill / MissDill 花艺设计工作室.
  - Location signal: Fuzhou / 福建.
  - Social channels: Weibo, Xiaohongshu, WeChat service account, WeChat mini program.
- Content directions inferred from public social profile/search snippets and provided screenshot:
  - Seasonal bouquets.
  - Dyed/absorbed-color flower materials.
  - Chinese-style floral arrangements.
  - Flower material unboxing and making process.
  - Floral salon/classes.
  - Green courtyard/studio daily life.
  - Flower gift ranking/top products.
  - Vlog/video-oriented content.

## Product Strategy
- The site should not start as a full independent ecommerce platform if the mini program already exists.
- MVP should use the website for:
  - Brand trust.
  - SEO.
  - Portfolio and video content.
  - Product discovery.
  - Custom-order leads.
  - Mini program traffic handoff.
- A shared backend can come later if the mini program data and order flow can be accessed or migrated.

## Backend Assumptions
- Existing mini program may already have product/order/payment capabilities.
- Unknowns to confirm:
  - Who built the mini program.
  - Whether MissDill owns the source code and backend account.
  - Whether product/order APIs exist.
  - Whether payment is native WeChat Pay, a SaaS store, or custom backend.
  - Whether mini program can open web pages through `web-view`.
  - Whether website can deep-link into a specific mini program product path.

## Safety and Brand Risk
- A QR-style radial graphic created in the prototype was flagged as visually similar to Japanese militarist/rising sun imagery.
- Resolution:
  - Removed all radial/conic/repeating-conic patterns from the mini program entry.
  - Replaced with neutral solid brand block.
- Mandatory future rule:
  - Avoid radial sunburst, flags, nationalist/military visual references, religious iconography, and politically charged symbols.
  - Add a visual review checklist before sharing any mockup externally.

## Official Documentation To Verify During Implementation
- WeChat mini program web-view component:
  - https://developers.weixin.qq.com/miniprogram/dev/component/web-view.html
- WeChat mini program subscribe messages:
  - https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/subscribe-message.html
- WeChat Cloud Development:
  - https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/getting-started.html
- WeChat Pay API v3 documentation:
  - https://pay.weixin.qq.com/doc/v3/merchant/4012791855

## Recommended Production Stack
- Frontend:
  - Next.js or Astro for static/SEO-first pages.
  - React components if product filtering/cart-like interactions remain.
- CMS/backend:
  - Headless CMS for content, products, classes, and cases.
  - Options: Strapi, Sanity, Directus, Payload, or a lightweight custom admin.
- Data:
  - PostgreSQL/Supabase if custom backend is needed.
  - Mini-program-native cloud database if existing mini program is already on WeChat Cloud.
- Media:
  - Use optimized image/video hosting/CDN.
  - Store original vertical videos separately from web-transcoded assets.
- Commerce:
  - Phase 1: handoff to mini program.
  - Phase 2: shared product/order API.
  - Phase 3: member/CRM/marketing automation.
