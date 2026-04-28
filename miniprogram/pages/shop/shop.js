const { filters, getProductsByFilter } = require("../../utils/catalog");

Page({
  data: {
    filters,
    activeFilter: "all",
    products: getProductsByFilter("all")
  },

  setFilter(event) {
    const { id } = event.currentTarget.dataset;
    this.setData({
      activeFilter: id,
      products: getProductsByFilter(id)
    });
  },

  openProduct(event) {
    const { id } = event.currentTarget.dataset;
    wx.navigateTo({ url: `/pages/product/detail?id=${id}` });
  }
});
