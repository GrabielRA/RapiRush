// assets/js/index.js - VERSIÓN SIMPLIFICADA

// Mostrar restaurantes populares
function renderPopularRestaurants() {
  const data = getBaseRestaurantData().slice(0, 6);
  renderRestaurantsList(data, 'restaurantes-populares', true);
}

// Renderizar restaurantes en resultsContainer
function renderRestaurants(data) {
  renderRestaurantsList(data, 'resultsContainer');
}

// Buscar restaurantes
function buscarRestaurantes() {
  const query = document.getElementById('searchInput').value.trim();
  const filtered = filterRestaurants(query);
  renderRestaurants(filtered);

  // Scroll a resultados
  const resultsContainer = document.getElementById('resultsContainer');
  if (resultsContainer) {
    resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}


// Filtrar por categoría
function filtrarPorCategoria(categoria) {
  const cat = categoria.trim().toLowerCase();
  const all = getBaseRestaurantData();

  // Categorías principales (puedes ajustar)
  const categoriasPrincipales = ["pollo","pizza",  "italiana", "postres", "hamburguesas", "sushi", "mexicana", "china", "comida china", "pollo"];

  if (cat === "mas" || cat === "más") {
    // Filtrar los que NO pertenezcan a las principales
    const filtered = all.filter(r => {
      const cats = (r.categories || "").toLowerCase();
      // Si ninguna categoría principal está incluida, lo mostramos
      return !categoriasPrincipales.some(c => cats.includes(c));
    });

    renderRestaurants(filtered);
    return;
  }

  // Caso normal: filtrar por la categoría elegida
  const filtered = filterRestaurants('', categoria);
  renderRestaurants(filtered);
}

// Inicializar eventos
document.addEventListener('DOMContentLoaded', () => {
  renderPopularRestaurants();
  renderRestaurants(getBaseRestaurantData());

  const searchInput = document.getElementById('searchInput');
  const searchButton = document.getElementById('searchButton');

  if (searchInput) {
    searchInput.addEventListener('keypress', e => {
      if (e.key === 'Enter') buscarRestaurantes();
    });
  }

  if (searchButton) {
    searchButton.addEventListener('click', buscarRestaurantes);
  }

  document.querySelectorAll('#categoryButtons button').forEach(btn => {
    btn.addEventListener('click', () => {
      const categoria = btn.getAttribute('data-category');
      filtrarPorCategoria(categoria);
    });
  });
});