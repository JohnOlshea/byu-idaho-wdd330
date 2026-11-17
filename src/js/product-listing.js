import ExternalServices from "./ExternalServices.mjs";
import ProductList from "./ProductList.mjs";
import { loadHeaderFooter, getParam } from "./utils.mjs";

loadHeaderFooter();

const category = getParam("category");
const dataSource = new ExternalServices();
// Use ID now, not class - so we get the real <ul>, not the loading <p>
const listElement = document.querySelector("#product-list");

// Show "Top Products: Backpacks" etc.
const categoryNameEl = document.querySelector("#category-name");
if (categoryNameEl) {
  categoryNameEl.textContent =
    category.charAt(0).toUpperCase() + category.slice(1);
}

const myList = new ProductList(category, dataSource, listElement);
myList.init();