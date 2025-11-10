// assets/js/index.js

// Mostrar solo los restaurantes populares (opcional)
function renderPopularRestaurants() {
  const restaurantsList = document.getElementById('restaurantsList');
  const data = Array.isArray(window.restaurantData)
    ? window.restaurantData
    : Array.isArray(window.restaurants)
    ? window.restaurants
    : [];

  if (!restaurantsList || !Array.isArray(data)) return;

  restaurantsList.innerHTML = '';
  const populares = data.slice(0, 3);

  populares.forEach(r => {
    const img = r.img || r.imagen || (r.categories?.[0]?.products?.[0]?.image) || '';
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

// Renderizar restaurantes en #resultsContainer
function renderRestaurants(data) {
  const container = document.getElementById('resultsContainer');
  container.innerHTML = '';

  if (!data || data.length === 0) {
    container.innerHTML = `<div class="col-12 text-center py-5"><h5>No se encontraron resultados.</h5></div>`;
    return;
  }

  data.forEach(r => {
    const col = document.createElement('div');
    col.className = 'col-md-6 col-lg-4';
    col.innerHTML = `
      <div class="card restaurant-card shadow-sm h-100">
        <img src="${r.img}" class="card-img-top" alt="${r.name}" onerror="this.onerror=null;this.src='assets/Img/basedatos.png';">
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-start mb-2">
            <h5 class="card-title mb-0">${r.name}</h5>
            <span class="badge bg-success"><i class="bi bi-star-fill"></i> ${r.rating} (${r.reviews})</span>
          </div>
          <div class="d-flex justify-content-between text-muted small mb-2">
            <div><i class="bi bi-tags"></i> ${Array.isArray(r.categories) ? r.categories.map(c => c.name || c.id || '').join(', ') : r.categories}</div>
            <div><i class="bi bi-geo-alt"></i> ${r.location || 'Ubicación'}</div>
            <div><i class="bi bi-clock"></i> ${r.deliveryTime}</div>
          </div>
          <div class="d-flex justify-content-between text-muted small mb-3">
            <div><i class="ri-motorbike-fill"></i> S/. ${r.deliveryCost?.toFixed(2) || '0.00'} delivery</div>
            <div>${r.isOpen ? '🟢 Abierto' : '🔴 Cerrado'}</div>
          </div>
          <a href="restaurante.html?id=${r.id}" class="btn btn-primary w-100">Ver menú</a>
        </div>
      </div>
    `;
    container.appendChild(col);
  });
}

// Buscar por texto
function buscarRestaurantes() {
  const query = document.getElementById('searchInput').value.trim().toLowerCase();

  const filtered = restaurants.filter(r => {
    const name = r.name?.toLowerCase() || '';
    const categories = Array.isArray(r.categories)
      ? r.categories.map(c => c.name || c.id || '').join(', ').toLowerCase()
      : r.categories?.toLowerCase() || '';
    return name.includes(query) || categories.includes(query);
  });

  renderRestaurants(filtered);

  // 👇 Scroll automático al contenedor de resultados
  const resultsContainer = document.getElementById('resultsContainer');
  if (resultsContainer) {
    resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}


// Filtrar por categoría
function filtrarPorCategoria(categoria) {
  const selected = categoria.toLowerCase();

  const filtered = restaurants.filter(r => {
    const cats = Array.isArray(r.categories)
      ? r.categories.map(c => c.name || c.id || '').join(', ').toLowerCase()
      : r.categories?.toLowerCase() || '';

    if (selected === '') return true;
    if (selected === 'otros') {
      return !['pollo', 'pizza', 'hamburguesa', 'sushi', 'postres', 'mexican', 'italian', 'chinese']
        .some(c => cats.includes(c));
    }
    return cats.includes(selected);
  });

  renderRestaurants(filtered);
}


// Inicializar eventos
document.addEventListener('DOMContentLoaded', () => {
  renderPopularRestaurants(); // opcional
  renderRestaurants(restaurants); // mostrar todos al inicio

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
