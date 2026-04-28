# MissDill Mini Program Backend Contract

This document defines the backend boundary for the mini program MVP.

## Current MVP Status

- Product catalog is local in `utils/catalog.js`.
- Cart is stored in `wx.setStorageSync("missdill_cart")`.
- Custom leads are stored in `wx.setStorageSync("missdill_leads")`.
- Order previews are stored in `wx.setStorageSync("missdill_order_previews")`.
- No real payment is triggered.

## Recommended API Surface

### Product Catalog

```http
GET /api/products
```

Response:

```json
{
  "products": [
    {
      "id": "spring-pink-bouquet",
      "name": "春日浅粉花束",
      "price": 398,
      "priceLabel": "¥398",
      "type": "product",
      "status": "available",
      "deliveryNotes": "建议提前 1 天预约"
    }
  ]
}
```

### Custom Lead

```http
POST /api/custom-leads
```

Request:

```json
{
  "scene": "婚礼 / 活动",
  "budget": "¥1000 - ¥3000",
  "intentId": "event-floral-installation",
  "intentName": "活动花艺布置",
  "date": "2026-05-20",
  "contact": "wechat-or-phone",
  "notes": "喜欢白绿色"
}
```

### Order Draft

```http
POST /api/orders
```

Request:

```json
{
  "source": "mini_program",
  "items": [
    {
      "id": "spring-pink-bouquet",
      "name": "春日浅粉花束",
      "quantity": 1,
      "price": 398,
      "type": "product"
    }
  ],
  "total": 398,
  "fulfillment": "同城配送",
  "timeSlot": "下午 14:00-17:00",
  "deliveryDate": "2026-05-20",
  "deliveryArea": "鼓楼区",
  "recipientName": "王女士",
  "contact": "wechat-or-phone",
  "cardMessage": "生日快乐",
  "notes": "偏粉色"
}
```

Response:

```json
{
  "orderId": "order_20260520_001",
  "status": "pending_payment",
  "payableAmount": 398
}
```

### WeChat Pay Prepay

```http
POST /api/payments/wechat/prepay
```

Request:

```json
{
  "orderId": "order_20260520_001"
}
```

Response:

```json
{
  "timeStamp": "1714280000",
  "nonceStr": "server-generated",
  "package": "prepay_id=wx...",
  "signType": "RSA",
  "paySign": "server-generated"
}
```

The mini program client should only call `wx.requestPayment` with server-generated payment parameters. Merchant keys and signing logic must stay on the server.

## Website Handoff

Website checkout should enter:

```text
/pages/cart/cart?items=spring-pink-bouquet%3A1&source=website
```

The cart parser is:

```text
utils/handoff.js
```

Supported item format:

```text
product-id:quantity,product-id:quantity
```

Unknown product IDs are ignored. Quantity is clamped to `1..99`.
