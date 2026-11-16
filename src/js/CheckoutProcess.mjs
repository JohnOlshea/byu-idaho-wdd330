import { getLocalStorage, setLocalStorage, alertMessage } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";

const services = new ExternalServices();

function formDataToJSON(formElement) {
  const formData = new FormData(formElement);
  const convertedJSON = {};
  formData.forEach(function (value, key) {
    convertedJSON[key] = value;
  });
  return convertedJSON;
}

function packageItems(items) {
  return items.map((item) => ({
    id: item.Id,
    name: item.Name,
    price: item.FinalPrice,
    quantity: 1,
  }));
}

export default class CheckoutProcess {
  constructor(key, outputSelector) {
    this.key = key;
    this.outputSelector = outputSelector;
    this.list = [];
    this.itemTotal = 0;
    this.shipping = 0;
    this.tax = 0;
    this.orderTotal = 0;
  }

  init() {
    this.list = getLocalStorage(this.key);
    this.calculateItemSummary();
  }

  calculateItemSummary() {
    this.itemTotal = this.list.reduce((sum, item) => sum + item.FinalPrice, 0);
    const numItemsEl = document.querySelector(`${this.outputSelector} #num-items`);
    const subtotalEl = document.querySelector(`${this.outputSelector} #subtotal`);
    if (numItemsEl) numItemsEl.innerText = this.list.length;
    if (subtotalEl) subtotalEl.innerText = `$${this.itemTotal.toFixed(2)}`;
  }

  calculateOrderTotal() {
    this.tax = this.itemTotal * 0.06;
    this.shipping = this.list.length === 0 ? 0 : 10 + (this.list.length - 1) * 2;
    this.orderTotal = this.itemTotal + this.tax + this.shipping;
    this.displayOrderTotals();
  }

  displayOrderTotals() {
    const tax = document.querySelector(`${this.outputSelector} #tax`);
    const shipping = document.querySelector(`${this.outputSelector} #shipping`);
    const orderTotal = document.querySelector(`${this.outputSelector} #orderTotal`);
    if (tax) tax.innerText = `$${this.tax.toFixed(2)}`;
    if (shipping) shipping.innerText = `$${this.shipping.toFixed(2)}`;
    if (orderTotal) orderTotal.innerText = `$${this.orderTotal.toFixed(2)}`;
  }

  async checkout(form) {
    const json = formDataToJSON(form);
    json.orderDate = new Date().toISOString();
    json.orderTotal = this.orderTotal.toFixed(2);
    json.tax = this.tax.toFixed(2);
    json.shipping = this.shipping;
    json.items = packageItems(this.list);

    try {
      const res = await services.checkout(json);
      console.log(res);
      // Happy path: clear cart + go to success page
      setLocalStorage(this.key, []);
      location.assign("/checkout/success.html");
    } catch (err) {
      // Unhappy path: stay on form, show real server message
      console.log(err);
      // err.message is the object from the server, e.g. { message: "..." }
      const message = err.message?.message || JSON.stringify(err.message) || "Checkout failed. Please check your information.";
      // Remove any old alerts first so they don't stack
      document.querySelectorAll(".alert").forEach((a) => a.remove());
      alertMessage(message);
    }
  }
}