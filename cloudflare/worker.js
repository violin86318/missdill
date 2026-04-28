const ALLOWED_METHODS = new Set(["GET", "HEAD"]);
const FEISHU_API_BASE = "https://open.feishu.cn/open-apis";

let tenantTokenCache = {
  token: "",
  expiresAt: 0
};

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

function jsonResponse(body, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": status === 200 ? "s-maxage=300, stale-while-revalidate=3600" : "no-store",
      ...extraHeaders
    }
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

function isFeishuConfigured(env) {
  return Boolean(
    env.FEISHU_APP_ID &&
      env.FEISHU_APP_SECRET &&
      env.FEISHU_APP_TOKEN &&
      env.FEISHU_TABLE_PRODUCTS
  );
}

async function getTenantAccessToken(env) {
  const now = Date.now();
  if (tenantTokenCache.token && tenantTokenCache.expiresAt > now + 60_000) {
    return tenantTokenCache.token;
  }

  const response = await fetch(`${FEISHU_API_BASE}/auth/v3/tenant_access_token/internal`, {
    method: "POST",
    headers: { "content-type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      app_id: env.FEISHU_APP_ID,
      app_secret: env.FEISHU_APP_SECRET
    })
  });
  const payload = await response.json();
  if (!response.ok || payload.code !== 0) {
    throw new Error(`Feishu token request failed: ${payload.code || response.status}`);
  }

  tenantTokenCache = {
    token: payload.tenant_access_token,
    expiresAt: now + Math.max(60, Number(payload.expire || 3600) - 120) * 1000
  };
  return tenantTokenCache.token;
}

async function feishuGet(env, path, query = {}) {
  const token = await getTenantAccessToken(env);
  const url = new URL(`${FEISHU_API_BASE}${path}`);
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== "") url.searchParams.set(key, value);
  });

  const response = await fetch(url, {
    headers: {
      authorization: `Bearer ${token}`,
      "content-type": "application/json; charset=utf-8"
    },
    cf: {
      cacheTtl: 120,
      cacheEverything: true
    }
  });
  const payload = await response.json();
  if (!response.ok || payload.code !== 0) {
    throw new Error(`Feishu request failed: ${payload.code || response.status}`);
  }
  return payload.data || {};
}

async function listRecords(env, tableId) {
  if (!tableId) return [];
  const records = [];
  let offset = 0;

  do {
    const data = await feishuGet(
      env,
      `/base/v3/bases/${encodeURIComponent(env.FEISHU_APP_TOKEN)}/tables/${encodeURIComponent(tableId)}/records`,
      {
        limit: 500,
        offset
      }
    );
    records.push(...normalizeBaseV3Records(data));
    offset += Array.isArray(data.data) ? data.data.length : 0;
    if (!data.has_more || !offset) break;
  } while (true);

  return records;
}

function normalizeBaseV3Records(data = {}) {
  if (Array.isArray(data.items)) return data.items;
  const fields = data.fields || [];
  return (data.data || []).map((row, rowIndex) => ({
    record_id: data.record_id_list?.[rowIndex] || "",
    fields: Object.fromEntries(fields.map((fieldName, index) => [fieldName, row[index]]))
  }));
}

function compactObject(value) {
  return Object.fromEntries(
    Object.entries(value).filter(([, entry]) => {
      if (entry === undefined || entry === null || entry === "") return false;
      if (Array.isArray(entry) && entry.length === 0) return false;
      return true;
    })
  );
}

function fieldValue(fields, names) {
  for (const name of names) {
    if (Object.prototype.hasOwnProperty.call(fields, name)) return fields[name];
  }
  return undefined;
}

function scalarValue(value) {
  if (value === undefined || value === null) return "";
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return String(value).trim();
  }
  if (Array.isArray(value)) {
    return value.map(scalarValue).filter(Boolean).join(",");
  }
  if (typeof value === "object") {
    return String(value.text || value.name || value.link || value.url || value.value || "").trim();
  }
  return "";
}

function numberValue(value) {
  const normalized = Number(scalarValue(value).replace(/[^\d.-]/g, ""));
  return Number.isFinite(normalized) ? normalized : undefined;
}

function listValue(value) {
  if (Array.isArray(value)) {
    return value.map(scalarValue).filter(Boolean);
  }
  return scalarValue(value)
    .split(/[,，;；、]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function visibleValue(value) {
  if (value === undefined || value === null || value === "") return true;
  if (typeof value === "boolean") return value;
  const normalized = scalarValue(value).toLowerCase();
  return !["false", "0", "no", "hidden", "hide", "否", "隐藏", "下架"].includes(normalized);
}

function sortValue(fields) {
  return numberValue(fieldValue(fields, ["排序", "sort", "Sort"])) || 999;
}

function recordsToProducts(records) {
  return records
    .map((record) => {
      const fields = record.fields || {};
      if (!visibleValue(fieldValue(fields, ["上架", "显示", "visible", "Visible"]))) return null;
      const id = scalarValue(fieldValue(fields, ["ID", "id", "商品ID", "slug"]));
      const name = scalarValue(fieldValue(fields, ["名称", "name", "商品名称", "标题"]));
      if (!id || !name) return null;

      return {
        sort: sortValue(fields),
        ...compactObject({
          id,
          name,
          type: scalarValue(fieldValue(fields, ["类型", "type"])),
          categories: listValue(fieldValue(fields, ["分类", "categories", "分类ID"])),
          description: scalarValue(fieldValue(fields, ["短描述", "description", "卡片描述"])),
          detail: scalarValue(fieldValue(fields, ["详情", "detail", "长描述"])),
          price: numberValue(fieldValue(fields, ["价格", "price"])),
          priceLabel: scalarValue(fieldValue(fields, ["价格文案", "priceLabel"])),
          image: scalarValue(fieldValue(fields, ["图片", "image", "imageUrl", "图片URL"])),
          alt: scalarValue(fieldValue(fields, ["图片描述", "alt"])),
          actionLabel: scalarValue(fieldValue(fields, ["按钮文案", "actionLabel"])),
          availability: scalarValue(fieldValue(fields, ["供应状态", "availability"])),
          deliveryNotes: scalarValue(fieldValue(fields, ["配送说明", "deliveryNotes"])),
          miniProgramPath: scalarValue(fieldValue(fields, ["小程序路径", "miniProgramPath"]))
        })
      };
    })
    .filter(Boolean)
    .sort((a, b) => a.sort - b.sort)
    .map(({ sort, ...item }) => item);
}

function recordsToFilters(records) {
  return records
    .map((record) => {
      const fields = record.fields || {};
      if (!visibleValue(fieldValue(fields, ["显示", "visible", "Visible"]))) return null;
      const id = scalarValue(fieldValue(fields, ["ID", "id", "分类ID"]));
      const label = scalarValue(fieldValue(fields, ["名称", "label", "显示名称"]));
      if (!id || !label) return null;
      return { sort: sortValue(fields), id, label };
    })
    .filter(Boolean)
    .sort((a, b) => a.sort - b.sort)
    .map(({ sort, ...item }) => item);
}

function recordsToVideoStories(records) {
  return records
    .map((record) => {
      const fields = record.fields || {};
      if (!visibleValue(fieldValue(fields, ["显示", "visible", "Visible"]))) return null;
      const id = scalarValue(fieldValue(fields, ["ID", "id", "视频ID"]));
      const title = scalarValue(fieldValue(fields, ["标题", "title"]));
      if (!title) return null;
      return {
        sort: sortValue(fields),
        ...compactObject({
          id,
          title,
          meta: scalarValue(fieldValue(fields, ["说明", "meta", "副标题"])),
          image: scalarValue(fieldValue(fields, ["图片", "image", "imageUrl", "图片URL"])),
          alt: scalarValue(fieldValue(fields, ["图片描述", "alt"]))
        })
      };
    })
    .filter(Boolean)
    .sort((a, b) => a.sort - b.sort)
    .map(({ sort, ...item }) => item);
}

function recordsToSettings(records) {
  const settings = {};
  records.forEach((record) => {
    const fields = record.fields || {};
    const key = scalarValue(fieldValue(fields, ["key", "Key", "键", "配置项"]));
    const value = scalarValue(fieldValue(fields, ["value", "Value", "值", "配置值"]));
    if (key) settings[key] = value;
  });
  return settings;
}

function contentFromSettings(settings) {
  return {
    miniProgram: compactObject({
      name: settings["miniProgram.name"],
      status: settings["miniProgram.status"],
      appId: settings["miniProgram.appId"],
      fallbackMessage: settings["miniProgram.fallbackMessage"]
    }),
    videos: {
      feature: compactObject({
        id: settings["videos.feature.id"],
        label: settings["videos.feature.label"],
        title: settings["videos.feature.title"],
        summary: settings["videos.feature.summary"],
        src: settings["videos.feature.src"],
        poster: settings["videos.feature.poster"]
      })
    }
  };
}

async function fetchFeishuContent(env) {
  const [productRecords, filterRecords, storyRecords, settingRecords] = await Promise.all([
    listRecords(env, env.FEISHU_TABLE_PRODUCTS),
    listRecords(env, env.FEISHU_TABLE_FILTERS),
    listRecords(env, env.FEISHU_TABLE_VIDEO_STORIES),
    listRecords(env, env.FEISHU_TABLE_SETTINGS)
  ]);
  const settingsContent = contentFromSettings(recordsToSettings(settingRecords));

  return {
    source: "feishu_bitable",
    configured: true,
    updatedAt: new Date().toISOString(),
    products: recordsToProducts(productRecords),
    filters: recordsToFilters(filterRecords),
    miniProgram: settingsContent.miniProgram,
    videos: {
      feature: settingsContent.videos.feature,
      stories: recordsToVideoStories(storyRecords)
    }
  };
}

async function handleContentRequest(request, env) {
  if (!isFeishuConfigured(env)) {
    return jsonResponse({
      source: "static_fallback",
      configured: false,
      message: "Feishu Bitable environment variables are not configured."
    });
  }

  try {
    const content = await fetchFeishuContent(env);
    return jsonResponse(content);
  } catch (error) {
    return jsonResponse(
      {
        source: "static_fallback",
        configured: false,
        error: error.message
      },
      502,
      { "cache-control": "no-store" }
    );
  }
}

export default {
  async fetch(request, env) {
    if (!ALLOWED_METHODS.has(request.method)) {
      return new Response("Method Not Allowed", {
        status: 405,
        headers: { "allow": "GET, HEAD" }
      });
    }

    const requestUrl = new URL(request.url);
    if (requestUrl.pathname === "/api/health") {
      return jsonResponse({
        ok: true,
        feishuConfigured: isFeishuConfigured(env)
      });
    }
    if (requestUrl.pathname === "/api/content") {
      return handleContentRequest(request, env);
    }

    const response = await fetchFromOrigin(request, env);
    const acceptsHtml = request.headers.get("accept")?.includes("text/html");
    if (response.status === 404 && acceptsHtml) {
      return withProxyHeaders(await fetchFromOrigin(request, env, "/index.html"));
    }

    return withProxyHeaders(response);
  }
};
