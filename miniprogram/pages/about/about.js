Page({
  data: {
    channels: ["微博", "小红书", "微信服务号：MissDill"]
  },

  goCustom() {
    wx.switchTab({ url: "/pages/custom/event" });
  }
});
