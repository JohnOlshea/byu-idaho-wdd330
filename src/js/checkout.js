import { loadHeaderFooter } from "./utils.mjs";
import CheckoutProcess from "./CheckoutProcess.mjs";

loadHeaderFooter();

const myCheckout = new CheckoutProcess("so-cart", ".order-summary");
myCheckout.init();

// When user finishes zip code, calculate tax/shipping/total
document
  .querySelector("#zip")
  .addEventListener("blur", () => myCheckout.calculateOrderTotal());

// On submit, prevent normal form submit and send to server
document
  .querySelector("form[name='checkout']")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    // Make sure totals are calculated before sending
    myCheckout.calculateOrderTotal();
    await myCheckout.checkout(e.target);
  });