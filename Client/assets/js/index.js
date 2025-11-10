// assets/js/index.js

// Función para renderizar solo los restaurantes populares
function renderPopularRestaurants() {
  const restaurantsList = document.getElementById('restaurantsList');
  // Use restaurantData (global) as the authoritative dataset
  const data = Array.isArray(window.restaurantData) ? window.restaurantData : (Array.isArray(window.restaurants) ? window.restaurants : []);
  if (!restaurantsList || !Array.isArray(data)) return;

  console.log("Cantidad total de restaurantes:", data.length);

  // Limpiar contenedor
  restaurantsList.innerHTML = '';

  // Mostrar solo los 3 primeros restaurantes
  const restaurantesPopulares = data.slice(0, 3);

  restaurantesPopulares.forEach(r => {
    const img = r.img || r.imagen || (r.categories && r.categories[0] && r.categories[0].products && r.categories[0].products[0] && r.categories[0].products[0].image) || '';
    const title = r.name || r.nombre || '';
    const desc = r.description || r.descripcion || '';
    restaurantsList.innerHTML += `
      <div class="col-md-6 col-lg-4">
        <div class="card h-100 shadow-sm">
          <img src="${img}" class="card-img-top" alt="${title}">
          <div class="card-body">
            <h5 class="card-title">${title}</h5>
            <p class="card-text text-muted">${desc}</p>
            <a href="restaurante.html?id=${r.id}" class="btn btn-primary w-100">Ver menú</a>
          </div>
        </div>
      </div>`;
  });
}

// Función para búsqueda
function buscarRestaurantes() {
  const query = document.getElementById('searchInput').value || '';
  const category = (document.getElementById('categoryFilter') && document.getElementById('categoryFilter').value) || '';

  const params = new URLSearchParams();
  if (query.trim()) params.set('search', query.trim());
  if (category) params.set('category', category);

  // Siempre vamos a restaurantes.html con los filtros como query params
  const url = 'restaurantes.html' + (params.toString() ? `?${params.toString()}` : '');
  window.location.href = url;
}

// Ejecutar cuando cargue la página
document.addEventListener('DOMContentLoaded', () => {
  renderPopularRestaurants();

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
});
