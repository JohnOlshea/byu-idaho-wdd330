import { getLocalStorage } from "./utils.mjs";

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart");
  const productList = document.querySelector(".product-list");
  const cartFooter = document.querySelector(".cart-footer");

  // Handle empty / null cart
  if (!cartItems || cartItems.length === 0) {
    productList.innerHTML = "<p>Your cart is empty.</p>";
    if (cartFooter) cartFooter.classList.add("hide");
    return;
  }

  // Normalize: your setLocalStorage currently saves single object, not array
  // We handle both cases
  const itemsArray = Array.isArray(cartItems) ? cartItems : [cartItems];

  const htmlItems = itemsArray.map((item) => cartItemTemplate(item));
  productList.innerHTML = htmlItems.join("");

  // Calculate total and show footer
  if (cartFooter) {
    cartFooter.classList.remove("hide");
    const total = calculateTotal(itemsArray);
    document.querySelector(".cart-total").innerHTML = `Total: $${total}`;
  }
}

function cartItemTemplate(item) {
  return `<li class="cart-card divider">
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

function calculateTotal(items) {
  const total = items.reduce((sum, item) => sum + item.FinalPrice, 0);
  return total.toFixed(2);
}

renderCartContents();