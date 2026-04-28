const ALLOWED_METHODS = new Set(["GET", "HEAD"]);

function buildOriginUrl(requestUrl, originBase) {
  const incoming = new URL(requestUrl);
  const origin = new URL(originBase);
  const pathname = incoming.pathname === "/" ? "/index.html" : incoming.pathname;
  origin.pathname = `${origin.pathname.replace(/\/$/, "")}${pathname}`;
  origin.search = incoming.search;
  return origin;
}

function withProxyHeaders(response) {
  const headers = new Headers(response.headers);
  headers.set("x-missdill-proxy", "cloudflare-worker");
  headers.delete("x-github-request-id");
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
}

async function fetchFromOrigin(request, env, pathnameOverride = "") {
  const originUrl = buildOriginUrl(request.url, env.ORIGIN_BASE);
  if (pathnameOverride) {
    const origin = new URL(env.ORIGIN_BASE);
    originUrl.pathname = `${origin.pathname.replace(/\/$/, "")}${pathnameOverride}`;
    originUrl.search = "";
  }

  return fetch(originUrl, {
    method: request.method,
    headers: {
      "accept": request.headers.get("accept") || "*/*",
      "user-agent": request.headers.get("user-agent") || "MissDill Cloudflare Worker"
    },
    cf: {
      cacheEverything: true,
      cacheTtlByStatus: {
        "200-299": 3600,
        "300-399": 300,
        "404": 60,
        "500-599": 0
      }
    }
  });
}

export default {
  async fetch(request, env) {
    if (!ALLOWED_METHODS.has(request.method)) {
      return new Response("Method Not Allowed", {
        status: 405,
        headers: { "allow": "GET, HEAD" }
      });
    }

    const response = await fetchFromOrigin(request, env);
    const acceptsHtml = request.headers.get("accept")?.includes("text/html");
    if (response.status === 404 && acceptsHtml) {
      return withProxyHeaders(await fetchFromOrigin(request, env, "/index.html"));
    }

    return withProxyHeaders(response);
  }
};
