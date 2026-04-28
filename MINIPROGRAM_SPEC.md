# MissDill Mini Program MVP

## Goal
This mini program is designed as the transaction and service surface that the MissDill website can hand off to.

The website remains the brand/content/shopfront layer. The mini program handles:

- Product detail entry.
- Flower gift selection.
- Shopping bag.
- Custom order lead capture.
- Class reservation preview.
- Future payment/order integration.

## Project Root
Open this folder in WeChat DevTools:

```text
miniprogram/
```

Current `project.config.json` uses `touristappid`. Replace it with the real MissDill AppID before preview/upload.

## Implemented Pages

| Purpose | Page Path | Website Handoff Example |
| --- | --- | --- |
| Home | `pages/home/home` | main mini program landing |
| Shop | `pages/shop/shop` | category/product browsing |
| Product detail | `pages/product/detail` | `/pages/product/detail?id=spring-pink-bouquet` |
| Class detail | `pages/class/detail` | `/pages/class/detail?id=basic-floral-class` |
| Custom order | `pages/custom/event` | `/pages/custom/event?id=event-floral-installation` |
| Cart | `pages/cart/cart` | `/pages/cart/cart?items=spring-pink-bouquet%3A1&source=website` |
| Order confirm | `pages/order/confirm` | internal checkout step from cart |
| About | `pages/about/about` | studio info |

## Data Source
Local MVP catalog:

```text
miniprogram/utils/catalog.js
```

This mirrors the website's `content-data.js` product IDs so the website can pass `id` query parameters into the mini program.

Future backend options:

- Keep catalog in a CMS and export both website JSON and mini program data.
- Add an API endpoint and replace local catalog reads with `wx.request`.
- Use WeChat Cloud Development if the existing mini program already uses it.

## Payment Status
Payment is intentionally not wired yet.

Current cart page creates an order preview only:

```text
miniprogram/utils/api.js
```

To enable real payment later:

1. Create order on server.
2. Server returns official payment parameters.
3. Mini program calls `wx.requestPayment`.
4. Server receives payment notification and updates order status.

Do not place merchant keys or payment signing logic in the mini program client.

## Website Integration
The website should map product CTA to these paths:

```js
/pages/product/detail?id=spring-pink-bouquet
/pages/product/detail?id=fresh-green-basket
/pages/product/detail?id=dyed-lily-bouquet
/pages/product/detail?id=morandi-pink-bouquet
/pages/class/detail?id=basic-floral-class
/pages/custom/event?id=event-floral-installation
```

For cart checkout handoff, the website now generates a compact cart query:

```text
/pages/cart/cart?items=product-id:quantity,product-id:quantity&source=website
```

Example:

```text
/pages/cart/cart?items=spring-pink-bouquet%3A1&source=website
```

The mini program parser lives in:

```text
miniprogram/utils/handoff.js
```

The cart page imports that parser and replaces the local MVP cart when an `items` query is present.

The cart then routes to:

```text
/pages/order/confirm
```

This confirmation page collects fulfillment mode, date, time slot, delivery/self-pickup note, contact, card message, and order notes. It currently creates a local order preview only.

The real integration still needs:

- MissDill mini program AppID.
- Confirmed URL scheme / URL Link / WeChat browser handoff strategy.
- Product page query support in the production mini program.
- Backend or CMS source of truth.

Backend endpoint details are documented in:

```text
miniprogram/BACKEND_CONTRACT.md
```

## Visual Safety Rule
Do not use radial rays, sunburst, flag-like graphics, military/nationalist motifs, or other symbols that could be politically or historically misread.

The current mini program uses solid moss green, warm ivory, floral imagery, and simple cards only.

## Official Docs To Verify Before Production
- Mini program configuration:
  - https://developers.weixin.qq.com/miniprogram/dev/reference/configuration/app.html
- Page API:
  - https://developers.weixin.qq.com/miniprogram/dev/reference/api/Page.html
- Network request:
  - https://developers.weixin.qq.com/miniprogram/dev/api/network/request/wx.request.html
- Payment:
  - https://developers.weixin.qq.com/miniprogram/dev/api/payment/wx.requestPayment.html
