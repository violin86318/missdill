const { getProductById } = require("./catalog");

function safeDecode(value) {
  try {
    return decodeURIComponent(String(value || ""));
  } catch (error) {
    return String(value || "");
  }
}

function normalizeQuantity(value) {
  const quantity = Number(value);
  if (!Number.isFinite(quantity) || quantity < 1) return 1;
  return Math.min(Math.floor(quantity), 99);
}

function parseHandoffItems(itemsParam) {
  const raw = safeDecode(itemsParam);
  if (!raw) return [];

  return raw
    .split(",")
    .map((entry) => {
      const [rawId, rawQuantity] = entry.split(":");
      const product = getProductById(safeDecode(rawId).trim());
      if (!product) return null;
      return {
        ...product,
        quantity: normalizeQuantity(rawQuantity)
      };
    })
    .filter(Boolean);
}

function cartFromHandoffQuery(query = {}) {
  return parseHandoffItems(query.items);
}

function handoffNotice(query = {}, cart = []) {
  if (!cart.length) return "";
  const source = query.source === "website" ? "官网" : "外部入口";
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  return `已从${source}带入 ${count} 件花礼，请确认后生成订单预览。`;
}

module.exports = {
  cartFromHandoffQuery,
  handoffNotice,
  parseHandoffItems
};
