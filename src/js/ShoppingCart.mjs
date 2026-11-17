import { getLocalStorage, setLocalStorage, updateCartCount, renderListWithTemplate } from "./utils.mjs";

function cartItemTemplate(item) {
  // API products: item.Images.PrimaryMedium
  // Old local JSON products: item.Image
  // Old cart items already saved in localStorage: item.Image
  const imageSrc = item.Images?.PrimaryMedium || item.Image || "";
  const quantity = item.Quantity || 1;

  return `<li class="cart-card divider">
  <span class="remove-item" data-id="${item.Id}">X</span>
  <a href="#" class="cart-card__image">
    <img src="${imageSrc}" alt="${item.Name}" />
  </a>
  <a href="#">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="cart-card__color">${item.Colors[0].ColorName}</p>
  <p class="cart-card__quantity">qty: ${quantity}</p>
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
    this.calculateListTotal(this.list);
    this.renderCart(this.list);
    this.setupRemoveListeners();
  }

  calculateListTotal(list) {
    const amounts = list.map((item) => {
      const quantity = item.Quantity || 1;
      return item.FinalPrice * quantity;
    });
    this.total = amounts.reduce((sum, amount) => sum + amount, 0);
  }

  renderCart(list) {
    const parent = document.querySelector(this.parentSelector);
    parent.innerHTML = "";
    renderListWithTemplate(cartItemTemplate, parent, list);
  }

  setupRemoveListeners() {
    document.querySelectorAll(".remove-item").forEach((btn) => {
      btn.addEventListener("click", () => {
        this.list = this.list.filter((item) => item.Id !== btn.dataset.id);
        setLocalStorage(this.key, this.list);
        updateCartCount();
        this.init();
      });
    });
  }
}