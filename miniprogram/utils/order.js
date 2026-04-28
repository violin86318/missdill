const fulfillmentOptions = ["同城配送", "到店自提"];
const timeSlots = ["上午 10:00-12:00", "下午 14:00-17:00", "傍晚 17:00-19:00"];

function cartTotal(cart = []) {
  return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function buildOrderDraft(options = {}) {
  const values = options.values || {};
  const cart = options.cart || [];
  const fulfillment = fulfillmentOptions[options.fulfillmentIndex] || fulfillmentOptions[0];
  const timeSlot = timeSlots[options.timeSlotIndex] || timeSlots[0];

  return {
    source: options.source || "mini_program",
    items: cart.map((item) => ({
      id: item.id,
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      type: item.type
    })),
    total: cartTotal(cart),
    fulfillment,
    timeSlot,
    deliveryDate: values.deliveryDate || "",
    deliveryArea: values.deliveryArea || "",
    recipientName: values.recipientName || "",
    contact: values.contact || "",
    cardMessage: values.cardMessage || "",
    notes: values.notes || ""
  };
}

function validateOrderDraft(draft) {
  if (!draft.items.length) return "购物袋里还没有花礼。";
  if (!draft.deliveryDate) return "请选择期望日期。";
  if (draft.fulfillment === "同城配送" && !String(draft.deliveryArea).trim()) {
    return "请填写配送区域，方便工作室确认时段。";
  }
  if (!String(draft.contact).trim() || String(draft.contact).trim().length < 4) {
    return "请留下微信或手机号，方便工作室确认订单。";
  }
  return "";
}

module.exports = {
  buildOrderDraft,
  cartTotal,
  fulfillmentOptions,
  timeSlots,
  validateOrderDraft
};
