const data = window.MISSDILL_DATA;

const header = document.querySelector(".site-header");
const filterBar = document.querySelector("[data-filter-bar]");
const productGrid = document.querySelector("[data-product-grid]");
const cartDrawer = document.querySelector("[data-cart-drawer]");
const cartItemsEl = document.querySelector("[data-cart-items]");
const cartCountEl = document.querySelector("[data-cart-count]");
const cartTotalEl = document.querySelector("[data-cart-total]");
const openCartButtons = [...document.querySelectorAll("[data-cart-open]")];
const closeCartButton = document.querySelector("[data-cart-close]");
const checkoutButton = document.querySelector("[data-checkout]");
const handoffStatus = document.querySelector("[data-handoff-status]");
const customForm = document.querySelector(".custom-form");
const formStatus = document.querySelector(".form-status");
const mainVideo = document.querySelector("[data-main-video]");
const videoFrame = document.querySelector(".video-frame");
const playButton = document.querySelector("[data-video-play]");
const videoFallback = document.querySelector("[data-video-fallback]");
const videoLabel = document.querySelector("[data-video-label]");
const videoTitle = document.querySelector("[data-video-title]");
const videoSummary = document.querySelector("[data-video-summary]");
const videoStoryList = document.querySelector("[data-video-story-list]");
const productDialog = document.querySelector("[data-product-dialog]");
const dialogCloseButton = document.querySelector("[data-dialog-close]");
const dialogImage = document.querySelector("[data-dialog-image]");
const dialogTitle = document.querySelector("[data-dialog-title]");
const dialogDetail = document.querySelector("[data-dialog-detail]");
const dialogPrice = document.querySelector("[data-dialog-price]");
const dialogAvailability = document.querySelector("[data-dialog-availability]");
const dialogDelivery = document.querySelector("[data-dialog-delivery]");
const dialogAddButton = document.querySelector("[data-dialog-add]");
const dialogHandoffButton = document.querySelector("[data-dialog-handoff]");

const cart = [];
let activeFilter = "all";
let activeProductId = null;
let latestHandoff = null;

const currency = new Intl.NumberFormat("zh-CN", {
  style: "currency",
  currency: "CNY",
  maximumFractionDigits: 0,
});

window.missDillAnalytics = window.missDillAnalytics || [];

function track(name, payload = {}) {
  const event = { name, payload, timestamp: new Date().toISOString() };
  window.missDillAnalytics.push(event);
  console.info("[MissDill analytics]", event);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function productById(productId) {
  return data.products.find((product) => product.id === productId);
}

function productPrice(product) {
  return product.priceLabel || (product.price ? currency.format(product.price) : "按项目报价");
}

function groupedCartItems(items) {
  return items.reduce((result, item) => {
    const existing = result.find((entry) => entry.id === item.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      result.push({ ...item, quantity: 1 });
    }
    return result;
  }, []);
}

function buildCartQuery(items) {
  return items
    .map((item) => `${encodeURIComponent(item.id)}:${item.quantity || 1}`)
    .join(",");
}

function buildMiniProgramHandoff(items, mode) {
  const groupedItems = groupedCartItems(items);
  const cartQuery = buildCartQuery(groupedItems);
  const cartPath = `${data.miniProgram.cartPath}?items=${encodeURIComponent(cartQuery)}&source=website`;
  const directPath = mode === "direct_product" && groupedItems.length === 1 ? groupedItems[0].miniProgramPath : "";

  return {
    version: data.miniProgram.handoffVersion,
    appId: data.miniProgram.appId || "pending_real_appid",
    source: "missdill-website",
    mode,
    path: directPath || cartPath,
    cartPath,
    items: groupedItems.map((item) => ({
      id: item.id,
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      type: item.type || (item.categories.includes("class") ? "class" : "product"),
      miniProgramPath: item.miniProgramPath,
    })),
  };
}

async function copyText(value) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  document.body.append(textarea);
  textarea.select();
  document.execCommand("copy");
  textarea.remove();
}

function updateHeader() {
  header.classList.toggle("scrolled", window.scrollY > 12);
}

function renderFilters() {
  filterBar.innerHTML = data.filters
    .map(
      (filter) => `
        <button
          class="filter-pill${filter.id === activeFilter ? " active" : ""}"
          type="button"
          data-filter="${escapeHtml(filter.id)}"
          aria-pressed="${filter.id === activeFilter ? "true" : "false"}"
        >
          ${escapeHtml(filter.label)}
        </button>
      `,
    )
    .join("");
}

function renderProducts() {
  const visibleProducts = data.products.filter((product) => {
    return activeFilter === "all" || product.categories.includes(activeFilter);
  });

  productGrid.innerHTML = visibleProducts
    .map(
      (product) => `
        <article class="product-card" data-product-id="${escapeHtml(product.id)}">
          <button class="product-image-button" type="button" data-open-product="${escapeHtml(product.id)}">
            <img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.alt)}" />
          </button>
          <div>
            <p>${escapeHtml(product.description)}</p>
            <h3>${escapeHtml(product.name)}</h3>
            <p class="availability-line">${escapeHtml(product.availability)}</p>
            <div class="product-meta">
              <strong>${escapeHtml(productPrice(product))}</strong>
              <div class="product-actions">
                <button class="detail-button" type="button" data-open-product="${escapeHtml(product.id)}">详情</button>
                <button type="button" data-add-cart="${escapeHtml(product.id)}">${escapeHtml(product.actionLabel)}</button>
              </div>
            </div>
          </div>
        </article>
      `,
    )
    .join("");
}

function renderVideoContent() {
  const feature = data.videos.feature;
  mainVideo.src = feature.src;
  mainVideo.poster = feature.poster;
  videoFallback.src = feature.poster;
  videoFallback.alt = `${feature.title}封面`;
  videoLabel.textContent = feature.label;
  videoTitle.textContent = feature.title;
  videoSummary.textContent = feature.summary;

  videoStoryList.innerHTML = data.videos.stories
    .map(
      (story) => `
        <article>
          <img src="${escapeHtml(story.image)}" alt="${escapeHtml(story.alt)}" />
          <div>
            <h3>${escapeHtml(story.title)}</h3>
            <p>${escapeHtml(story.meta)}</p>
          </div>
        </article>
      `,
    )
    .join("");

  if (feature.src) {
    videoFrame.classList.add("has-video");
  }
}

function openCart() {
  cartDrawer.classList.add("open");
  cartDrawer.setAttribute("aria-hidden", "false");
  document.body.classList.add("drawer-open");
}

function closeCart() {
  cartDrawer.classList.remove("open");
  cartDrawer.setAttribute("aria-hidden", "true");
  document.body.classList.remove("drawer-open");
}

function renderCart() {
  const total = cart.reduce((sum, item) => sum + (item.price || 0), 0);
  cartCountEl.textContent = String(cart.length);
  cartTotalEl.textContent = currency.format(total);

  if (!cart.length) {
    cartItemsEl.innerHTML = '<p class="empty-cart">还没有选择花礼。</p>';
    handoffStatus.innerHTML = "";
    latestHandoff = null;
    return;
  }

  cartItemsEl.innerHTML = groupedCartItems(cart)
    .map(
      (item) => `
        <article class="cart-item">
          <div>
            <h3>${escapeHtml(item.name)}</h3>
            <p>${escapeHtml(productPrice(item))} × ${item.quantity}</p>
          </div>
          <button type="button" data-remove-item="${escapeHtml(item.id)}">移除</button>
        </article>
      `,
    )
    .join("");
}

function addProductToCart(productId) {
  const product = productById(productId);
  if (!product) return;
  cart.push(product);
  renderCart();
  closeProductDialog();
  openCart();
  track("product_add_to_bag", { productId: product.id, categories: product.categories });
}

function renderHandoffStatus(product = null) {
  const selected = product ? [product] : cart;
  if (!selected.length) {
    handoffStatus.innerHTML = '<p class="handoff-message">请先选择一个花礼，再进入小程序下单。</p>';
    return;
  }

  latestHandoff = buildMiniProgramHandoff(selected, product ? "direct_product" : "cart_checkout");
  const payloadJson = JSON.stringify(latestHandoff, null, 2);

  handoffStatus.innerHTML = `
    <div class="handoff-message">
      <strong>小程序交接已准备</strong>
      <p>${escapeHtml(data.miniProgram.fallbackMessage)}</p>
      <div class="handoff-path">
        <span>推荐入口</span>
        <code>${escapeHtml(latestHandoff.path)}</code>
      </div>
      <ul>
        ${latestHandoff.items
          .map(
            (item) => `
              <li>
                <span>${escapeHtml(item.name)} × ${item.quantity}</span>
                <code>${escapeHtml(item.miniProgramPath)}</code>
              </li>
            `,
          )
          .join("")}
      </ul>
      <div class="handoff-actions">
        <button type="button" data-copy-mini-path>复制小程序路径</button>
        <button type="button" data-copy-handoff-json>复制调试数据</button>
      </div>
      <details class="handoff-debug">
        <summary>开发调试数据</summary>
        <pre>${escapeHtml(payloadJson)}</pre>
      </details>
      <p class="copy-status" data-copy-status></p>
    </div>
  `;

  track("mini_program_handoff_preview", {
    productIds: selected.map((item) => item.id),
    integrationStatus: data.miniProgram.status,
  });
}

function openProductDialog(productId) {
  const product = productById(productId);
  if (!product) return;
  activeProductId = product.id;
  dialogImage.src = product.image;
  dialogImage.alt = product.alt;
  dialogTitle.textContent = product.name;
  dialogDetail.textContent = product.detail;
  dialogPrice.textContent = productPrice(product);
  dialogAvailability.textContent = product.availability;
  dialogDelivery.textContent = product.deliveryNotes;
  productDialog.classList.add("open");
  productDialog.setAttribute("aria-hidden", "false");
  document.body.classList.add("drawer-open");
  track("product_detail_open", { productId: product.id });
}

function closeProductDialog() {
  productDialog.classList.remove("open");
  productDialog.setAttribute("aria-hidden", "true");
  document.body.classList.remove("drawer-open");
}

function validateCustomForm(formData) {
  const contact = String(formData.get("contact") || "").trim();
  if (!contact) return "请留下微信或手机号，方便工作室确认花材和时间。";
  if (contact.length < 4) return "联系方式太短，请填写可联系到你的微信或手机号。";
  return "";
}

filterBar.addEventListener("click", (event) => {
  const button = event.target.closest("[data-filter]");
  if (!button) return;
  activeFilter = button.dataset.filter;
  renderFilters();
  renderProducts();
  track("product_filter_change", { filter: activeFilter });
});

productGrid.addEventListener("click", (event) => {
  const addButton = event.target.closest("[data-add-cart]");
  if (addButton) {
    addProductToCart(addButton.dataset.addCart);
    return;
  }

  const detailButton = event.target.closest("[data-open-product]");
  if (detailButton) {
    openProductDialog(detailButton.dataset.openProduct);
  }
});

openCartButtons.forEach((button) => button.addEventListener("click", openCart));
closeCartButton.addEventListener("click", closeCart);

cartDrawer.addEventListener("click", (event) => {
  if (event.target === cartDrawer) closeCart();
});

cartItemsEl.addEventListener("click", (event) => {
  const removeButton = event.target.closest("[data-remove-item]");
  if (!removeButton) return;
  const index = cart.findIndex((item) => item.id === removeButton.dataset.removeItem);
  if (index >= 0) cart.splice(index, 1);
  renderCart();
});

handoffStatus.addEventListener("click", async (event) => {
  if (!latestHandoff) return;
  const status = handoffStatus.querySelector("[data-copy-status]");

  try {
    if (event.target.closest("[data-copy-mini-path]")) {
      await copyText(latestHandoff.path);
      if (status) status.textContent = "已复制小程序路径。";
      track("mini_program_path_copy", { path: latestHandoff.path });
    }

    if (event.target.closest("[data-copy-handoff-json]")) {
      await copyText(JSON.stringify(latestHandoff, null, 2));
      if (status) status.textContent = "已复制交接调试数据。";
      track("mini_program_payload_copy", { itemCount: latestHandoff.items.length });
    }
  } catch (error) {
    if (status) status.textContent = "复制失败，请手动选择调试数据。";
  }
});

checkoutButton.addEventListener("click", () => {
  renderHandoffStatus();
  if (cart.length) checkoutButton.textContent = "已生成小程序交接";
  window.setTimeout(() => {
    checkoutButton.textContent = "去小程序下单";
  }, 2200);
});

dialogCloseButton.addEventListener("click", closeProductDialog);
productDialog.addEventListener("click", (event) => {
  if (event.target === productDialog) closeProductDialog();
});
dialogAddButton.addEventListener("click", () => addProductToCart(activeProductId));
dialogHandoffButton.addEventListener("click", () => {
  const product = productById(activeProductId);
  if (!product) return;
  renderHandoffStatus(product);
  closeProductDialog();
  openCart();
});

customForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(customForm);
  const error = validateCustomForm(formData);
  if (error) {
    formStatus.textContent = error;
    formStatus.classList.add("error");
    customForm.elements.contact.setAttribute("aria-invalid", "true");
    return;
  }

  customForm.elements.contact.removeAttribute("aria-invalid");
  formStatus.classList.remove("error");
  formStatus.textContent = "已在本页生成定制需求模拟记录；接入后台后可同步到微信客服、企微或订单后台。";
  track("custom_order_submit_preview", {
    scene: formData.get("scene"),
    budget: formData.get("budget"),
  });
  customForm.reset();
});

playButton?.addEventListener("click", async () => {
  if (!mainVideo?.getAttribute("src")) {
    playButton.textContent = "生成中";
    return;
  }

  if (mainVideo.paused) {
    await mainVideo.play();
    videoFrame.classList.add("playing");
    playButton.textContent = "暂停";
    track("video_play", { videoId: data.videos.feature.id });
  } else {
    mainVideo.pause();
    videoFrame.classList.remove("playing");
    playButton.textContent = "播放";
  }
});

mainVideo?.addEventListener("pause", () => {
  videoFrame.classList.remove("playing");
  playButton.textContent = "播放";
});

mainVideo?.addEventListener("play", () => {
  videoFrame.classList.add("playing");
  playButton.textContent = "暂停";
});

window.addEventListener("scroll", updateHeader, { passive: true });
window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeCart();
    closeProductDialog();
  }
});

renderFilters();
renderProducts();
renderVideoContent();
updateHeader();
renderCart();
