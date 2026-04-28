# MissDill Website Technical Specification

## 1. Current State
The current project is a static prototype:

- `index.html`: page structure.
- `styles.css`: visual system and responsive layout.
- `content-data.js`: editable data source for products, filters, videos, and mini program handoff placeholders.
- `app.js`: data rendering and local interactions for filters, product details, cart drawer, handoff preview, custom form validation, analytics preview, and video playback.
- `miniprogram/`: native WeChat mini program MVP for website handoff, product detail, cart preview, class reservation, and custom-order lead capture.
- `assets/`: generated concept images, cropped assets, and Lovart-generated video.

This prototype should be treated as a direction and requirements artifact. It is not yet production architecture.

## 2. Recommended Architecture

### MVP Architecture
Use a static/SEO-first website with lightweight dynamic behavior.

Recommended:

- Frontend: Astro or Next.js.
- Styling: CSS modules, Tailwind, or design-token CSS.
- Content source: headless CMS or structured JSON during early MVP.
- Hosting: Vercel, Netlify, Cloudflare Pages, or a China-accessible hosting/CDN path if China mainland performance is required.
- Commerce: mini program handoff.

MVP principle:

- Website owns presentation, SEO, content, product discovery, and lead capture.
- Mini program owns payment, order details, delivery, and after-sales.

### Phase 2 Architecture
Introduce shared backend services when mini program integration requirements are confirmed.

Components:

- Website frontend.
- Mini program frontend.
- Shared CMS/admin.
- Product/catalog API.
- Lead/custom-order API.
- Media storage/CDN.
- Analytics and event tracking.

## 3. Frontend Requirements

### Pages
- `/`: home.
- `/shop`: product list.
- `/shop/[slug]`: product detail, optional in Phase 2.
- `/classes`: class list.
- `/custom`: custom floral order page.
- `/journal`: video/content journal.
- `/about`: studio/about page.

For MVP, these can be sections on a single page if launch speed matters. For SEO and future growth, split pages after content volume grows.

### Components
- Header/navigation.
- Brand hero.
- Product grid.
- Product card.
- Mini program entry.
- Atelier/story section.
- Class booking card.
- Video feature card.
- Video story list.
- Custom order form.
- Cart/selection drawer for pre-checkout preview.
- Footer.

### Responsive Requirements
- Mobile-first layout.
- Product cards stack on mobile.
- Header must not obscure hero text.
- Video section must preserve 9:16 assets without layout shift.
- Buttons must remain at least 40px tall.
- No text overflow in buttons, cards, or form fields.

### Accessibility Requirements
- Semantic headings.
- Descriptive image alt text.
- Keyboard-accessible buttons and form fields.
- Clear focus states.
- Sufficient contrast.
- Video controls available.
- Muted autoplay only if explicitly used and acceptable after testing.

## 4. Content Model

### Product
```ts
type Product = {
  id: string;
  slug: string;
  name: string;
  category: ProductCategory;
  shortDescription: string;
  detailDescription?: string;
  priceCents?: number;
  priceLabel?: string;
  tags: string[];
  images: MediaAsset[];
  availability: "available" | "limited" | "sold_out" | "custom_only";
  deliveryNotes?: string;
  replacementPolicy?: string;
  miniProgramPath?: string;
  sortOrder: number;
  published: boolean;
};
```

### Product Category
```ts
type ProductCategory =
  | "seasonal_bouquet"
  | "birthday_gift"
  | "opening_housewarming"
  | "class"
  | "event_floral"
  | "custom";
```

### Class
```ts
type FloralClass = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  classType: "basic" | "bouquet_packaging" | "chinese_vase" | "enterprise";
  priceCents?: number;
  durationMinutes?: number;
  scheduleMode: "fixed_dates" | "by_appointment";
  sessions: ClassSession[];
  images: MediaAsset[];
  miniProgramPath?: string;
  published: boolean;
};
```

### Class Session
```ts
type ClassSession = {
  id: string;
  startsAt: string;
  endsAt?: string;
  capacity: number;
  seatsTaken: number;
  status: "open" | "full" | "cancelled";
};
```

### Custom Order Lead
```ts
type CustomOrderLead = {
  id: string;
  scene: "birthday" | "opening" | "wedding_event" | "class" | "other";
  budgetRange: string;
  desiredDate?: string;
  deliveryArea?: string;
  contact: string;
  notes?: string;
  referenceImageIds?: string[];
  status: "new" | "contacted" | "quoted" | "converted" | "closed";
  createdAt: string;
};
```

### Journal/Video Post
```ts
type JournalPost = {
  id: string;
  slug: string;
  title: string;
  type: "video" | "image_story" | "article";
  summary: string;
  cover: MediaAsset;
  video?: MediaAsset;
  body?: string;
  sourceChannel?: "xiaohongshu" | "weibo" | "wechat" | "original";
  sourceUrl?: string;
  tags: string[];
  publishedAt: string;
  published: boolean;
};
```

### Media Asset
```ts
type MediaAsset = {
  id: string;
  url: string;
  alt?: string;
  width?: number;
  height?: number;
  mimeType: string;
  focalPoint?: { x: number; y: number };
};
```

## 5. Mini Program Integration

### MVP Handoff
The website should support one or more of these handoff methods:

- Show mini program card/code with clear instruction.
- Open a generic mini program landing path from WeChat browser where supported.
- Open a product-specific mini program path where supported.
- Copy product/order intent into a pre-filled consultation message if deep-linking is not available.

Implementation depends on the mini program provider and account permissions.

### Data To Confirm
- AppID.
- Mini program page paths.
- Whether product detail paths can receive query parameters.
- Whether web-to-mini-program URL scheme is available for this account.
- Whether mini program `web-view` can open the website.
- Backend ownership and API access.
- Current payment provider and refund flow.

### Integration Scenarios

#### Scenario A: Existing mini program is a SaaS store
Use website as a catalog and handoff layer.

Needed:

- Product mapping table: website product ID -> mini program product/page URL.
- Manual or scheduled sync from SaaS export if available.
- No direct order API unless SaaS provides one.

#### Scenario B: Existing mini program is custom-built
Prefer shared backend if the codebase is maintainable.

Needed:

- Product/catalog API.
- Mini program path mapping.
- Optional customer/order read API.
- Admin permissions.

#### Scenario C: Existing mini program is not reusable
Keep mini program for short-term transactions, then migrate to a new shared backend.

Needed:

- New CMS/admin.
- New product model.
- New mini program integration or rebuild plan.

## 6. Backend/API Specification

### Public Read APIs
These can be static at MVP and dynamic later.

```http
GET /api/products
GET /api/products/:slug
GET /api/classes
GET /api/journal
GET /api/site-settings
```

### Lead APIs
```http
POST /api/custom-order-leads
POST /api/class-interest
```

### Admin APIs
Admin APIs should be protected and may be provided by a CMS.

```http
POST /admin/products
PATCH /admin/products/:id
POST /admin/journal
PATCH /admin/journal/:id
POST /admin/media
```

### Custom Order Payload
```json
{
  "scene": "birthday",
  "budgetRange": "¥500 - ¥1000",
  "desiredDate": "2026-05-20",
  "deliveryArea": "福州鼓楼区",
  "contact": "wechat_or_phone",
  "notes": "喜欢浅粉色、自然感"
}
```

## 7. Admin/CMS Requirements

### Roles
- Owner/admin: full editing.
- Staff/editor: products, content, classes, custom-order status.
- Viewer: read-only leads and reports.

### Product Admin
- Create/edit products.
- Upload image/video.
- Set category and tags.
- Set price or price label.
- Set availability.
- Set mini program path.
- Reorder products.

### Content Admin
- Create journal posts.
- Add video cover and video file.
- Add source channel/source URL.
- Publish/unpublish.

### Lead Admin
- View custom-order leads.
- Change status.
- Add internal notes.
- Export CSV.
- Optional later: push to WeCom/WeChat service workflow.

## 8. Media and Video

### Current Prototype Video
- File: `assets/missdill-atelier-video.mp4`
- Source: Lovart generated video.
- Duration: about 7 seconds.
- Aspect ratio: 9:16.
- Resolution: 720x1280.

### Production Video Rules
- Use real MissDill footage where possible.
- Keep generated video only as concept or temporary placeholder unless approved.
- Store original video separately.
- Generate web versions:
  - MP4/H.264 for broad support.
  - Poster image.
  - Optional WebM for modern browsers.
- Keep video short on homepage.
- Lazy-load non-hero videos.

### Video Metadata
- Title.
- Summary.
- Cover image.
- Duration.
- Source channel.
- Tags.
- Publish date.

## 9. SEO and Analytics

### SEO
- Unique title and description per page.
- Local keywords:
  - 福州花艺
  - 福州花店
  - 福州花艺工作室
  - 福州花艺沙龙
  - 福州定制花束
- Open Graph image.
- Structured data for local business where appropriate.
- Image alt text.

### Analytics Events
- Product card viewed/clicked.
- Mini program handoff clicked.
- Custom order form submitted.
- Class booking clicked.
- Video play clicked.
- Social link clicked.

Example:

```ts
type AnalyticsEvent =
  | { name: "product_cta_click"; productId: string; category: string }
  | { name: "mini_program_handoff"; targetPath?: string }
  | { name: "custom_order_submit"; scene: string; budgetRange: string }
  | { name: "video_play"; postId: string };
```

## 10. Security and Privacy

### Form Data
Contact fields may include phone numbers or WeChat IDs. Treat them as sensitive personal data.

Requirements:

- HTTPS only.
- Server-side validation.
- Spam protection.
- Access-controlled admin.
- Minimal retention policy.
- No public exposure of submitted lead data.

### File Uploads
If reference-image upload is added:

- Validate file size and MIME type.
- Store outside public listing.
- Generate safe thumbnails.
- Scan or moderate uploads if exposed to staff workflows.

### Payment
For MVP, do not process payment on the website. Use mini program/WeChat transaction flow.

If website payment is later added:

- Use official payment flow.
- Keep payment credentials server-side only.
- Do not store card/payment credentials.
- Add refund and order reconciliation plan.

## 11. Performance Requirements
- First meaningful page should load quickly on mobile.
- Compress all images.
- Use responsive image sizes.
- Lazy-load below-fold images and videos.
- Avoid heavy JavaScript for a mostly editorial site.
- Cache static assets with versioning.

## 12. QA Checklist

### Functional QA
- Navigation anchors.
- Product filters.
- Mini program entry.
- Mini program cart handoff path and payload preview.
- Cart/selection drawer.
- Mini program order confirmation page.
- Backend contract for product, custom lead, order, and payment prepay APIs.
- Video play/pause.
- Custom form validation.
- Social links.

### Responsive QA
- iPhone width.
- Android narrow width.
- Tablet.
- Desktop.

### Visual Safety QA
- No radial sunburst/flag-like motifs.
- No military or nationalist visual references.
- No political or religious symbols.
- No generated text artifacts.
- No misleading mini program/payment claims.

### Content QA
- Product prices correct.
- Delivery notes accurate.
- Social links correct.
- Contact details correct.
- Mini program path verified.

## 13. Official References To Verify
Implementation should verify these official docs at build time because platform rules can change:

- WeChat mini program `web-view` component:
  - https://developers.weixin.qq.com/miniprogram/dev/component/web-view.html
- WeChat mini program subscribe messages:
  - https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/subscribe-message.html
- WeChat Cloud Development:
  - https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/getting-started.html
- WeChat Pay API v3:
  - https://pay.weixin.qq.com/doc/v3/merchant/4012791855

## 14. Implementation Backlog

### Immediate
- Replace generated placeholder photos with MissDill real assets.
- Confirm mini program integration details.
- Convert static product cards into structured data.
- Add production-safe form destination.
- Add visual safety review to design workflow.

### Next
- Choose production framework.
- Choose CMS/admin.
- Build product list and content pages.
- Add analytics.
- Add optimized video handling.

### Later
- Shared product/order backend.
- Member profile and important-date reminders.
- Gift cards.
- Enterprise account workflows.
- Service account/mini program message automation.
