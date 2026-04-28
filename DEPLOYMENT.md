# Deployment Notes

## GitHub Pages

Repository target:

```text
violin86318/missdill
```

Pages source:

```text
branch: main
path: /
```

Expected Pages URL:

```text
https://violin86318.github.io/missdill/
```

## Cloudflare Worker Proxy

Worker name:

```text
missdill-site-proxy
```

Route:

```text
missdill.beyondmotion.net/*
```

Custom domain:

```text
missdill.beyondmotion.net
```

Origin:

```text
https://violin86318.github.io/missdill
```

The Worker maps `/` to `/index.html` and forwards static assets to the matching path under the GitHub Pages project path.

## DNS Status

The Worker custom domain created a proxied, read-only DNS record managed by Cloudflare Workers:

```text
type: AAAA
name: missdill.beyondmotion.net
content: 100::
proxied: true
```

Do not replace this with a manual GitHub Pages CNAME unless the Worker custom domain is intentionally removed.

## Deploy Command

Use the custom domain flag when redeploying so the Worker keeps both triggers:

```bash
npx wrangler deploy --domain missdill.beyondmotion.net
```

## Feishu Bitable Content

Dynamic content is served by the Worker endpoint:

```text
https://missdill.beyondmotion.net/api/content
```

Before enabling it, configure Worker secrets from `FEISHU_BITABLE_SETUP.md`. Without those secrets the website automatically uses the static fallback in `content-data.js`.

Health check:

```text
https://missdill.beyondmotion.net/api/health
```
