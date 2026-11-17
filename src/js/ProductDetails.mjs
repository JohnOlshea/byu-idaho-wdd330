import { getLocalStorage, setLocalStorage, updateCartCount, alertMessage } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";

export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource;
  }

  async init() {
    this.product = await this.dataSource.findProductById(this.productId);
    this.renderProductDetails();
    document
      .getElementById("addToCart")
      .addEventListener("click", () => this.addProductToCart());
  }

  addProductToCart() {
    let cart = getLocalStorage("so-cart");
    // getLocalStorage can return null, a single object, or an array
    // normalize it to an array so .find() always works
    if (!cart) cart = [];
    if (!Array.isArray(cart)) cart = [cart];

    // Make sure every old item has a Quantity (old cart items don't)
    cart.forEach((item) => {
      if (!item.Quantity) item.Quantity = 1;
    });

    // Look for this product already in the cart
    const existingItem = cart.find((item) => item.Id === this.product.Id);

    if (existingItem) {
      // Already there -> don't add again, just increase quantity
      existingItem.Quantity += 1;
    } else {
      // Not there yet -> add it with Quantity = 1
      this.product.Quantity = 1;
      cart.push(this.product);
    }

    setLocalStorage("so-cart", cart);
    updateCartCount();
    alertMessage(`${this.product.Name} added to cart!`, false);
  }

  renderProductDetails() {
    const p = this.product;

    document.querySelector(".product-detail h3").textContent = p.Brand.Name;
    document.querySelector(".product-detail h2").textContent =
      p.NameWithoutBrand;

    const img = document.querySelector(".product-detail img");
    // Hide it until the real image is set, so no broken icon flashes
    img.style.visibility = "hidden";
    img.src = p.Images.PrimaryLarge;
    img.alt = p.Name;
    // Show it only when it actually loads
    img.onload = () => {
      img.style.visibility = "visible";
    };

    document.querySelector(".product-card__price").textContent =
      `$${p.FinalPrice}`;
    document.querySelector(".product__color").textContent =
      p.Colors[0].ColorName;
    document.querySelector(".product__description").innerHTML =
      p.DescriptionHtmlSimple;

    // Discount flag - show Save X% only if product is discounted
    // FinalPrice < SuggestedRetailPrice means it is on sale
    const discountEl = document.querySelector(".product-card__discount");
    if (p.FinalPrice < p.SuggestedRetailPrice) {
      // Work out how much they save as a percent
      // e.g. (89.99 - 69.99) / 89.99 = 0.22 -> 22%
      const discountPercent = Math.round(
        ((p.SuggestedRetailPrice - p.FinalPrice) /
          p.SuggestedRetailPrice) *
        100
      );
      discountEl.innerHTML = `<s>$${p.SuggestedRetailPrice}</s> <span class="discount-badge">Save ${discountPercent}%</span>`;
    } else {
      // Not on sale - leave it empty so no badge shows
      discountEl.innerHTML = "";
    }

    document.getElementById("addToCart").dataset.id = p.Id;
    document.title = `Sleep Outside | ${p.Name}`;
  }
}