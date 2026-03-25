const makeSelect = document.getElementById("makeSelect");
const modelSelect = document.getElementById("modelSelect");
const yearSelect = document.getElementById("yearSelect");
const sortSelect = document.getElementById("sortSelect");
const resetBtn = document.getElementById("resetBtn");
const productGrid = document.getElementById("productGrid");
const resultsCount = document.getElementById("resultsCount");
const selectionSummary = document.getElementById("selectionSummary");
const stepMake = document.getElementById("stepMake");
const stepModel = document.getElementById("stepModel");
const stepYear = document.getElementById("stepYear");

function populateMakes() {
  makeSelect.innerHTML = '<option value="">Choose Make</option>';
  vehicleData.forEach((entry) => {
    const option = document.createElement("option");
    option.value = entry.make;
    option.textContent = entry.make;
    makeSelect.appendChild(option);
  });
}

function populateModels(selectedMake) {
  modelSelect.innerHTML = '<option value="">Choose Model</option>';
  yearSelect.innerHTML = '<option value="">Choose Year</option>';
  yearSelect.disabled = true;

  if (!selectedMake) {
    modelSelect.disabled = true;
    return;
  }

  const makeEntry = vehicleData.find((entry) => entry.make === selectedMake);
  if (!makeEntry) return;

  makeEntry.models.forEach((model) => {
    const option = document.createElement("option");
    option.value = model.name;
    option.textContent = model.name;
    modelSelect.appendChild(option);
  });

  modelSelect.disabled = false;
}

function populateYears(selectedMake, selectedModel) {
  yearSelect.innerHTML = '<option value="">Choose Year</option>';

  if (!selectedMake || !selectedModel) {
    yearSelect.disabled = true;
    return;
  }

  const makeEntry = vehicleData.find((entry) => entry.make === selectedMake);
  if (!makeEntry) return;

  const modelEntry = makeEntry.models.find((model) => model.name === selectedModel);
  if (!modelEntry) return;

  modelEntry.years.forEach((year) => {
    const option = document.createElement("option");
    option.value = year;
    option.textContent = year;
    yearSelect.appendChild(option);
  });

  yearSelect.disabled = false;
}

function parsePrice(priceText) {
  return Number(priceText.replace("$", ""));
}

function getFilteredProducts() {
  const make = makeSelect.value;
  const model = modelSelect.value;
  const year = yearSelect.value;

  // Backend mapping note:
  // These values mirror what a real API query can accept, e.g.
  // /products?vehicle_make=Traxxas&vehicle_model=Slash%204x4&vehicle_year=2024
  // A backend can then join products -> fitment table and return only compatible SKUs.
  const filtered = products.filter((product) => {
    const matchMake = !make || product.make === make;
    const matchModel = !model || product.model === model;
    const matchYear = !year || product.year === year;
    return matchMake && matchModel && matchYear;
  });

  return sortProducts(filtered, sortSelect.value);
}

function sortProducts(items, mode) {
  const sorted = [...items];

  if (mode === "priceLow") {
    return sorted.sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
  }

  if (mode === "priceHigh") {
    return sorted.sort((a, b) => parsePrice(b.price) - parsePrice(a.price));
  }

  if (mode === "title") {
    return sorted.sort((a, b) => a.title.localeCompare(b.title));
  }

  // "featured" keeps editorial sequence from API response.
  return sorted;
}

function stockBadgeClass(stock) {
  if (stock === "In Stock") return "in-stock";
  if (stock === "Low Stock") return "low-stock";
  return "backorder";
}

function renderProducts() {
  const filtered = getFilteredProducts();
  productGrid.innerHTML = "";

  if (!filtered.length) {
    productGrid.innerHTML = `
      <div class="empty-state">
        <strong>No exact matches yet.</strong><br />
        Try a different year/model or open the legacy filters for broader matching.
      </div>
    `;
    resultsCount.textContent = "0 products found";
    updateSummary();
    updateStepState();
    updateUrl();
    return;
  }

  filtered.forEach((product) => {
    const card = document.createElement("article");
    card.className = "product-card";
    card.innerHTML = `
      <div class="product-media">${product.category}</div>
      <div class="product-body">
        <h3 class="product-title">${product.title}</h3>
        <p class="product-fitment">Fits ${product.make} • ${product.model} • ${product.year}</p>
        <div class="product-price-row">
          <div class="product-price">${product.price}</div>
          <div class="product-sku">SKU: ${product.sku}</div>
        </div>
        <div class="badge-row">
          <span class="badge ${stockBadgeClass(product.stock)}">${product.stock}</span>
          <span class="badge">${product.category}</span>
        </div>
        <button type="button" class="product-action">View Part</button>
      </div>
    `;
    productGrid.appendChild(card);
  });

  resultsCount.textContent = `${filtered.length} product${filtered.length === 1 ? "" : "s"} found`;
  updateSummary();
  updateStepState();
  updateUrl();
}

function updateSummary() {
  const make = makeSelect.value;
  const model = modelSelect.value;
  const year = yearSelect.value;

  if (!make && !model && !year) {
    selectionSummary.textContent = "No vehicle selected yet.";
    return;
  }

  if (make && !model) {
    selectionSummary.textContent = `Selected make: ${make}. Next step: choose a model.`;
    return;
  }

  if (make && model && !year) {
    selectionSummary.textContent = `Selected ${make} → ${model}. Next step: choose a year.`;
    return;
  }

  selectionSummary.textContent = `Selected vehicle: ${make} → ${model} → ${year}. Showing exact-fit products.`;
}

function updateStepState() {
  const make = Boolean(makeSelect.value);
  const model = Boolean(modelSelect.value);
  const year = Boolean(yearSelect.value);

  stepMake.className = "step-chip";
  stepModel.className = "step-chip";
  stepYear.className = "step-chip";

  stepMake.classList.add(make ? "is-done" : "is-active");

  if (make && !model) {
    stepModel.classList.add("is-active");
  } else if (model) {
    stepModel.classList.add("is-done");
  }

  if (model && !year) {
    stepYear.classList.add("is-active");
  } else if (year) {
    stepYear.classList.add("is-done");
  }
}

function updateUrl() {
  const params = new URLSearchParams();

  if (makeSelect.value) params.set("make", makeSelect.value);
  if (modelSelect.value) params.set("model", modelSelect.value);
  if (yearSelect.value) params.set("year", yearSelect.value);
  if (sortSelect.value !== "featured") params.set("sort", sortSelect.value);

  const query = params.toString();
  const newUrl = `${window.location.pathname}${query ? `?${query}` : ""}`;
  window.history.replaceState({}, "", newUrl);
}

function loadFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const make = params.get("make");
  const model = params.get("model");
  const year = params.get("year");
  const sort = params.get("sort");

  if (sort && ["featured", "priceLow", "priceHigh", "title"].includes(sort)) {
    sortSelect.value = sort;
  }

  if (make) {
    makeSelect.value = make;
    populateModels(make);
  }

  if (model) {
    modelSelect.value = model;
    populateYears(make, model);
  }

  if (year) {
    yearSelect.value = year;
  }
}

function resetFinder() {
  makeSelect.value = "";
  modelSelect.innerHTML = '<option value="">Choose Model</option>';
  modelSelect.disabled = true;
  yearSelect.innerHTML = '<option value="">Choose Year</option>';
  yearSelect.disabled = true;
  sortSelect.value = "featured";
  renderProducts();
}

makeSelect.addEventListener("change", () => {
  populateModels(makeSelect.value);
  renderProducts();
});

modelSelect.addEventListener("change", () => {
  populateYears(makeSelect.value, modelSelect.value);
  renderProducts();
});

yearSelect.addEventListener("change", renderProducts);
sortSelect.addEventListener("change", renderProducts);
resetBtn.addEventListener("click", resetFinder);

populateMakes();
loadFromUrl();
updateStepState();
renderProducts();
