# MissDill Website

Static website and WeChat mini program prototype for MissDill 花艺设计工作室.

## Website

- Static entry: `index.html`
- Content data: `content-data.js`
- Styles: `styles.css`
- Assets: `assets/`

## Mini Program

Open the mini program project in WeChat DevTools:

```text
miniprogram/
```

Replace `touristappid` in `miniprogram/project.config.json` with the real MissDill AppID before preview/upload.

## Deployment

GitHub Pages origin:

```text
https://violin86318.github.io/missdill/
```

Cloudflare Worker proxy target:

```text
https://missdill.beyondmotion.net/
```

The Worker implementation is in `cloudflare/worker.js`. Deployment notes are in `DEPLOYMENT.md`.
