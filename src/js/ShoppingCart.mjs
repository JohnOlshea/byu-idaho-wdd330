import {
  getLocalStorage,
  setLocalStorage,
  renderListWithTemplate,
} from "./utils.mjs";

function cartItemTemplate(item) {
  return `<li class="cart-card divider">
  <span class="remove-item" data-id="${item.Id}">X</span>
  <a href="#" class="cart-card__image">
    <img src="${item.Image}" alt="${item.Name}" />
  </a>
  <a href="#">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="cart-card__color">${item.Colors[0].ColorName}</p>
  <p class="cart-card__quantity">qty: 1</p>
  <p class="cart-card__price">$${item.FinalPrice}</p>
</li>`;
}

export default class ShoppingCart {
  constructor(listElement) {
    this.listElement = listElement;
  }

  async init() {
    this.renderCartContents();
    this.listElement.addEventListener("click", (e) => {
      if (e.target.classList.contains("remove-item")) {
        this.removeItemFromCart(e.target.dataset.id);
      }
    });
  }

  getItems() {
    const cartItems = getLocalStorage("so-cart");
    return Array.isArray(cartItems) ? cartItems : [cartItems].filter(Boolean);
  }

  renderCartContents() {
    const items = this.getItems();
    const footerEl = document.querySelector(".cart-footer");
    const totalEl = document.querySelector(".cart-total");

    if (items.length === 0) {
      this.listElement.innerHTML = `<li class="empty-cart">Your cart is empty.</li>`;
      if (footerEl) footerEl.classList.add("hide");
      return;
    }

    renderListWithTemplate(
      cartItemTemplate,
      this.listElement,
      items,
      "afterbegin",
      true
    );

    const total = items.reduce((sum, item) => sum + item.FinalPrice, 0);
    if (totalEl) totalEl.textContent = `Total: $${total.toFixed(2)}`;
    if (footerEl) footerEl.classList.remove("hide");
  }

  removeItemFromCart(id) {
    const items = this.getItems();
    const index = items.findIndex((item) => item.Id === id);
    if (index > -1) items.splice(index, 1);
    setLocalStorage("so-cart", items);
    this.renderCartContents();
  }
}