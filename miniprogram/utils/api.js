const API_BASE_URL = "";

function request(options) {
  if (!API_BASE_URL) {
    return Promise.reject(
      new Error("API_BASE_URL is not configured. Use local catalog data for MVP preview.")
    );
  }

  return new Promise((resolve, reject) => {
    wx.request({
      url: `${API_BASE_URL}${options.url}`,
      method: options.method || "GET",
      data: options.data || {},
      success(response) {
        if (response.statusCode >= 200 && response.statusCode < 300) {
          resolve(response.data);
        } else {
          reject(new Error(`Request failed: ${response.statusCode}`));
        }
      },
      fail: reject
    });
  });
}

function createOrderPreview(orderDraft) {
  return {
    id: `preview_${Date.now()}`,
    items: orderDraft.items,
    total: orderDraft.total,
    fulfillment: orderDraft.fulfillment,
    deliveryDate: orderDraft.deliveryDate,
    contact: orderDraft.contact,
    status: "pending_backend",
    nextApi: "POST /api/orders",
    message: "后台和微信支付参数接入后，这里会创建真实订单并调用 wx.requestPayment。"
  };
}

module.exports = {
  API_BASE_URL,
  request,
  createOrderPreview
};
