import ExternalServices from "./ExternalServices.mjs";
import ProductList from "./ProductList.mjs";
import { loadHeaderFooter, getParam, formatCategory } from "./utils.mjs";

loadHeaderFooter();

const category = getParam("category");
const search = getParam("search");
const dataSource = new ExternalServices();
// Use ID now, not class - so we get the real <ul>, not the loading <p>
const listElement = document.querySelector("#product-list");

// Show "Top Products: Backpacks" etc.
const categoryNameEl = document.querySelector("#category-name");
if (categoryNameEl) {
  categoryNameEl.textContent = search ? `"${search}"` : formatCategory(category);
}
if (search) {
  document.querySelector("#products-title").textContent = "Search Results";
}

const myList = new ProductList(category, dataSource, listElement, search || "");
myList.init();