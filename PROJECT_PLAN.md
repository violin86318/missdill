# MissDill Website Project Plan

## 1. Project Goal
Build a production-ready website for MissDill, a Fuzhou floral design studio, that works as:

- A refined brand and portfolio site.
- A content hub for flower materials, studio daily life, classes, and videos.
- A shopfront for seasonal bouquets and custom floral services.
- A traffic bridge to the existing WeChat mini program for transaction, delivery, and after-sales.

The first production release should avoid building a full independent ecommerce system unless the existing mini program backend cannot support the required purchase flow.

## 2. Product Positioning
MissDill should feel like a content-led floral atelier, not a generic flower shop.

Core positioning:

- Handmade and seasonal.
- Quiet, warm, natural, and design-aware.
- Rooted in Fuzhou studio life.
- Strong in flower material education, making process, classes, and visual storytelling.
- Commerce is present but should not overpower the atelier feeling.

## 3. Target Users
- Individual gift buyers: birthday, anniversary, apology, celebration, housewarming.
- Customers looking for custom bouquets or premium floral gifts.
- Local Fuzhou customers interested in flower classes and salon events.
- Small brands, cafes, offices, and event planners needing floral styling.
- Returning customers who remember dates and prefer repeat ordering.

## 4. Launch Scope

### MVP Launch
The MVP should focus on brand trust, content, and low-risk transaction handoff.

Pages/modules:

- Home page.
- Seasonal flower gift section.
- Product/detail preview for bouquets and classes.
- Custom floral order form.
- Floral classes section.
- Video content section.
- Atelier/about section.
- Mini program transaction entry.
- Contact and social channel links.

Commerce behavior:

- Website displays products, prices, tags, and service descriptions.
- Purchase/checkout CTA opens or guides users to the MissDill mini program.
- Custom-order form captures scenario, budget, date, contact, and optional notes.
- Admin can update product/content data manually in the short term.

### Phase 2 Scope
Add shared data and richer backend operations once the existing mini program architecture is clear.

- Shared product catalog.
- Shared inventory and service availability.
- Course schedule and seat management.
- Custom-order lead management.
- Content CMS for videos, cases, and flower material notes.
- Product-specific mini program deep links.

### Phase 3 Scope
Add customer operations and retention.

- Customer profiles.
- Important-date reminders.
- Gift cards.
- Enterprise customer records.
- After-sales tracking.
- WeChat service account or mini program subscription message flows.
- Repeat purchase campaigns.

## 5. Information Architecture

### Home
Purpose: create immediate brand confidence and guide visitors toward flower gifts, classes, or custom orders.

Sections:

- Brand hero with studio atmosphere.
- Seasonal bouquets.
- Mini program purchase entry.
- Studio/atelier story.
- Floral salon/classes.
- Video journal.
- Ecommerce/backend trust notes or service explanation.
- Custom order form.
- Footer with social links.

### Shop
Purpose: help visitors compare and select products quickly.

Content:

- Seasonal bouquets.
- Birthday/anniversary gifts.
- Opening/housewarming floral baskets.
- Classes and workshops.
- Event floral styling.

Product fields:

- Name.
- Category.
- Price or price range.
- Short description.
- Main image.
- Tags.
- Delivery/pickup notes.
- Replacement flower material policy.
- Mini program target path.
- Availability status.

### Custom Orders
Purpose: capture high-value leads without forcing a rigid checkout flow.

Fields:

- Occasion.
- Budget.
- Date.
- Recipient city/delivery area.
- Contact method.
- Style preference.
- Notes.
- Optional reference image in a later phase.

### Classes
Purpose: convert social content interest into offline bookings.

Content:

- Class types.
- Schedule.
- Seat count.
- Teacher/studio note.
- What students make.
- Price.
- Booking CTA.

### Video Journal
Purpose: make MissDill's social content reusable on the website.

Content series:

- Flower material unboxing.
- Dyed/absorbed-color flower material notes.
- Bouquet making process.
- Chinese-style vase arrangement.
- Green courtyard/studio daily life.
- Floral class recap.
- Event floral installation.

### Atelier/About
Purpose: explain studio character and create trust.

Content:

- Studio story.
- Location: Fuzhou.
- Aesthetic principles.
- Service boundaries.
- Social channels.
- Service account and mini program entry.

## 6. Content Production Plan

### Existing Content To Reuse
- Social posts from Xiaohongshu and Weibo.
- WeChat service account identity.
- Mini program product/category data if available.
- Existing product photos and class/event images.

### New Content Needed
- 8-12 real product photos for MVP.
- 3-5 studio atmosphere photos.
- 3-5 class/event photos.
- 4 short videos:
  - Homepage atmosphere video.
  - Bouquet making.
  - Flower material unboxing.
  - Class/event recap.
- Product copy for 8-15 SKUs.
- Custom order policy.
- Delivery and pickup notes.
- Flower material replacement policy.

## 7. Design Direction

### Visual System
- Deep moss green as brand anchor.
- Warm ivory background.
- Charcoal text.
- Muted rose and natural stem green accents.
- Editorial floral photography.
- Calm, high-whitespace layouts.
- Small-radius cards only for repeated products and form surfaces.

### Design Rules
- Use real product/studio imagery whenever possible.
- Avoid decorative patterns that can be culturally or politically misread.
- Avoid radial rays, sunburst motifs, military/flag-like compositions, religious iconography, or nationalist visual references.
- Keep ecommerce UI quiet and boutique, not marketplace-like.
- On mobile, prioritize product cards, CTAs, and readable form fields.

### Mandatory Visual Safety Review
Before any external mockup or launch candidate is shared:

- Check for political, military, nationalist, religious, and historical-symbol resemblance.
- Check for accidental resemblance to flags, insignia, uniforms, propaganda posters, or controversial iconography.
- Check generated image details for malformed text, logos, watermarks, or inappropriate background cues.
- Ask at least one Chinese-language reviewer to scan visual symbols before delivery.

## 8. Ecommerce Strategy

### Recommended MVP Flow
Website as shopfront, mini program as transaction endpoint.

Why:

- Lower implementation risk.
- Keeps WeChat Pay, delivery, and after-sales in a familiar WeChat environment.
- Lets the website launch sooner.
- Avoids duplicate order systems until the existing mini program backend is understood.

Flow:

1. Visitor browses website product.
2. Visitor clicks buy/reserve.
3. Website shows mini program entry or opens product-specific mini program path where available.
4. Mini program handles login, payment, delivery details, order status, and support.

### Future Shared Commerce Flow
Website and mini program read from the same product/order backend.

Needed:

- Product API.
- Category API.
- Availability API.
- Order/lead API.
- Mini program path mapping.
- Admin CMS.

## 9. Backend and Admin Plan

### MVP Admin
Low-complexity options:

- Static JSON/product file if updates are rare.
- Headless CMS if Dill needs direct editing.
- Existing mini program admin if it can export or expose product data.

### Production Admin
Admin modules:

- Products.
- Categories.
- Inventory/availability.
- Custom order leads.
- Classes and schedules.
- Content posts.
- Videos.
- Media library.
- Delivery notes and service policy.

### Recommended Data Ownership
Use the mini program backend as the source of truth only if:

- MissDill owns the account and source/backend access.
- Product and order data can be accessed safely.
- The backend can support website reads or exports.
- Deep links into product/detail pages are supported.

Otherwise, introduce a shared backend and gradually migrate both website and mini program to it.

## 10. Milestones

### Week 1: Discovery and Content
- Confirm mini program ownership and backend architecture.
- Inventory social content and product categories.
- Collect real photos/videos.
- Confirm brand colors, logo files, and contact details.
- Confirm visual safety guidelines.

Deliverables:

- Content inventory.
- Product/category list.
- Mini program integration notes.
- Final sitemap.

### Week 2: Design and Prototype Upgrade
- Replace generated placeholder assets with real MissDill assets.
- Design high-fidelity mobile and desktop pages.
- Refine product cards, video module, and custom order form.
- Confirm copy tone.

Deliverables:

- High-fidelity website screens.
- Visual safety review.
- Revised prototype.

### Week 3: Frontend Build
- Move from static prototype to production frontend stack.
- Build reusable page sections.
- Add responsive behavior.
- Add SEO metadata and structured content.
- Add optimized image/video handling.

Deliverables:

- Production frontend preview.
- Desktop/mobile QA screenshots.
- Core interaction QA.

### Week 4: Backend/CMS and Mini Program Integration
- Implement product/content source.
- Add admin editing flow.
- Add mini program handoff.
- Add custom order submission destination.
- Add analytics events.

Deliverables:

- CMS/admin working flow.
- Product data connected.
- Mini program CTA verified.
- Lead form tested.

### Week 5: QA and Launch
- Replace remaining placeholder copy/assets.
- Check performance and SEO.
- Check mobile usability.
- Check visual safety.
- Check analytics and form delivery.
- Prepare launch and rollback plan.

Deliverables:

- Launch candidate.
- QA checklist.
- Deployment notes.
- Post-launch backlog.

## 11. Success Metrics

Brand/content:

- Visitors reach product or custom-order section.
- Video section engagement.
- Social link clicks.

Commerce:

- Mini program handoff clicks.
- Product CTA clicks.
- Custom order submissions.
- Class booking interest.

Operations:

- Time needed to update product/content.
- Number of manual order handoff issues.
- Repeat customer capture rate in later phases.

## 12. Open Questions
- What platform powers the existing MissDill mini program?
- Does MissDill own the mini program source code and backend account?
- Is there a product-specific mini program path for direct handoff?
- Does the current mini program already support WeChat Pay, delivery, refunds, and order status?
- What are the actual delivery areas, pickup rules, and order lead times?
- How many SKUs should be live at launch?
- Who will maintain product photos, videos, and copy after launch?
