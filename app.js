const DEFAULT_VISIBLE_ITEMS = 4;
const DEFAULT_MAX_PRICE = 1000;

const WHATSAPP_PHONE = "5511999999999";

const collections = Object.freeze([
  {
    icon: "✦",
    title: "Orientais",
    text: "Fragrâncias intensas, misteriosas e envolventes."
  },
  {
    icon: "✨",
    title: "Especiados",
    text: "Notas quentes com forte personalidade."
  },
  {
    icon: "◈",
    title: "Amadeirados",
    text: "Elegância marcante e sofisticação profunda."
  },
  {
    icon: "☾",
    title: "Âmbar",
    text: "Assinatura sensual, quente e luxuosa."
  },
  {
    icon: "❖",
    title: "Oud",
    text: "Presença nobre e impacto memorável."
  }
]);

const products = Object.freeze([
  {
    id: 1,
    name: "Asad Royale",
    family: "Oriental",
    intensity: "Intensa",
    price: 249,
    notes: ["Âmbar", "Baunilha", "Madeira"],
    description: "Um perfume impactante, quente e sedutor para presença forte."
  },
  {
    id: 2,
    name: "Oud Black Reserve",
    family: "Oud",
    intensity: "Intensa",
    price: 389,
    notes: ["Oud", "Incenso", "Especiarias"],
    description: "Luxo árabe profundo com assinatura marcante e sofisticada."
  },
  {
    id: 3,
    name: "Amber Saffron",
    family: "Âmbar",
    intensity: "Moderada",
    price: 279,
    notes: ["Âmbar", "Açafrão", "Musk"],
    description: "Quente, refinado e versátil para noites elegantes."
  },
  {
    id: 4,
    name: "Desert Velvet",
    family: "Amadeirado",
    intensity: "Moderada",
    price: 219,
    notes: ["Cedro", "Patchouli", "Baunilha"],
    description: "Textura macia, elegante e sofisticada para uso premium."
  },
  {
    id: 5,
    name: "Noir Spice",
    family: "Especiado",
    intensity: "Intensa",
    price: 299,
    notes: ["Pimenta", "Canela", "Madeiras"],
    description: "Forte, envolvente e ideal para quem quer se destacar."
  },
  {
    id: 6,
    name: "Golden Mirage",
    family: "Oriental",
    intensity: "Suave",
    price: 189,
    notes: ["Cítricos", "Musk", "Âmbar"],
    description: "Refinado, leve e sofisticado para elegância diária."
  },
  {
    id: 7,
    name: "Imperial Oud",
    family: "Oud",
    intensity: "Intensa",
    price: 459,
    notes: ["Oud", "Rosa", "Resinas"],
    description: "Luxuoso, raro e perfeito para ocasiões especiais."
  },
  {
    id: 8,
    name: "Arabian Dust",
    family: "Amadeirado",
    intensity: "Moderada",
    price: 239,
    notes: ["Sândalo", "Vetiver", "Âmbar"],
    description: "Elegante e misterioso com assinatura refinada."
  }
]);

const elements = {
  navToggle: document.querySelector(".nav-toggle"),
  siteNav: document.querySelector(".site-nav"),
  yearEl: document.getElementById("year"),
  collectionsGrid: document.getElementById("collectionsGrid"),
  featuredGrid: document.getElementById("featuredGrid"),
  productsGrid: document.getElementById("productsGrid"),
  familyChips: document.getElementById("familyChips"),
  resultsCount: document.getElementById("resultsCount"),
  footerWhatsAppLink: document.getElementById("footerWhatsAppLink"),
  priceRange: document.getElementById("priceRange"),
  priceValue: document.getElementById("priceValue"),
  searchInput: document.getElementById("searchInput"),
  intensitySelect: document.getElementById("intensitySelect"),
  sortSelect: document.getElementById("sortSelect"),
  clearFiltersBtn: document.getElementById("clearFiltersBtn"),
  loadMoreBtn: document.getElementById("loadMoreBtn"),
  productModal: document.getElementById("productModal"),
  modalTitle: document.getElementById("modalTitle"),
  modalBody: document.getElementById("modalBody"),
  modalBuyBtn: document.getElementById("modalBuyBtn"),
  closeModalBtn: document.getElementById("closeModalBtn")
};

const state = {
  selectedFamily: "",
  visibleItems: DEFAULT_VISIBLE_ITEMS,
  searchTimeoutId: null,
  lastFocusedElement: null
};

function formatPrice(value) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}

function normalizeText(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function formatWhatsAppPhone(phone) {
  const digits = phone.replace(/\D/g, "");

  if (digits.length === 13 && digits.startsWith("55")) {
    return `+${digits.slice(0, 2)} (${digits.slice(2, 4)}) ${digits.slice(4, 9)}-${digits.slice(9)}`;
  }

  if (digits.length === 12 && digits.startsWith("55")) {
    return `+${digits.slice(0, 2)} (${digits.slice(2, 4)}) ${digits.slice(4, 8)}-${digits.slice(8)}`;
  }

  return phone;
}

function createMetaPill(text) {
  const pill = document.createElement("span");
  pill.className = "meta-pill";
  pill.textContent = text;
  return pill;
}

function createCollectionCard(item) {
  const card = document.createElement("article");
  card.className = "collection-card";

  const icon = document.createElement("div");
  icon.className = "collection-icon";
  icon.textContent = item.icon;
  icon.setAttribute("aria-hidden", "true");

  const title = document.createElement("h3");
  title.textContent = item.title;

  const description = document.createElement("p");
  description.className = "muted small";
  description.textContent = item.text;

  card.append(icon, title, description);
  return card;
}

function createProductCard(product) {
  const card = document.createElement("article");
  card.className = "product-card";

  const image = document.createElement("div");
  image.className = "product-image";
  image.textContent = product.name;
  image.setAttribute("aria-hidden", "true");

  const body = document.createElement("div");
  body.className = "product-body";

  const family = document.createElement("p");
  family.className = "product-family";
  family.textContent = product.family;

  const name = document.createElement("h3");
  name.className = "product-name";
  name.textContent = product.name;

  const description = document.createElement("p");
  description.className = "product-desc";
  description.textContent = product.description;

  const meta = document.createElement("div");
  meta.className = "product-meta";
  meta.append(createMetaPill(product.intensity));
  product.notes.forEach((note) => meta.append(createMetaPill(note)));

  const foot = document.createElement("div");
  foot.className = "product-foot";

  const price = document.createElement("span");
  price.className = "price";
  price.textContent = formatPrice(product.price);

  const buyButton = document.createElement("button");
  buyButton.type = "button";
  buyButton.className = "btn btn-primary open-modal-btn";
  buyButton.dataset.id = String(product.id);
  buyButton.textContent = "Comprar";
  buyButton.setAttribute("aria-label", `Comprar ${product.name} pelo WhatsApp`);

  foot.append(price, buyButton);
  body.append(family, name, description, meta, foot);
  card.append(image, body);

  return card;
}

function createEmptyState(message) {
  const emptyState = document.createElement("p");
  emptyState.className = "muted empty-state";
  emptyState.setAttribute("role", "status");
  emptyState.textContent = message;
  return emptyState;
}

function renderCollections() {
  if (!elements.collectionsGrid) {
    return;
  }

  const fragment = document.createDocumentFragment();
  collections.forEach((item) => fragment.append(createCollectionCard(item)));
  elements.collectionsGrid.replaceChildren(fragment);
}

function renderFeatured() {
  if (!elements.featuredGrid) {
    return;
  }

  const fragment = document.createDocumentFragment();
  products.slice(0, DEFAULT_VISIBLE_ITEMS).forEach((product) => {
    fragment.append(createProductCard(product));
  });
  elements.featuredGrid.replaceChildren(fragment);
}

function renderFamilyChips() {
  if (!elements.familyChips) {
    return;
  }

  const fragment = document.createDocumentFragment();
  const families = [...new Set(products.map((item) => item.family))];

  families.forEach((familyName) => {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "chip";
    chip.dataset.family = familyName;
    chip.textContent = familyName;

    const isSelected = state.selectedFamily === familyName;
    chip.classList.toggle("active", isSelected);
    chip.setAttribute("aria-pressed", String(isSelected));

    fragment.append(chip);
  });

  elements.familyChips.replaceChildren(fragment);
}

function getFilteredProducts() {
  const searchTerm = normalizeText(elements.searchInput?.value.trim() || "");
  const maxPrice = Number(elements.priceRange?.value || DEFAULT_MAX_PRICE);
  const selectedIntensity = elements.intensitySelect?.value || "";
  const sortBy = elements.sortSelect?.value || "relevance";

  const filteredProducts = products.filter((product) => {
    const haystack = normalizeText(
      [product.name, product.family, product.intensity, product.description, product.notes.join(" ")].join(" ")
    );

    const matchesSearch = haystack.includes(searchTerm);
    const matchesFamily = state.selectedFamily ? product.family === state.selectedFamily : true;
    const matchesIntensity = selectedIntensity ? product.intensity === selectedIntensity : true;
    const matchesPrice = product.price <= maxPrice;

    return matchesSearch && matchesFamily && matchesIntensity && matchesPrice;
  });

  if (sortBy === "priceAsc") {
    filteredProducts.sort((first, second) => first.price - second.price);
  } else if (sortBy === "priceDesc") {
    filteredProducts.sort((first, second) => second.price - first.price);
  } else if (sortBy === "nameAsc") {
    filteredProducts.sort((first, second) => first.name.localeCompare(second.name, "pt-BR"));
  }

  return filteredProducts;
}

function renderProducts() {
  if (!elements.productsGrid) {
    return;
  }

  const filteredProducts = getFilteredProducts();
  const visibleProducts = filteredProducts.slice(0, state.visibleItems);

  if (filteredProducts.length === 0) {
    elements.productsGrid.replaceChildren(
      createEmptyState("Nenhum perfume encontrado com os filtros selecionados.")
    );
  } else {
    const fragment = document.createDocumentFragment();
    visibleProducts.forEach((product) => fragment.append(createProductCard(product)));
    elements.productsGrid.replaceChildren(fragment);
  }

  if (elements.resultsCount) {
    elements.resultsCount.textContent = String(filteredProducts.length);
  }

  if (elements.loadMoreBtn) {
    const hasMoreItems = filteredProducts.length > state.visibleItems;
    elements.loadMoreBtn.hidden = !hasMoreItems;
  }
}

function createInfoParagraph(label, value) {
  const paragraph = document.createElement("p");
  const strong = document.createElement("strong");

  strong.textContent = `${label}: `;
  paragraph.append(strong, value);

  return paragraph;
}

function getWhatsAppUrl(product) {
  const message = `Olá! Gostaria de encomendar o perfume ${product.name} (${product.family}) no valor de ${formatPrice(product.price)}.`;
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
}

function openModal(product, triggerButton) {
  if (!elements.productModal || !elements.modalTitle || !elements.modalBody || !elements.modalBuyBtn) {
    return;
  }

  state.lastFocusedElement = triggerButton || document.activeElement;

  elements.modalTitle.textContent = product.name;
  elements.modalBody.replaceChildren(
    createInfoParagraph("Família", product.family),
    createInfoParagraph("Intensidade", product.intensity),
    createInfoParagraph("Notas", product.notes.join(", ")),
    createInfoParagraph("Preço", formatPrice(product.price)),
    createInfoParagraph("Descrição", product.description)
  );

  elements.modalBuyBtn.href = getWhatsAppUrl(product);
  elements.modalBuyBtn.target = "_blank";
  elements.modalBuyBtn.rel = "noopener noreferrer";
  elements.modalBuyBtn.textContent = "Finalizar no WhatsApp";
  elements.modalBuyBtn.classList.add("btn-whatsapp");

  elements.productModal.classList.add("active");
  elements.productModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("no-scroll");

  window.setTimeout(() => {
    elements.closeModalBtn?.focus();
  }, 0);
}

function closeModal() {
  if (!elements.productModal || elements.productModal.getAttribute("aria-hidden") === "true") {
    return;
  }

  elements.productModal.classList.remove("active");
  elements.productModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("no-scroll");

  if (state.lastFocusedElement instanceof HTMLElement) {
    state.lastFocusedElement.focus();
  }
}

function getFocusableElements(container) {
  return [...container.querySelectorAll(
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), summary, [tabindex]:not([tabindex="-1"])'
  )].filter((element) => !element.hasAttribute("hidden"));
}

function handleDocumentKeydown(event) {
  const isModalOpen = elements.productModal?.getAttribute("aria-hidden") === "false";
  const isNavOpen = elements.siteNav?.classList.contains("open");

  if (event.key === "Escape") {
    if (isModalOpen) {
      closeModal();
      return;
    }

    if (isNavOpen) {
      setNavExpanded(false);
    }
  }

  if (!isModalOpen || event.key !== "Tab" || !elements.productModal) {
    return;
  }

  const focusableElements = getFocusableElements(elements.productModal);
  if (focusableElements.length === 0) {
    return;
  }

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  if (event.shiftKey && document.activeElement === firstElement) {
    event.preventDefault();
    lastElement.focus();
  } else if (!event.shiftKey && document.activeElement === lastElement) {
    event.preventDefault();
    firstElement.focus();
  }
}

function setNavExpanded(isOpen) {
  if (!elements.navToggle || !elements.siteNav) {
    return;
  }

  elements.siteNav.classList.toggle("open", isOpen);
  elements.navToggle.setAttribute("aria-expanded", String(isOpen));
  elements.navToggle.setAttribute(
    "aria-label",
    isOpen ? "Fechar menu principal" : "Abrir menu principal"
  );
}

function handleProductGridClick(event) {
  const button = event.target.closest(".open-modal-btn");
  if (!button) {
    return;
  }

  const productId = Number(button.dataset.id);
  const selectedProduct = products.find((item) => item.id === productId);
  if (!selectedProduct) {
    return;
  }

  openModal(selectedProduct, button);
}

function syncPriceLabel() {
  if (!elements.priceValue || !elements.priceRange) {
    return;
  }

  elements.priceValue.textContent = formatPrice(Number(elements.priceRange.value));
}

function syncContactLinks() {
  if (!elements.footerWhatsAppLink) {
    return;
  }

  elements.footerWhatsAppLink.href = `https://wa.me/${WHATSAPP_PHONE}`;
  elements.footerWhatsAppLink.target = "_blank";
  elements.footerWhatsAppLink.textContent = formatWhatsAppPhone(WHATSAPP_PHONE);
}

function resetFilters() {
  state.selectedFamily = "";
  state.visibleItems = DEFAULT_VISIBLE_ITEMS;

  if (elements.searchInput) {
    elements.searchInput.value = "";
  }

  if (elements.intensitySelect) {
    elements.intensitySelect.value = "";
  }

  if (elements.sortSelect) {
    elements.sortSelect.value = "relevance";
  }

  if (elements.priceRange) {
    elements.priceRange.value = String(DEFAULT_MAX_PRICE);
  }

  syncPriceLabel();
  renderFamilyChips();
  renderProducts();
}

function bindEvents() {
  elements.navToggle?.addEventListener("click", () => {
    const isOpen = elements.siteNav?.classList.contains("open");
    setNavExpanded(!isOpen);
  });

  elements.siteNav?.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      setNavExpanded(false);
    }
  });

  elements.priceRange?.addEventListener("input", () => {
    syncPriceLabel();
    state.visibleItems = DEFAULT_VISIBLE_ITEMS;
    renderProducts();
  });

  elements.searchInput?.addEventListener("input", () => {
    window.clearTimeout(state.searchTimeoutId);
    state.searchTimeoutId = window.setTimeout(() => {
      state.visibleItems = DEFAULT_VISIBLE_ITEMS;
      renderProducts();
    }, 250);
  });

  elements.intensitySelect?.addEventListener("change", () => {
    state.visibleItems = DEFAULT_VISIBLE_ITEMS;
    renderProducts();
  });

  elements.sortSelect?.addEventListener("change", renderProducts);
  elements.clearFiltersBtn?.addEventListener("click", resetFilters);

  elements.loadMoreBtn?.addEventListener("click", () => {
    state.visibleItems += DEFAULT_VISIBLE_ITEMS;
    renderProducts();
  });

  elements.familyChips?.addEventListener("click", (event) => {
    const chip = event.target.closest(".chip");
    if (!chip) {
      return;
    }

    const clickedFamily = chip.dataset.family || "";
    state.selectedFamily = state.selectedFamily === clickedFamily ? "" : clickedFamily;
    state.visibleItems = DEFAULT_VISIBLE_ITEMS;
    renderFamilyChips();
    renderProducts();
  });

  elements.featuredGrid?.addEventListener("click", handleProductGridClick);
  elements.productsGrid?.addEventListener("click", handleProductGridClick);
  elements.closeModalBtn?.addEventListener("click", closeModal);

  document.querySelectorAll("[data-close='true']").forEach((element) => {
    element.addEventListener("click", closeModal);
  });

  document.addEventListener("keydown", handleDocumentKeydown);

  const menuBreakpoint = window.matchMedia("(min-width: 861px)");
  const handleMenuBreakpointChange = (event) => {
    if (event.matches) {
      setNavExpanded(false);
    }
  };

  if (typeof menuBreakpoint.addEventListener === "function") {
    menuBreakpoint.addEventListener("change", handleMenuBreakpointChange);
  } else if (typeof menuBreakpoint.addListener === "function") {
    menuBreakpoint.addListener(handleMenuBreakpointChange);
  }
}

function init() {
  if (elements.yearEl) {
    elements.yearEl.textContent = String(new Date().getFullYear());
  }

  syncPriceLabel();
  syncContactLinks();
  renderCollections();
  renderFeatured();
  renderFamilyChips();
  renderProducts();
  bindEvents();
}

init();
