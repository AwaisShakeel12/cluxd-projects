const state = {
  sites: [],
  category: "all",
  search: ""
};

const grid = document.getElementById("siteGrid");
const filters = document.getElementById("filters");
const searchInput = document.getElementById("searchInput");
const resultCount = document.getElementById("resultCount");
const emptyState = document.getElementById("emptyState");
const template = document.getElementById("cardTemplate");

function escapeText(value) {
  return String(value ?? "");
}

function renderFilters() {
  const categories = [...new Set(state.sites.map(site => site.category))]
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b));

  filters.innerHTML = "";

  const all = document.createElement("button");
  all.className = `filter-btn ${state.category === "all" ? "active" : ""}`;
  all.textContent = "All";
  all.addEventListener("click", () => {
    state.category = "all";
    render();
  });
  filters.appendChild(all);

  categories.forEach(category => {
    const button = document.createElement("button");
    button.className = `filter-btn ${state.category === category ? "active" : ""}`;
    button.textContent = category;
    button.addEventListener("click", () => {
      state.category = category;
      render();
    });
    filters.appendChild(button);
  });
}

function getFilteredSites() {
  const query = state.search.trim().toLowerCase();

  return state.sites.filter(site => {
    const categoryMatch =
      state.category === "all" || site.category === state.category;

    const searchMatch =
      !query ||
      site.name.toLowerCase().includes(query) ||
      site.category.toLowerCase().includes(query) ||
      (site.description || "").toLowerCase().includes(query);

    return categoryMatch && searchMatch;
  });
}

function renderCards() {
  const sites = getFilteredSites();
  grid.innerHTML = "";

  resultCount.textContent =
    `${sites.length} website${sites.length === 1 ? "" : "s"} found`;

  emptyState.classList.toggle("hidden", sites.length !== 0);

  sites.forEach(site => {
    const fragment = template.content.cloneNode(true);

    const iframe = fragment.querySelector(".preview");
    const category = fragment.querySelector(".category");
    const name = fragment.querySelector(".site-name");
    const description = fragment.querySelector(".description");
    const link = fragment.querySelector(".view-btn");

    iframe.src = site.url;
    iframe.title = `${site.name} preview`;

    category.textContent = escapeText(site.category);
    name.textContent = escapeText(site.name);
    description.textContent =
      escapeText(site.description) || "HTML website template.";

    link.href = site.url;

    grid.appendChild(fragment);
  });
}

function render() {
  renderFilters();
  renderCards();
}

async function loadCatalog() {
  try {
    const response = await fetch(`catalog.json?v=${Date.now()}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    state.sites = await response.json();
    render();
  } catch (error) {
    console.error(error);
    resultCount.textContent = "Could not load website catalog.";
    grid.innerHTML = "";
  }
}

searchInput.addEventListener("input", event => {
  state.search = event.target.value;
  renderCards();
});

loadCatalog();
