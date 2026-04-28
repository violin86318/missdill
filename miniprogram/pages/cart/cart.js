const { cartFromHandoffQuery, handoffNotice } = require("../../utils/handoff");

Page({
  data: {
    cart: [],
    total: 0,
    handoffNotice: ""
  },

  onLoad(query) {
    const incomingCart = cartFromHandoffQuery(query);
    if (!incomingCart.length) return;
    getApp().replaceCart(incomingCart);
    this.setData({ handoffNotice: handoffNotice(query, incomingCart) });
  },

  onShow() {
    this.refreshCart();
  },

  refreshCart() {
    const cart = getApp().globalData.cart;
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    this.setData({ cart, total });
  },

  removeItem(event) {
    const { id } = event.currentTarget.dataset;
    getApp().removeFromCart(id);
    this.refreshCart();
  },

  goOrderConfirm() {
    if (!this.data.cart.length) {
      wx.showToast({ title: "请先选择花礼", icon: "none" });
      return;
    }
    wx.navigateTo({ url: "/pages/order/confirm" });
  },

  goShop() {
    wx.switchTab({ url: "/pages/shop/shop" });
  }
});
