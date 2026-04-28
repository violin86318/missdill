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

Origin:

```text
https://violin86318.github.io/missdill
```

The Worker maps `/` to `/index.html` and forwards static assets to the matching path under the GitHub Pages project path.

## DNS Requirement

`missdill.beyondmotion.net` must be proxied by Cloudflare. If no record exists, create a proxied CNAME:

```text
name: missdill
target: violin86318.github.io
proxied: true
```
