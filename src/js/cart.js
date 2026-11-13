import { getLocalStorage, setLocalStorage, updateCartCount } from "./utils.mjs";

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart");
  const items = Array.isArray(cartItems) ? cartItems : [cartItems].filter(Boolean);
  const listEl = document.querySelector(".product-list");
  const footerEl = document.querySelector(".cart-footer");
  const totalEl = document.querySelector(".cart-total");

  // EMPTY CART - show message, hide total
  if (items.length === 0) {
    listEl.innerHTML = `<li class="empty-cart">Your cart is empty.</li>`;
    if (footerEl) footerEl.classList.add("hide");
    updateCartCount();
    return;
  }

  // NOT EMPTY - show items
  const htmlItems = items.map((item) => cartItemTemplate(item));
  listEl.innerHTML = htmlItems.join("");

  // TOTAL - add up all FinalPrice values
  // Example: 69.99 + 199.99 = 269.98
  const total = items.reduce((sum, item) => sum + item.FinalPrice, 0);
  if (totalEl) totalEl.textContent = `Total: $${total.toFixed(2)}`;
  if (footerEl) footerEl.classList.remove("hide");

  updateCartCount();
}

function cartItemTemplate(item) {
  const newItem = `<li class="cart-card divider">
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

  return newItem;
}

function removeItemFromCart(id) {
  const cartItems = getLocalStorage("so-cart");
  const items = Array.isArray(cartItems) ? cartItems : [cartItems].filter(Boolean);

  // Find the FIRST item with this Id and remove only that one
  const index = items.findIndex((item) => item.Id === id);
  if (index > -1) {
    items.splice(index, 1);
  }

  setLocalStorage("so-cart", items);
  renderCartContents();
}

// ONE listener for the whole list — works even after re-render
document.querySelector(".product-list").addEventListener("click", (e) => {
  if (e.target.classList.contains("remove-item")) {
    const id = e.target.dataset.id;
    removeItemFromCart(id);
  }
});

renderCartContents();