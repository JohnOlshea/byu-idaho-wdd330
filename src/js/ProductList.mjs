import { renderListWithTemplate, formatCategory, setBreadcrumb } from "./utils.mjs";

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
    <a href="/product_pages/index.html?product=${product.Id}&category=${product._category}">
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
  constructor(category, dataSource, listElement, searchTerm = "") {
    this.category = category;
    this.searchTerm = searchTerm;
    this.list = [];
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
      const list = this.searchTerm
        ? await this.dataSource.searchProducts(this.searchTerm)
        : (await this.dataSource.getData(this.category)).map((p) => ({
            ...p,
            _category: this.category,
          }));
      this.list = list;
      // Products are here - hide loading, show products
      if (this.loadingEl) this.loadingEl.classList.add("hide");
      this.renderList(list);
      this.renderBreadcrumb();
      this.initSort();
      if (list.length === 0 && this.errorEl) {
        this.errorEl.textContent = "No products found.";
        this.errorEl.classList.remove("hide");
      }
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

  renderBreadcrumb() {
    const name = this.searchTerm
      ? `Search: "${this.searchTerm}"`
      : formatCategory(this.category);
    const count = this.list.length;
    setBreadcrumb(
      [{ label: "Home", href: "/index.html" }, { label: name }],
      `${count} ${count === 1 ? "item" : "items"}`
    );
  }

  initSort() {
    const controls = document.querySelector("#sort-controls");
    const select = document.querySelector("#sort");
    if (!controls || !select || this.list.length === 0) return;
    controls.classList.remove("hide");
    select.addEventListener("change", () =>
      this.renderList(this.sortList(select.value))
    );
  }

  sortList(by) {
    const list = [...this.list];
    switch (by) {
      case "name-asc":
        return list.sort((a, b) => a.Name.localeCompare(b.Name));
      case "name-desc":
        return list.sort((a, b) => b.Name.localeCompare(a.Name));
      case "price-asc":
        return list.sort((a, b) => a.FinalPrice - b.FinalPrice);
      case "price-desc":
        return list.sort((a, b) => b.FinalPrice - a.FinalPrice);
      default:
        return list;
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