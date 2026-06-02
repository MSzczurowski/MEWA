const nav = document.querySelector("#main-nav");
const toggle = document.querySelector(".menu-toggle");
const currentPath = window.location.pathname;
const CART_STORAGE_KEY = "mewaCart";
const RECENTLY_VIEWED_STORAGE_KEY = "mewaRecentlyViewed";

const PRODUCT_CATALOG = [
  {
    name: "MEWA Urban",
    price: 529,
    image: "Dokumenty Opisowe/mewa-plecak-student-laptop.png",
    link: "/sklep/plecaki-miejskie/mewa-urban.html",
  },
  {
    name: "MEWA Junior",
    price: 349,
    image: "Dokumenty Opisowe/mewa-junior-plecak.png",
    link: "/sklep/plecaki-miejskie.html#plecaki-szkolne",
  },
  {
    name: "MEWA Kids XS",
    price: 299,
    image: "Dokumenty Opisowe/mewa-plecak-junior-wyprawka-przedszkole.png",
    link: "/sklep/plecaki-miejskie.html#plecaki-szkolne",
  },
  {
    name: "Nerka MEWA",
    price: 179,
    image: "Dokumenty Opisowe/nerka-z-odpadow-recykling.png",
    link: "/sklep/plecaki-miejskie.html#akcesoria",
  },
  {
    name: "Piornik MEWA",
    price: 99,
    image: "Dokumenty Opisowe/piornik-ekologiczny-mewa-recykling.png",
    link: "/sklep/plecaki-miejskie.html#akcesoria",
  },
];

const formatPrice = (value) => `${value} PLN`;

const parsePrice = (text) => {
  const digits = String(text || "").replace(/[^0-9]/g, "");
  return Number.parseInt(digits || "0", 10);
};

const showToast = (message) => {
  let toast = document.querySelector(".toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast";
    document.body.append(toast);
  }

  toast.textContent = message;
  toast.classList.add("is-visible");

  window.clearTimeout(showToast.timeoutId);
  showToast.timeoutId = window.setTimeout(() => {
    toast.classList.remove("is-visible");
  }, 2200);
};

if (nav && toggle) {
  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Node)) {
      return;
    }

    if (!nav.contains(target) && !toggle.contains(target)) {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });
}

const getCartState = () => {
  try {
    const value = window.sessionStorage.getItem(CART_STORAGE_KEY);
    return value ? JSON.parse(value) : [];
  } catch {
    return [];
  }
};

const setCartState = (items) => {
  window.sessionStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
};

const getRecentlyViewed = () => {
  try {
    const value = window.sessionStorage.getItem(RECENTLY_VIEWED_STORAGE_KEY);
    return value ? JSON.parse(value) : [];
  } catch {
    return [];
  }
};

const setRecentlyViewed = (items) => {
  window.sessionStorage.setItem(RECENTLY_VIEWED_STORAGE_KEY, JSON.stringify(items));
};

const createCartUI = () => {
  const cartButton = document.createElement("button");
  cartButton.className = "cart-fab";
  cartButton.type = "button";
  cartButton.innerHTML = '<span>Koszyk</span><strong class="cart-count">0</strong>';
  cartButton.setAttribute("aria-label", "Otworz koszyk");

  const cartDrawer = document.createElement("aside");
  cartDrawer.className = "cart-drawer";
  cartDrawer.setAttribute("aria-hidden", "true");
  cartDrawer.innerHTML = `
    <div class="cart-head">
      <h2>Twoj koszyk</h2>
      <button class="btn btn-ghost cart-close" type="button">Zamknij</button>
    </div>
    <div class="cart-body"></div>
    <div class="cart-foot">
      <p class="cart-total">Suma: 0 PLN</p>
      <button class="btn btn-primary cart-checkout" type="button">Przejdz do podsumowania</button>
      <button class="btn btn-ghost cart-clear" type="button">Wyczysc koszyk</button>
    </div>
  `;

  const overlay = document.createElement("div");
  overlay.className = "cart-overlay";

  document.body.append(cartButton, overlay, cartDrawer);

  return { cartButton, cartDrawer, overlay };
};

const getProductFromCard = (card) => {
  const nameNode = card.querySelector("h3");
  const priceNode = card.querySelector(".price");
  const imageNode = card.querySelector("img");
  if (!nameNode || !priceNode) {
    return null;
  }

  return {
    name: nameNode.textContent.trim(),
    price: parsePrice(priceNode.textContent),
    image: imageNode ? imageNode.getAttribute("src") : "",
  };
};

const attachQuickAddButtons = (onAdd) => {
  const cards = document.querySelectorAll(".product-card");

  cards.forEach((card) => {
    if (card.querySelector(".js-add-to-cart") || card.classList.contains("no-quick-add")) {
      return;
    }

    const product = getProductFromCard(card);
    if (!product || product.price <= 0) {
      return;
    }

    const button = document.createElement("button");
    button.type = "button";
    button.className = "btn btn-primary js-add-to-cart";
    button.textContent = "Dodaj do koszyka";
    button.dataset.productName = product.name;
    button.dataset.productPrice = String(product.price);
    button.dataset.productImage = product.image;
    card.append(button);

    button.addEventListener("click", () => {
      onAdd({
        name: button.dataset.productName,
        price: Number(button.dataset.productPrice),
        image: button.dataset.productImage || "",
      });
    });
  });
};

const enablePdpAddButton = (onAdd) => {
  const pdpButton = document.querySelector(".product-info .js-add-to-cart");
  if (!pdpButton) {
    return;
  }

  pdpButton.addEventListener("click", () => {
    onAdd({
      name: pdpButton.dataset.productName,
      price: Number(pdpButton.dataset.productPrice),
      image: pdpButton.dataset.productImage || "",
    });
  });
};

const initCart = () => {
  const { cartButton, cartDrawer, overlay } = createCartUI();
  const cartCount = cartButton.querySelector(".cart-count");
  const cartBody = cartDrawer.querySelector(".cart-body");
  const cartTotal = cartDrawer.querySelector(".cart-total");
  const clearButton = cartDrawer.querySelector(".cart-clear");
  const closeButton = cartDrawer.querySelector(".cart-close");
  const checkoutButton = cartDrawer.querySelector(".cart-checkout");

  let items = getCartState();
  let checkoutStep = 1;
  let checkoutData = {
    fullName: "",
    email: "",
    city: "",
    delivery: "kurier",
  };

  const updateCount = () => {
    const count = items.reduce((sum, item) => sum + item.qty, 0);
    cartCount.textContent = String(count);
  };

  const render = () => {
    if (!items.length) {
      cartBody.innerHTML = '<p class="cart-empty">Koszyk jest pusty. Dodaj produkt, aby przetestowac flow zakupu.</p>';
      cartTotal.textContent = "Suma: 0 PLN";
      updateCount();
      return;
    }

    cartBody.innerHTML = items
      .map(
        (item) => `
          <article class="cart-item" data-name="${item.name}">
            ${item.image ? `<img src="${item.image}" alt="${item.name}" />` : ""}
            <div>
              <h3>${item.name}</h3>
              <p>${formatPrice(item.price)}</p>
              <div class="qty-row">
                <button type="button" data-action="decrease">-</button>
                <span>${item.qty}</span>
                <button type="button" data-action="increase">+</button>
                <button type="button" data-action="remove">Usun</button>
              </div>
            </div>
          </article>
        `,
      )
      .join("");

    const total = items.reduce((sum, item) => sum + item.qty * item.price, 0);
    cartTotal.textContent = `Suma: ${formatPrice(total)}`;
    updateCount();
  };

  const renderCheckoutSummary = () => {
    const subtotal = items.reduce((sum, item) => sum + item.qty * item.price, 0);
    const deliveryCost = checkoutData.delivery === "paczkomat" ? 12 : 16;
    const total = subtotal + deliveryCost;

    return `
      <div class="checkout-summary-box">
        <p><strong>Klient:</strong> ${checkoutData.fullName}</p>
        <p><strong>Email:</strong> ${checkoutData.email}</p>
        <p><strong>Miasto:</strong> ${checkoutData.city}</p>
        <p><strong>Dostawa:</strong> ${checkoutData.delivery === "paczkomat" ? "Paczkomat" : "Kurier"}</p>
        <p><strong>Wartosc koszyka:</strong> ${formatPrice(subtotal)}</p>
        <p><strong>Koszt dostawy:</strong> ${formatPrice(deliveryCost)}</p>
        <p class="checkout-grand-total"><strong>Do zaplaty (demo):</strong> ${formatPrice(total)}</p>
      </div>
    `;
  };

  const renderCheckout = () => {
    if (!items.length) {
      showToast("Najpierw dodaj produkt do koszyka.");
      render();
      return;
    }

    if (checkoutStep === 1) {
      cartBody.innerHTML = `
        <section class="checkout-step">
          <h3>Krok 1: Dostawa</h3>
          <form class="checkout-form" novalidate>
            <label>Imie i nazwisko<input name="fullName" value="${checkoutData.fullName}" required /></label>
            <label>Email<input type="email" name="email" value="${checkoutData.email}" required /></label>
            <label>Miasto<input name="city" value="${checkoutData.city}" required /></label>
            <label>Metoda dostawy
              <select name="delivery">
                <option value="kurier" ${checkoutData.delivery === "kurier" ? "selected" : ""}>Kurier</option>
                <option value="paczkomat" ${checkoutData.delivery === "paczkomat" ? "selected" : ""}>Paczkomat</option>
              </select>
            </label>
            <p class="checkout-note">To wersja demo checkoutu bez backendu i platnosci.</p>
            <div class="checkout-actions">
              <button class="btn btn-ghost" type="button" data-checkout="cancel">Wroc do koszyka</button>
              <button class="btn btn-primary" type="submit">Dalej</button>
            </div>
          </form>
        </section>
      `;
      return;
    }

    cartBody.innerHTML = `
      <section class="checkout-step">
        <h3>Krok 2: Podsumowanie</h3>
        ${renderCheckoutSummary()}
        <div class="checkout-actions">
          <button class="btn btn-ghost" type="button" data-checkout="back">Wroc</button>
          <button class="btn btn-primary" type="button" data-checkout="confirm">Potwierdz zamowienie</button>
        </div>
      </section>
    `;
  };

  const openCart = () => {
    cartDrawer.classList.add("open");
    overlay.classList.add("open");
    cartDrawer.setAttribute("aria-hidden", "false");
  };

  const closeCart = () => {
    cartDrawer.classList.remove("open");
    overlay.classList.remove("open");
    cartDrawer.setAttribute("aria-hidden", "true");
  };

  const addItem = (product) => {
    if (!product.name || !product.price) {
      return;
    }

    const existing = items.find((item) => item.name === product.name);
    if (existing) {
      existing.qty += 1;
    } else {
      items.push({ ...product, qty: 1 });
    }

    setCartState(items);
    render();
    showToast(`Dodano: ${product.name}`);
  };

  cartBody.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLButtonElement)) {
      return;
    }

    const actionType = target.dataset.checkout;
    if (actionType === "cancel") {
      checkoutStep = 1;
      render();
      return;
    }

    if (actionType === "back") {
      checkoutStep = 1;
      renderCheckout();
      return;
    }

    if (actionType === "confirm") {
      items = [];
      setCartState(items);
      checkoutStep = 1;
      render();
      showToast("Zamowienie demo przyjete. Dziekujemy!");
      closeCart();
      return;
    }

    const parent = target.closest(".cart-item");
    if (!parent) {
      return;
    }

    const name = parent.dataset.name;
    const item = items.find((entry) => entry.name === name);
    if (!item) {
      return;
    }

    const action = target.dataset.action;
    if (action === "increase") {
      item.qty += 1;
    }

    if (action === "decrease") {
      item.qty = Math.max(1, item.qty - 1);
    }

    if (action === "remove") {
      items = items.filter((entry) => entry.name !== name);
    }

    setCartState(items);
    render();
  });

  cartBody.addEventListener("submit", (event) => {
    const form = event.target;
    if (!(form instanceof HTMLFormElement)) {
      return;
    }

    if (!form.classList.contains("checkout-form")) {
      return;
    }

    event.preventDefault();
    const data = new FormData(form);
    const payload = {
      fullName: String(data.get("fullName") || "").trim(),
      email: String(data.get("email") || "").trim(),
      city: String(data.get("city") || "").trim(),
      delivery: String(data.get("delivery") || "kurier"),
    };

    const valid = payload.fullName.length >= 3 && payload.email.includes("@") && payload.city.length >= 2;
    if (!valid) {
      showToast("Uzupelnij poprawnie dane dostawy.");
      return;
    }

    checkoutData = payload;
    checkoutStep = 2;
    renderCheckout();
  });

  cartButton.addEventListener("click", openCart);
  closeButton.addEventListener("click", closeCart);
  overlay.addEventListener("click", closeCart);

  clearButton.addEventListener("click", () => {
    items = [];
    setCartState(items);
    render();
  });

  checkoutButton.addEventListener("click", () => {
    checkoutStep = 1;
    renderCheckout();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeCart();
    }
  });

  render();
  return { addItem };
};

const initCategoryFilters = () => {
  const isCategoryPage = /\/sklep\/plecaki-miejskie(\.html)?$/.test(currentPath);
  if (!isCategoryPage) {
    return;
  }

  const container = document.querySelector("main .container");
  const categories = document.querySelectorAll("section[id]");
  if (!container || !categories.length) {
    return;
  }

  const controls = document.createElement("section");
  controls.className = "shop-tools";
  controls.innerHTML = `
    <div class="shop-tools-grid">
      <label>
        Szukaj produktu
        <input type="search" class="js-product-search" placeholder="np. Urban, Junior, nerka" />
      </label>
      <div class="filter-chips" role="group" aria-label="Filtr kategorii">
        <button class="active" type="button" data-filter="all">Wszystkie</button>
        <button type="button" data-filter="plecaki-szkolne">Plecaki szkolne</button>
        <button type="button" data-filter="plecaki-miejskie">Plecaki miejskie</button>
        <button type="button" data-filter="akcesoria">Akcesoria</button>
      </div>
      <label>
        Sortowanie
        <select class="js-sort-products">
          <option value="default">Domyslnie</option>
          <option value="price-asc">Cena: od najnizszej</option>
          <option value="price-desc">Cena: od najwyzszej</option>
          <option value="name-asc">Nazwa: A-Z</option>
        </select>
      </label>
    </div>
  `;

  const lead = container.querySelector(".lead");
  if (lead) {
    lead.insertAdjacentElement("afterend", controls);
  }

  const search = controls.querySelector(".js-product-search");
  const chips = controls.querySelectorAll(".filter-chips button");
  const sortSelect = controls.querySelector(".js-sort-products");

  const sortCards = (mode) => {
    categories.forEach((section) => {
      const grid = section.querySelector(".product-grid");
      if (!grid) {
        return;
      }

      const cards = Array.from(grid.querySelectorAll(".product-card"));
      cards.forEach((card, index) => {
        card.dataset.defaultOrder = card.dataset.defaultOrder || String(index);
      });

      cards.sort((a, b) => {
        const nameA = (a.querySelector("h3")?.textContent || "").trim();
        const nameB = (b.querySelector("h3")?.textContent || "").trim();
        const priceA = parsePrice(a.querySelector(".price")?.textContent || "0");
        const priceB = parsePrice(b.querySelector(".price")?.textContent || "0");

        if (mode === "price-asc") {
          return priceA - priceB;
        }

        if (mode === "price-desc") {
          return priceB - priceA;
        }

        if (mode === "name-asc") {
          return nameA.localeCompare(nameB, "pl");
        }

        return Number(a.dataset.defaultOrder) - Number(b.dataset.defaultOrder);
      });

      cards.forEach((card) => grid.append(card));
    });
  };

  let activeFilter = "all";

  const apply = () => {
    const query = String(search.value || "").trim().toLowerCase();

    categories.forEach((section) => {
      const inFilter = activeFilter === "all" || section.id === activeFilter;
      let sectionVisible = false;

      section.querySelectorAll(".product-card").forEach((card) => {
        const text = card.textContent.toLowerCase();
        const matchSearch = !query || text.includes(query);
        const visible = inFilter && matchSearch;
        card.classList.toggle("hidden", !visible);
        sectionVisible = sectionVisible || visible;
      });

      section.classList.toggle("hidden", !sectionVisible);
    });
  };

  search.addEventListener("input", apply);
  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      activeFilter = chip.dataset.filter;
      chips.forEach((button) => button.classList.remove("active"));
      chip.classList.add("active");
      apply();
    });
  });

  sortSelect.addEventListener("change", () => {
    sortCards(sortSelect.value);
    apply();
  });

  sortCards("default");
  apply();
};

const toRootAssetPath = (path) => String(path || "").replace(/^\/+/, "").replace(/^(\.\.\/)+/, "");

const toPageRelativePath = (path) => {
  if (!path || path.startsWith("http")) {
    return path;
  }

  const cleanPath = String(path).replace(/^\/+/, "");
  
  let urlPath = String(currentPath);
  if (urlPath.startsWith("http")) {
    urlPath = new URL(urlPath).pathname;
  }

  const segments = urlPath.split("/").filter(Boolean);
  if (segments.length > 0 && segments[segments.length - 1].includes(".")) {
    segments.pop();
  }

  const depth = Math.max(segments.length - 1, 0);
  const prefix = "../".repeat(depth);
  return `${prefix}${cleanPath}`;
};

const recordRecentlyViewed = (product) => {
  if (!product?.name) {
    return;
  }

  const current = getRecentlyViewed().filter((item) => item.name !== product.name);
  current.unshift({
    ...product,
    image: toRootAssetPath(product.image),
    viewedAt: Date.now(),
  });
  setRecentlyViewed(current.slice(0, 4));
};

const initProductViewTracking = () => {
  if (!currentPath.includes("/sklep/plecaki-miejskie/mewa-urban.html")) {
    return;
  }

  const name = document.querySelector(".product-info h1")?.textContent?.trim();
  const price = parsePrice(document.querySelector(".product-info .price")?.textContent || "0");
  const image = document.querySelector(".product-gallery img")?.getAttribute("src") || "";
  const link = "/sklep/plecaki-miejskie/mewa-urban.html";

  if (name && price > 0) {
    recordRecentlyViewed({ name, price, image, link });
  }
};

const initRecommendations = () => {
  const supportedPage =
    currentPath === "/" ||
    currentPath === "/index.html" ||
    currentPath === "/sklep/index.html" ||
    /\/sklep\/plecaki-miejskie(\.html)?$/.test(currentPath) ||
    currentPath.includes("/sklep/plecaki-miejskie/mewa-urban.html") ||
    currentPath.includes("/produkt/mewa-urban.html");
  if (!supportedPage) {
    return;
  }

  const main = document.querySelector("main");
  if (!main) {
    return;
  }

  const recentlyViewed = getRecentlyViewed();
  const recommended = PRODUCT_CATALOG.filter(
    (item) => !recentlyViewed.some((recent) => recent.name === item.name),
  ).slice(0, 3);

  const section = document.createElement("section");
  section.className = "section recommendation-zone";
  section.innerHTML = `
    <div class="container">
      <div class="section-head">
        <h2>Dla Ciebie</h2>
        <span class="eyebrow">Inteligentne podpowiedzi demo</span>
      </div>
      <div class="product-grid two-col recommendation-grid">
        <article class="product-card no-quick-add">
          <h3>Ostatnio ogladane</h3>
          <div class="recently-viewed-list">
            ${
              recentlyViewed.length
                ? recentlyViewed
                    .map(
                      (item) => `
                <a class="recent-item" href="${toPageRelativePath(item.link)}">
                  ${item.image ? `<img src="${toPageRelativePath(item.image)}" alt="${item.name}" />` : ""}
                  <div>
                    <strong>${item.name}</strong>
                    <p>${formatPrice(item.price)}</p>
                  </div>
                </a>
              `,
                    )
                    .join("")
                : '<p class="small-note">Brak historii przegladania. Otworz karte produktu, a tu pojawia sie podpowiedzi.</p>'
            }
          </div>
        </article>
        <article class="product-card no-quick-add">
          <h3>Polecane teraz</h3>
          <div class="recommended-list">
            ${recommended
              .map(
                (item) => `
              <a class="recent-item" href="${toPageRelativePath(item.link)}">
                <img src="${toPageRelativePath(item.image)}" alt="${item.name}" />
                <div>
                  <strong>${item.name}</strong>
                  <p>${formatPrice(item.price)}</p>
                </div>
              </a>
            `,
              )
              .join("")}
          </div>
        </article>
      </div>
    </div>
  `;

  main.append(section);
};

const initFaqAccordion = () => {
  if (!currentPath.includes("/faq/")) {
    return;
  }

  const cards = document.querySelectorAll(".product-card");
  cards.forEach((card) => {
    const title = card.querySelector("h2");
    const content = card.querySelector("p");
    if (!title || !content) {
      return;
    }

    const details = document.createElement("details");
    details.className = "faq-item";
    details.innerHTML = `
      <summary>${title.textContent}</summary>
      <div class="faq-answer">${content.textContent}</div>
    `;
    card.replaceWith(details);
  });
};

const initContactForm = () => {
  if (!currentPath.includes("/kontakt/")) {
    return;
  }

  const split = document.querySelector("main .split");
  if (!split) {
    return;
  }

  const formCard = document.createElement("article");
  formCard.className = "impact-card";
  formCard.innerHTML = `
    <h2>Napisz do MEWA</h2>
    <form class="contact-form" novalidate>
      <label>Imie i nazwisko<input type="text" name="name" required /></label>
      <label>Adres email<input type="email" name="email" required /></label>
      <label>Temat
        <select name="topic" required>
          <option value="">Wybierz temat</option>
          <option value="produkt">Pytanie o produkt</option>
          <option value="wspolpraca">Wspolpraca B2B i CSR</option>
          <option value="mewa-care">Serwis MEWA Care</option>
        </select>
      </label>
      <label>Wiadomosc<textarea name="message" rows="4" required></textarea></label>
      <button class="btn btn-primary" type="submit">Wyslij zapytanie</button>
      <p class="form-status" aria-live="polite"></p>
    </form>
  `;

  split.append(formCard);

  const form = formCard.querySelector(".contact-form");
  const status = formCard.querySelector(".form-status");

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const data = new FormData(form);
    const payload = {
      name: String(data.get("name") || "").trim(),
      email: String(data.get("email") || "").trim(),
      topic: String(data.get("topic") || "").trim(),
      message: String(data.get("message") || "").trim(),
    };

    const isValid =
      payload.name.length >= 3 &&
      payload.email.includes("@") &&
      payload.topic.length > 0 &&
      payload.message.length >= 12;

    if (!isValid) {
      status.textContent = "Uzupelnij wszystkie pola (min. 12 znakow wiadomosci).";
      status.classList.add("error");
      return;
    }

    status.textContent = "Dziekujemy. Wiadomosc zostala zapisana w wersji demo front-endu.";
    status.classList.remove("error");
    form.reset();
  });
};

const cart = initCart();
attachQuickAddButtons(cart.addItem);
enablePdpAddButton(cart.addItem);
initCategoryFilters();
initFaqAccordion();
initContactForm();
initProductViewTracking();
initRecommendations();
