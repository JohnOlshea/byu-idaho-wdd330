import {
  getLocalStorage,
  setLocalStorage,
  updateCartCount,
  renderListWithTemplate,
} from "./utils.mjs";

function cartItemTemplate(item) {
  const imageSrc = item.Images?.PrimaryMedium || item.Image || "";
  const quantity = item.Quantity || 1;

  return `<li class="cart-card divider">
  <button class="remove-item" data-id="${item.Id}" aria-label="Remove ${item.Name}">×</button>
  <a href="#" class="cart-card__image">
    <img src="${imageSrc}" alt="${item.Name}" />
  </a>
  <a href="#">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="cart-card__color">${item.Colors[0].ColorName}</p>

  <div class="cart-card__quantity">
    <div class="qty-stepper">
      <button class="qty-btn qty-minus" data-id="${item.Id}" aria-label="Decrease quantity">−</button>
      <span class="qty-value" aria-live="polite">qty: ${quantity}</span>
      <button class="qty-btn qty-plus" data-id="${item.Id}" aria-label="Increase quantity">+</button>
    </div>
  </div>

  <p class="cart-card__price">$${(item.FinalPrice * quantity).toFixed(2)}</p>
</li>`;
}

export default class ShoppingCart {
  constructor(key, parentSelector) {
    this.key = key;
    this.parentSelector = parentSelector;
    this.list = [];
    this.total = 0;
  }

  init() {
    const list = getLocalStorage(this.key);
    this.list = Array.isArray(list) ? list : list ? [list] : [];
    this.list.forEach((item) => {
      if (!item.Quantity) item.Quantity = 1;
    });
    this.calculateListTotal(this.list);
    this.renderCart(this.list);
    this.setupListeners();
  }

  calculateListTotal(list) {
    const amounts = list.map((item) => {
      const quantity = item.Quantity || 1;
      return item.FinalPrice * quantity;
    });
    this.total = amounts.reduce((sum, amount) => sum + amount, 0);

    const totalEl = document.querySelector(".cart-total");
    if (totalEl) {
      totalEl.textContent = `Total: $${this.total.toFixed(2)}`;
    }

    const footer = document.querySelector(".cart-footer");
    if (footer) {
      if (list.length === 0) footer.classList.add("hide");
      else footer.classList.remove("hide");
    }
  }

  renderCart(list) {
    const parent = document.querySelector(this.parentSelector);
    parent.innerHTML = "";
    renderListWithTemplate(cartItemTemplate, parent, list);
  }

  setupListeners() {
    document.querySelectorAll(".remove-item").forEach((btn) => {
      btn.addEventListener("click", () => {
        this.list = this.list.filter((item) => item.Id !== btn.dataset.id);
        this.saveAndRefresh();
      });
    });

    document.querySelectorAll(".qty-plus").forEach((btn) => {
      btn.addEventListener("click", () => {
        const item = this.list.find((i) => i.Id === btn.dataset.id);
        if (item) {
          item.Quantity = (item.Quantity || 1) + 1;
          this.saveAndRefresh();
        }
      });
    });

    document.querySelectorAll(".qty-minus").forEach((btn) => {
      btn.addEventListener("click", () => {
        const item = this.list.find((i) => i.Id === btn.dataset.id);
        if (!item) return;
        item.Quantity = (item.Quantity || 1) - 1;
        if (item.Quantity <= 0) {
          this.list = this.list.filter((i) => i.Id !== btn.dataset.id);
        }
        this.saveAndRefresh();
      });
    });
  }

  saveAndRefresh() {
    setLocalStorage(this.key, this.list);
    updateCartCount();
    this.calculateListTotal(this.list);
    this.renderCart(this.list);
    this.setupListeners();

    // Pop animation - runs AFTER the cart is re-drawn
    document.querySelectorAll(".qty-value").forEach((el) => {
      el.classList.remove("qty-pop");
      void el.offsetWidth;
      el.classList.add("qty-pop");
    });
    document.querySelectorAll(".cart-card__price").forEach((el) => {
      el.classList.remove("price-bump");
      void el.offsetWidth;
      el.classList.add("price-bump");
    });
  }
}