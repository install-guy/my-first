const makeSelect = document.getElementById("makeSelect");
const modelSelect = document.getElementById("modelSelect");
const yearSelect = document.getElementById("yearSelect");
const resetBtn = document.getElementById("resetBtn");
const productGrid = document.getElementById("productGrid");
const resultsCount = document.getElementById("resultsCount");
const selectionSummary = document.getElementById("selectionSummary");

function populateMakes() {
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

function getFilteredProducts() {
  const make = makeSelect.value;
  const model = modelSelect.value;
  const year = yearSelect.value;

  return products.filter((product) => {
    const matchMake = !make || product.make === make;
    const matchModel = !model || product.model === model;
    const matchYear = !year || product.year === year;
    return matchMake && matchModel && matchYear;
  });
}

function renderProducts() {
  const filtered = getFilteredProducts();
  productGrid.innerHTML = "";

  if (!filtered.length) {
    productGrid.innerHTML = `
      <div class="empty-state">
        No products matched this vehicle selection. In the real version, the user
        could still use the fallback filters underneath.
      </div>
    `;
    resultsCount.textContent = "0 products found";
    updateSummary();
    updateUrl();
    return;
  }

  filtered.forEach((product) => {
    const card = document.createElement("article");
    card.className = "product-card";
    card.innerHTML = `
      <h3>${product.title}</h3>
      <p class="product-meta">${product.make} • ${product.model} • ${product.year}</p>
      <div class="product-price">${product.price}</div>
      <div class="badge-row">
        <span class="badge">${product.stock}</span>
        <span class="badge">Compatible</span>
      </div>
    `;
    productGrid.appendChild(card);
  });

  resultsCount.textContent = `${filtered.length} product${filtered.length === 1 ? "" : "s"} found`;
  updateSummary();
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

  const bits = [make, model, year].filter(Boolean);
  selectionSummary.textContent = `Selected vehicle: ${bits.join(" → ")}`;
}

function updateUrl() {
  const params = new URLSearchParams();

  if (makeSelect.value) params.set("make", makeSelect.value);
  if (modelSelect.value) params.set("model", modelSelect.value);
  if (yearSelect.value) params.set("year", yearSelect.value);

  const newUrl = `${window.location.pathname}${params.toString() ? "?" + params.toString() : ""}`;
  window.history.replaceState({}, "", newUrl);
}

function loadFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const make = params.get("make");
  const model = params.get("model");
  const year = params.get("year");

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

yearSelect.addEventListener("change", () => {
  renderProducts();
});

resetBtn.addEventListener("click", resetFinder);

populateMakes();
loadFromUrl();
renderProducts();
