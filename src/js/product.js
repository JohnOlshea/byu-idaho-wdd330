import { getParam, formatCategory, setBreadcrumb } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";
import ProductDetails from "./ProductDetails.mjs";
import { loadHeaderFooter } from "./utils.mjs";

loadHeaderFooter();

const productId = getParam("product");
const category = getParam("category");
if (category) {
  setBreadcrumb([
    { label: "Home", href: "/index.html" },
    {
      label: formatCategory(category),
      href: `/product_listing/index.html?category=${encodeURIComponent(category)}`,
    },
  ]);
}
const dataSource = new ExternalServices();

const product = new ProductDetails(productId, dataSource);
product.init();