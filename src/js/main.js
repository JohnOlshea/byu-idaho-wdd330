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
  
  // Handle both image formats: product.Image vs product.Images.PrimaryLarge
  const imageSrc = product.Image || product.Images?.PrimaryMedium || product.Images?.PrimaryLarge;
  const brand = product.Brand?.Name || "";

  let discountHtml = "";
  if (discount) {
    discountHtml = `
      <span class="discount-badge">
        ${discount.percentOff}% OFF - Save $${discount.amountSaved}
      </span>
      <p class="product-card__discount">Was $${product.SuggestedRetailPrice.toFixed(2)}</p>
    `;
  }

  // Flag the card itself if discounted for extra styling
  const discountedClass = discount ? "product-card--discounted" : "";

  return `<li class="product-card ${discountedClass}">
    <a href="product_pages/marmot-ajax-3.html">
      <img src="${imageSrc}" alt="${product.Name}">
      <h3 class="card__brand">${brand}</h3>
      <h2 class="card__name">${product.NameWithoutBrand || product.Name}</h2>
      ${discountHtml}
      <p class="product-card__price">$${product.FinalPrice}</p>
    </a>
  </li>`;
}

async function renderProductList() {
  const data = await dataSource.getData();
  // tents.json is an array, backpacks.json is { Result: [...] }
  const products = Array.isArray(data) ? data : data.Result;
  
  const html = products.map(productCardTemplate).join("");
  productListElement.innerHTML = html;
}

renderProductList();