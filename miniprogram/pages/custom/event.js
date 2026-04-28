const { getProductById } = require("../../utils/catalog");

const scenes = ["生日 / 纪念日", "开业 / 乔迁", "婚礼 / 活动", "花艺课程", "企业花礼"];
const budgets = ["¥300 - ¥500", "¥500 - ¥1000", "¥1000 - ¥3000", "¥3000 以上"];

Page({
  data: {
    scenes,
    budgets,
    intent: null,
    sceneIndex: 0,
    budgetIndex: 0,
    status: ""
  },

  onLoad(query) {
    const product = query.id ? getProductById(query.id) : null;
    if (!product) return;
    this.setData({
      intent: product,
      sceneIndex: product.type === "class" ? 3 : 2,
      status: `已带入咨询项目：${product.name}`
    });
  },

  setScene(event) {
    this.setData({ sceneIndex: Number(event.detail.value) });
  },

  setBudget(event) {
    this.setData({ budgetIndex: Number(event.detail.value) });
  },

  submitLead(event) {
    const values = event.detail.value;
    const contact = String(values.contact || "").trim();
    if (contact.length < 4) {
      this.setData({ status: "请留下微信或手机号，方便工作室确认花材和时间。" });
      return;
    }

    const lead = {
      id: `lead_${Date.now()}`,
      scene: scenes[this.data.sceneIndex],
      budget: budgets[this.data.budgetIndex],
      intentId: this.data.intent ? this.data.intent.id : "",
      intentName: this.data.intent ? this.data.intent.name : "",
      date: values.date || "",
      contact,
      notes: values.notes || "",
      status: "new",
      createdAt: new Date().toISOString()
    };
    const app = getApp();
    app.globalData.leads.unshift(lead);
    wx.setStorageSync("missdill_leads", app.globalData.leads);
    this.setData({ status: "已生成定制需求预览；接入后台后会同步给微信客服或订单后台。" });
    wx.showToast({ title: "已提交", icon: "success" });
  }
});
