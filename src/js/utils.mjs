// wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}
// or a more concise version if you are into that sort of thing:
// export const qs = (selector, parent = document) => parent.querySelector(selector);

// retrieve data from localstorage
export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key)) || [];
}
// save data to local storage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}
// set a listener for both touchend and click
export function setClick(selector, callback) {
  qs(selector).addEventListener("touchend", (event) => {
    event.preventDefault();
    callback();
  });
  qs(selector).addEventListener("click", callback);
}

export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get(param);
}

// "sleeping-bags" -> "Sleeping Bags"
export function formatCategory(category) {
  return category
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

// Fill and show the breadcrumb under the navbar.
// crumbs = [{ label: "Home", href: "/index.html" }, { label: "Backpacks" }]
// countLabel = "15 items" (optional, shown as a pill badge)
export function setBreadcrumb(crumbs, countLabel = "") {
  const el = document.querySelector("#breadcrumb");
  if (!el) return;
  el.innerHTML = "";

  crumbs.forEach((crumb, i) => {
    if (i > 0) {
      const sep = document.createElement("span");
      sep.className = "breadcrumb-separator";
      sep.textContent = "›";
      el.append(sep);
    }
    if (crumb.href) {
      const a = document.createElement("a");
      a.href = crumb.href;
      a.textContent = crumb.label;
      el.append(a);
    } else {
      const span = document.createElement("span");
      span.className = "breadcrumb-current";
      span.textContent = crumb.label;
      el.append(span);
    }
  });

  if (countLabel) {
    const badge = document.createElement("span");
    badge.className = "breadcrumb-count";
    badge.textContent = countLabel;
    el.append(badge);
  }

  el.classList.remove("hide");
}

export function renderListWithTemplate(
  templateFn,
  parentElement,
  list,
  position = "afterbegin",
  clear = false
) {
  if (clear) {
    parentElement.innerHTML = "";
  }
  const htmlStrings = list.map(templateFn);
  parentElement.insertAdjacentHTML(position, htmlStrings.join(""));
}

export function updateCartCount() {
  const cart = getLocalStorage("so-cart");
  const list = Array.isArray(cart) ? cart : cart ? [cart] : [];
  const totalQty = list.reduce((sum, item) => sum + (item.Quantity || 1), 0);

  const badge = document.getElementById("cartCount");
  if (!badge) return;

  badge.textContent = totalQty;

  // Your CSS uses display:none to hide it, so we must use display to show it
  // display:flex = show orange circle, display:none = hide it
  if (totalQty === 0) {
    badge.style.display = "none";
  } else {
    badge.style.display = "flex";
  }
}

export function renderWithTemplate(template, parentElement, data, callback) {
  parentElement.innerHTML = template;
  if (callback) {
    callback(data);
  }
}

export async function loadTemplate(path) {
  const res = await fetch(path);
  const template = await res.text();
  return template;
}

export async function loadHeaderFooter() {
  const headerTemplate = await loadTemplate("/partials/header.html");
  const footerTemplate = await loadTemplate("/partials/footer.html");

  const headerElement = document.querySelector("#main-header");
  const footerElement = document.querySelector("#main-footer");

  renderWithTemplate(headerTemplate, headerElement);
  renderWithTemplate(footerTemplate, footerElement);

  // Header now exists in the DOM, so NOW it's safe to update the badge
  updateCartCount();
}

export function alertMessage(message, scroll = true, type = "error") {
  // create element to hold the alert
  const alert = document.createElement("div");
  // add a class to style the alert
  // type = "error" (red, default) or "success" (green)
  alert.classList.add("alert");
  if (type === "success") {
    alert.classList.add("success");
  }
  // set the contents. You should have a message and an X the user can click on to remove
  alert.innerHTML = `<p>${message}</p><span>X</span>`;

  // add a listener to the alert to see if they clicked on the X
  // if they did then remove the child
  alert.addEventListener("click", function (e) {
    if (e.target.tagName === "SPAN") {
      this.remove();
    }
  });
  // add the alert to the top of main
  const main = document.querySelector("main");
  main.prepend(alert);
  // make sure they see the alert by scrolling to the top of the window
  // you may not always want to do this...so default to scroll=true, but allow it to be passed in and overridden.
  if (scroll) window.scrollTo(0, 0);
}