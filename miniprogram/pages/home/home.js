const { products } = require("../../utils/catalog");

Page({
  data: {
    featured: products.slice(0, 4)
  },

  goShop() {
    wx.switchTab({ url: "/pages/shop/shop" });
  },

  goCustom() {
    wx.switchTab({ url: "/pages/custom/event" });
  },

  openProduct(event) {
    const { id } = event.currentTarget.dataset;
    wx.navigateTo({ url: `/pages/product/detail?id=${id}` });
  }
});
