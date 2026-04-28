const { createOrderPreview } = require("../../utils/api");
const {
  buildOrderDraft,
  cartTotal,
  fulfillmentOptions,
  timeSlots,
  validateOrderDraft
} = require("../../utils/order");

Page({
  data: {
    cart: [],
    total: 0,
    fulfillmentOptions,
    timeSlots,
    fulfillmentIndex: 0,
    timeSlotIndex: 0,
    deliveryDate: "",
    deliveryDateLabel: "请选择日期",
    orderPreview: null,
    status: ""
  },

  onShow() {
    this.refreshCart();
  },

  refreshCart() {
    const cart = getApp().globalData.cart;
    this.setData({
      cart,
      total: cartTotal(cart),
      orderPreview: null
    });
  },

  setFulfillment(event) {
    this.setData({ fulfillmentIndex: Number(event.detail.value) });
  },

  setTimeSlot(event) {
    this.setData({ timeSlotIndex: Number(event.detail.value) });
  },

  setDeliveryDate(event) {
    this.setData({
      deliveryDate: event.detail.value,
      deliveryDateLabel: event.detail.value || "请选择日期"
    });
  },

  submitOrder(event) {
    const draft = buildOrderDraft({
      cart: this.data.cart,
      fulfillmentIndex: this.data.fulfillmentIndex,
      timeSlotIndex: this.data.timeSlotIndex,
      source: "mini_program",
      values: {
        ...event.detail.value,
        deliveryDate: this.data.deliveryDate
      }
    });
    const error = validateOrderDraft(draft);
    if (error) {
      this.setData({ status: error, orderPreview: null });
      wx.showToast({ title: error, icon: "none" });
      return;
    }

    const orderPreview = createOrderPreview(draft);
    getApp().saveOrderPreview(orderPreview);
    this.setData({
      orderPreview,
      status: "订单草稿已生成。接入后台后这里会创建真实订单并进入微信支付。"
    });
    wx.showToast({ title: "已生成草稿", icon: "success" });
  },

  goCart() {
    wx.switchTab({ url: "/pages/cart/cart" });
  }
});
