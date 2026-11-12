import { renderListWithTemplate } from "./utils.mjs";

function productCardTemplate(product) {
  const isDiscounted = product.FinalPrice < product.SuggestedRetailPrice;

  // e.g. (250 - 199.99) / 250 = 0.20 → 20%
  const discountPercent = isDiscounted
    ? Math.round(
        ((product.SuggestedRetailPrice - product.FinalPrice) /
          product.SuggestedRetailPrice) *
          100
      )
    : 0;

  return `<li class="product-card">
    <a href="product_pages/?product=${product.Id}">
      <img src="${product.Image}" alt="Image of ${product.Name}" />
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
  }

  async init() {
    const data = await this.dataSource.getData();
    // your ProductData sometimes returns an array, sometimes { Result: [...] }
    const list = Array.isArray(data) ? data : data.Result;
    this.renderList(list);
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