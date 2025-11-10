// assets/js/index.js

// Función para renderizar solo los restaurantes populares
function renderPopularRestaurants() {
  const restaurantsList = document.getElementById('restaurantsList');
  if (!restaurantsList || !Array.isArray(restaurantes)) return;

  console.log("Cantidad total de restaurantes:", restaurantes.length);

  // Limpiar contenedor
  restaurantsList.innerHTML = '';

  // Mostrar solo los 3 primeros restaurantes
  const restaurantesPopulares = restaurantes.slice(0, 3);

  restaurantesPopulares.forEach(r => {
    restaurantsList.innerHTML += `
      <div class="col-md-6 col-lg-4">
        <div class="card h-100 shadow-sm">
          <img src="${r.imagen}" class="card-img-top" alt="${r.nombre}">
          <div class="card-body">
            <h5 class="card-title">${r.nombre}</h5>
            <p class="card-text text-muted">${r.descripcion}</p>
            <a href="restaurante.html?id=${r.id}" class="btn btn-primary w-100">Ver menú</a>
          </div>
        </div>
      </div>`;
  });
}

// Función para búsqueda
function buscarRestaurantes() {
  const query = document.getElementById('searchInput').value;
  if (query.trim()) {
    window.location.href = `restaurantes.html?search=${encodeURIComponent(query)}`;
  }
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
