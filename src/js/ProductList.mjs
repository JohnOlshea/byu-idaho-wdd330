import { renderListWithTemplate } from "./utils.mjs";

function productCardTemplate(product) {
  const isDiscounted = product.FinalPrice < product.SuggestedRetailPrice;
  const discountPercent = isDiscounted
    ? Math.round(
        ((product.SuggestedRetailPrice - product.FinalPrice) /
          product.SuggestedRetailPrice) *
          100
      )
    : 0;

  return `<li class="product-card">
    <a href="/product_pages/index.html?product=${product.Id}">
      <img
        src="${product.Images.PrimaryMedium}"
        alt="Image of ${product.Name}"
        width="300"
        height="300"
        loading="lazy"
      />
      <h3 class="card__brand">${product.Brand.Name}</h3>
      <h2 class="card__name">${product.NameWithoutBrand}</h2>
      <p class="product-card__price">
        $${product.FinalPrice}
        ${
          isDiscounted
            ? `<span class="discount-badge">Save ${discountPercent}%</span>`
            : ""
        }
      </p>
      ${
        isDiscounted
          ? `<p class="product-card__original-price"><s>$${product.SuggestedRetailPrice}</s></p>`
          : ""
      }
    </a>
  </li>`;
}

export default class ProductList {
  constructor(category, dataSource, listElement) {
    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement;
    this.loadingEl = document.querySelector("#loading");
    this.errorEl = document.querySelector("#listing-error");
  }

  async init() {
    // Show "Loading..." right away
    if (this.loadingEl) this.loadingEl.classList.remove("hide");
    if (this.errorEl) this.errorEl.classList.add("hide");

    try {
      const list = await this.dataSource.getData(this.category);
      // Products are here - hide loading, show products
      if (this.loadingEl) this.loadingEl.classList.add("hide");
      this.renderList(list);
    } catch (err) {
      // Fetch failed - hide loading, show error
      if (this.loadingEl) this.loadingEl.classList.add("hide");
      if (this.errorEl) {
        this.errorEl.textContent =
          "Sorry, we couldn't load products right now. Please try again.";
        this.errorEl.classList.remove("hide");
      }
      console.log(err);
    }
  }

  renderList(list) {
    renderListWithTemplate(
      productCardTemplate,
      this.listElement,
      list,
      "afterbegin",
      true
    );
  }
}