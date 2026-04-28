const filters = [
  { id: "all", label: "推荐" },
  { id: "spring", label: "春日限定" },
  { id: "gift", label: "生日祝福" },
  { id: "event", label: "开业乔迁" },
  { id: "class", label: "课程预约" }
];

const products = [
  {
    id: "spring-pink-bouquet",
    name: "春日浅粉花束",
    categories: ["spring", "gift"],
    description: "温柔粉系 · 雏菊玫瑰",
    detail:
      "适合生日、纪念日和日常赠礼。整体以浅粉、奶白和自然绿色为主，保留 MissDill 偏自然的松弛花型。",
    price: 398,
    priceLabel: "¥398",
    image: "/images/product-spring-bouquet.png",
    availability: "当日花材需提前确认",
    deliveryNotes: "建议提前 1 天预约；同城配送范围和时段以工作室确认为准。",
    type: "product"
  },
  {
    id: "fresh-green-basket",
    name: "清新绿意花篮",
    categories: ["spring", "event"],
    description: "自然清新 · 送礼佳选",
    detail:
      "更适合开业、乔迁、探访或空间陈列。用白绿花材营造干净、舒展的视觉，风格克制不喧闹。",
    price: 498,
    priceLabel: "¥498",
    image: "/images/product-green-basket.png",
    availability: "可做同风格替换",
    deliveryNotes: "花篮尺寸和主花材可按预算微调。",
    type: "product"
  },
  {
    id: "dyed-lily-bouquet",
    name: "吸色百合花束",
    categories: ["spring", "gift"],
    description: "高级配色 · 气质优雅",
    detail:
      "围绕吸色百合做主视觉，适合喜欢特别花材和冷暖混合配色的客人。需要根据当季到货情况确认。",
    price: 598,
    priceLabel: "¥598",
    image: "/images/product-lily-bouquet.png",
    availability: "限量花材",
    deliveryNotes: "吸色花材存在自然色差，下单前建议沟通当天状态。",
    type: "product"
  },
  {
    id: "morandi-pink-bouquet",
    name: "莫兰迪粉色花束",
    categories: ["gift", "event"],
    description: "轻柔雅致 · 氛围感",
    detail:
      "低饱和粉色与自然枝条结合，适合纪念日、拍照、餐桌布置和轻量活动花礼。",
    price: 458,
    priceLabel: "¥458",
    image: "/images/product-rose-vase.png",
    availability: "稳定供应",
    deliveryNotes: "可按偏粉、偏白、偏绿三个方向微调。",
    type: "product"
  },
  {
    id: "basic-floral-class",
    name: "基础花艺沙龙",
    categories: ["class"],
    description: "2.5 小时 · 小班体验",
    detail:
      "适合第一次接触花艺的客人。课程会覆盖花材认知、基础修剪、构图和包装，完成一份可带走作品。",
    price: 268,
    priceLabel: "¥268",
    image: "/images/class-workshop.png",
    availability: "需确认课表",
    deliveryNotes: "课程日期、人数和作品主题以当期发布为准。",
    type: "class"
  },
  {
    id: "event-floral-installation",
    name: "活动花艺布置",
    categories: ["event"],
    description: "婚礼 · 小型活动 · 商业空间",
    detail:
      "面向小型婚礼、品牌活动、商业空间和长期陈列。根据场地、预算和花材季节性给出方案。",
    price: 1200,
    priceLabel: "¥1200 起",
    image: "/images/atelier-courtyard.png",
    availability: "按项目报价",
    deliveryNotes: "建议至少提前 7 天沟通场地、预算和搭建时间。",
    type: "custom"
  }
];

function getProductById(id) {
  return products.find((product) => product.id === id);
}

function getProductsByFilter(filterId) {
  if (!filterId || filterId === "all") return products;
  return products.filter((product) => product.categories.includes(filterId));
}

module.exports = {
  filters,
  products,
  getProductById,
  getProductsByFilter
};
