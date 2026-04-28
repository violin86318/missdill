const { getProductById } = require("../../utils/catalog");

Page({
  data: {
    product: null
  },

  onLoad(query) {
    this.loadProduct(query.id);
  },

  loadProduct(id) {
    const product = getProductById(id);
    if (!product) {
      wx.showToast({ title: "未找到花礼", icon: "none" });
      wx.navigateBack();
      return;
    }
    this.setData({ product });
  },

  addToCart() {
    getApp().addToCart(this.data.product);
    wx.showToast({ title: "已加入购物袋", icon: "success" });
  },

  goCart() {
    wx.switchTab({ url: "/pages/cart/cart" });
  },

  goCustom() {
    wx.switchTab({ url: "/pages/custom/event" });
  }
});
