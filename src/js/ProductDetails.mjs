import { getLocalStorage, setLocalStorage } from "./utils.mjs";

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
      .addEventListener("click", this.addProductToCart.bind(this));
  }

  addProductToCart() {
    const cart = getLocalStorage("so-cart");
    // getLocalStorage already returns [] if empty, but protect old bad data
    const items = Array.isArray(cart) ? cart : [cart].filter(Boolean);
    items.push(this.product);
    setLocalStorage("so-cart", items);
  }

  renderProductDetails() {
    const p = this.product;

    // Your HTML uses classes, not IDs - so we select by class
    document.querySelector(".product-detail h3").textContent = p.Brand.Name;
    document.querySelector(".product-detail h2").textContent =
      p.NameWithoutBrand;

    const img = document.querySelector(".product-detail img");
    img.src = p.Image;
    img.alt = p.Name;

    document.querySelector(".product-card__price").textContent =
      `$${p.FinalPrice}`;
    document.querySelector(".product__color").textContent =
      p.Colors[0].ColorName;
    document.querySelector(".product__description").innerHTML =
      p.DescriptionHtmlSimple;

    document.getElementById("addToCart").dataset.id = p.Id;
    document.title = `Sleep Outside | ${p.Name}`;
  }
}