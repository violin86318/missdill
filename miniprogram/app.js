App({
  globalData: {
    cart: [],
    leads: [],
    orderPreviews: []
  },

  addToCart(product) {
    const cart = this.globalData.cart;
    const existing = cart.find((item) => item.id === product.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    wx.setStorageSync("missdill_cart", cart);
    this.updateCartBadge();
  },

  replaceCart(cart) {
    this.globalData.cart = cart;
    wx.setStorageSync("missdill_cart", cart);
    this.updateCartBadge();
  },

  removeFromCart(productId) {
    this.globalData.cart = this.globalData.cart.filter((item) => item.id !== productId);
    wx.setStorageSync("missdill_cart", this.globalData.cart);
    this.updateCartBadge();
  },

  saveOrderPreview(orderPreview) {
    this.globalData.orderPreviews.unshift(orderPreview);
    wx.setStorageSync("missdill_order_previews", this.globalData.orderPreviews);
  },

  updateCartBadge() {
    const count = this.globalData.cart.reduce((sum, item) => sum + item.quantity, 0);
    if (count > 0) {
      wx.setTabBarBadge({ index: 3, text: String(count) });
    } else {
      wx.removeTabBarBadge({ index: 3 });
    }
  },

  onLaunch() {
    this.globalData.cart = wx.getStorageSync("missdill_cart") || [];
    this.globalData.leads = wx.getStorageSync("missdill_leads") || [];
    this.globalData.orderPreviews = wx.getStorageSync("missdill_order_previews") || [];
    this.updateCartBadge();
  }
});
