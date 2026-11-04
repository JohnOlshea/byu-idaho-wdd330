import ProductData from "./ProductData.mjs";

const dataSource = new ProductData("tents");
const productListElement = document.querySelector(".product-list");

function calculateDiscount(product) {
  const srp = product.SuggestedRetailPrice;
  const final = product.FinalPrice;
  if (!srp || !final || final >= srp) return null;
  const amountSaved = (srp - final).toFixed(2);
  const percentOff = Math.round(((srp - final) / srp) * 100);
  return { amountSaved, percentOff };
}

function productCardTemplate(product) {
  const discount = calculateDiscount(product);
  
  const imageSrc = product.Image || product.Images?.PrimaryMedium;
  const brand = product.Brand?.Name || "";

  // MAP ID -> correct detail page
  const pageMap = {
    "880RR": "marmot-ajax-3.html",
    "985RF": "northface-talus-4.html",
    "985PR": "northface-alpine-3.html",
    "344YJ": "cedar-ridge-rimrock-2.html",
  };
  
  const detailPage = pageMap[product.Id] || `marmot-ajax-3.html`;

  let discountHtml = "";
  if (discount) {
    discountHtml = `<span class="discount-badge">${discount.percentOff}% OFF</span>`;
  }

  return `<li class="product-card ${discount ? "product-card--discounted" : ""}">
    <a href="/product_pages/${detailPage}">
      <img src="${imageSrc}" alt="${product.Name}">
      <h3 class="card__brand">${brand}</h3>
      <h2 class="card__name">${product.NameWithoutBrand || product.Name}</h2>
      ${discountHtml}
      <p class="product-card__price">$${product.FinalPrice}</p>
    </a>
  </li>`;
}

async function renderProductList() {
  const products = await dataSource.getData();
  const html = products.map(productCardTemplate).join("");
  productListElement.innerHTML = html;
}

renderProductList();