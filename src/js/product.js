import { setLocalStorage, qs } from "./utils.mjs";
import ProductData from "./ProductData.mjs";

const dataSource = new ProductData("tents");
const productId = qs("#addToCart")?.dataset.id;

function calculateDiscount(product) {
  if (product.FinalPrice < product.SuggestedRetailPrice) {
    const saved = (product.SuggestedRetailPrice - product.FinalPrice).toFixed(2);
    const percent = Math.round(((product.SuggestedRetailPrice - product.FinalPrice) / product.SuggestedRetailPrice) * 100);
    return { saved, percent };
  }
  return null;
}

function productDetailTemplate(product) {
  const discount = calculateDiscount(product);
  let discountHtml = "";
  
  if (discount) {
    discountHtml = `
      <div class="product-detail__discount">
        <span class="discount-badge detail-badge">${discount.percent}% OFF</span>
        <p class="discount-detail">
          <span class="original-price">List: $${product.SuggestedRetailPrice.toFixed(2)}</span>
          <span class="savings">You Save $${discount.saved} (${discount.percent}%)</span>
        </p>
      </div>
    `;
  }

  return `
    <h3>${product.Brand.Name}</h3>
    <h2 class="divider">${product.NameWithoutBrand}</h2>
    <img class="divider" src="${product.Image}" alt="${product.Name}" />
    ${discountHtml}
    <p class="product-card__price">$${product.FinalPrice}</p>
    <p class="product__color">${product.Colors[0].ColorName}</p>
    <p class="product__description">${product.DescriptionHtmlSimple}</p>
    <div class="product-detail__add">
      <button id="addToCart" data-id="${product.Id}">Add to Cart</button>
    </div>
  `;
}

async function renderProductDetail() {
  if (!productId) return;
  const product = await dataSource.findProductById(productId);
  const detailSection = qs(".product-detail");
  if (product && detailSection) {
    detailSection.innerHTML = productDetailTemplate(product);
    // re-attach listener after re-render
    document.getElementById("addToCart").addEventListener("click", addToCartHandler);
  }
}

function addProductToCart(product) {
  setLocalStorage("so-cart", product);
}

async function addToCartHandler(e) {
  const product = await dataSource.findProductById(e.target.dataset.id);
  addProductToCart(product);
}

document.getElementById("addToCart")?.addEventListener("click", addToCartHandler);

// Initialize if this is a dynamic detail page
renderProductDetail();