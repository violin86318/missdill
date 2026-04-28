# Feishu Bitable Content Setup

MissDill website content can be managed from Feishu Bitable through the Cloudflare Worker endpoint:

```text
https://missdill.beyondmotion.net/api/content
```

The browser never receives Feishu credentials. The Worker reads Feishu with environment variables and returns normalized public website content.

## Feishu App Requirements

Create a Feishu/Lark self-built app and grant Bitable read permissions. Then add the app as a collaborator on the Bitable document.

Required Worker secrets:

```text
FEISHU_APP_ID
FEISHU_APP_SECRET
FEISHU_APP_TOKEN
FEISHU_TABLE_PRODUCTS
```

Optional table secrets:

```text
FEISHU_TABLE_FILTERS
FEISHU_TABLE_VIDEO_STORIES
FEISHU_TABLE_SETTINGS
```

Deploy after setting secrets:

```bash
npx wrangler secret put FEISHU_APP_ID
npx wrangler secret put FEISHU_APP_SECRET
npx wrangler secret put FEISHU_APP_TOKEN
npx wrangler secret put FEISHU_TABLE_PRODUCTS
npx wrangler secret put FEISHU_TABLE_FILTERS
npx wrangler secret put FEISHU_TABLE_VIDEO_STORIES
npx wrangler secret put FEISHU_TABLE_SETTINGS
npx wrangler deploy --domain missdill.beyondmotion.net
```

## Products Table

Required columns:

| Column | Meaning | Example |
| --- | --- | --- |
| `ID` | Stable product slug | `spring-pink-bouquet` |
| `名称` | Product/card title | `春日浅粉花束` |

Recommended columns:

| Column | Meaning | Example |
| --- | --- | --- |
| `类型` | `product`, `class`, or `custom` | `product` |
| `分类` | Comma-separated category IDs | `spring,gift` |
| `短描述` | Card subtitle | `温柔粉系 · 雏菊玫瑰` |
| `详情` | Product detail copy | `适合生日、纪念日...` |
| `价格` | Number | `398` |
| `价格文案` | Display price | `¥398` |
| `图片` | Public image URL or site asset path | `./assets/product-spring-bouquet.png` |
| `图片描述` | Alt text | `春日浅粉花束` |
| `按钮文案` | CTA text | `加入` |
| `供应状态` | Availability copy | `当日花材需提前确认` |
| `配送说明` | Delivery/reservation notes | `建议提前 1 天预约` |
| `小程序路径` | Mini program path | `/pages/product/detail?id=spring-pink-bouquet` |
| `排序` | Number, smaller first | `10` |
| `上架` | Show/hide | `true` |

If a row ID matches a product already in `content-data.js`, Feishu values override the default row. Empty fields keep the static fallback where possible.

## Filters Table

| Column | Meaning | Example |
| --- | --- | --- |
| `ID` | Category ID | `spring` |
| `名称` | Button label | `春日限定` |
| `排序` | Number | `20` |
| `显示` | Show/hide | `true` |

## Video Stories Table

| Column | Meaning | Example |
| --- | --- | --- |
| `ID` | Stable ID | `studio-vlog` |
| `标题` | Story title | `工作室日常 Vlog` |
| `说明` | Meta text | `绿墙小院 · 20 秒` |
| `图片` | Public image URL or site asset path | `./assets/inspiration-studio.png` |
| `图片描述` | Alt text | `工作室日常 vlog` |
| `排序` | Number | `30` |
| `显示` | Show/hide | `true` |

## Settings Table

Use a simple key/value table:

| key | value |
| --- | --- |
| `miniProgram.name` | `MissDill` |
| `miniProgram.status` | `configured` |
| `miniProgram.appId` | real mini program AppID |
| `miniProgram.fallbackMessage` | Website handoff copy |
| `videos.feature.title` | Main video title |
| `videos.feature.summary` | Main video summary |
| `videos.feature.src` | `./assets/missdill-atelier-video.mp4` |
| `videos.feature.poster` | `./assets/inspiration-bouquet.png` |

## API Behavior

- Website frontend first requests `./api/content`.
- If the Worker is not configured or Feishu returns an error, the frontend falls back to `content-data.js`.
- `/api/health` returns whether Feishu env vars are configured.
- The Worker reads records from `/open-apis/bitable/v1/apps/{app_token}/tables/{table_id}/records`.
- The Worker gets `tenant_access_token` from `/open-apis/auth/v3/tenant_access_token/internal`.

Official references:

- Feishu Bitable records API: https://open.feishu.cn/document/server-docs/docs/bitable-v1/app-table-record/list
- Feishu tenant access token: https://open.feishu.cn/document/server-docs/authentication-management/access-token/tenant_access_token_internal
- Bitable data model overview: https://open.feishu.cn/document/server-docs/docs/bitable-v1/notification
