import { getLocalStorage, setLocalStorage, updateCartCount } from "./utils.mjs";

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart");
  const items = Array.isArray(cartItems) ? cartItems : [cartItems].filter(Boolean);
  const htmlItems = items.map((item) => cartItemTemplate(item));
  document.querySelector(".product-list").innerHTML = htmlItems.join("");
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