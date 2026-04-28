const { getProductById } = require("../../utils/catalog");

Page({
  data: {
    product: null
  },

  onLoad(query) {
    const product = getProductById(query.id || "basic-floral-class");
    this.setData({ product });
  },

  reserveClass() {
    if (!this.data.product) return;
    getApp().addToCart(this.data.product);
    wx.showToast({ title: "已加入预约袋", icon: "success" });
  },

  goCustom() {
    wx.switchTab({ url: "/pages/custom/event" });
  }
});
