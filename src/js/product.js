import { getParam } from "./utils.mjs";
import ProductData from "./ProductData.mjs";
import ProductDetails from "./ProductDetails.mjs";
import { loadHeaderFooter } from "./utils.mjs";

const productId = getParam("product");
const dataSource = new ProductData("tents");

loadHeaderFooter();

const product = new ProductDetails(productId, dataSource);
product.init();