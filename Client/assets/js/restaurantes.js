// assets/js/restaurantes.js - ARCHIVO CENTRAL PARA RENDERIZADO

const restaurants = [
  // --- 9 Restaurantes originales ---
  {
    id: 1,
    name: "La Pizzería Italiana",
    img: "https://tse3.mm.bing.net/th/id/OIP.T03aJagv5g4JwoG0Di4gFwHaEb?rs=1&pid=ImgDetMain&o=7&rm=3",
    rating: 4.8,
    reviews: 120,
    categories: "Pizza, Italiana",
    deliveryTime: "25-35 min",
    deliveryCost: 5,
    location: "Miraflores",     
    isOpen: true  
  },
  {
    id: 2,
    name: "Burger House",
    img: "https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=400",
    rating: 4.6,
    reviews: 980,
    categories: "Hamburguesas, Fast Food",
    deliveryTime: "20-30 min",
    deliveryCost: 4,location: "San Miguel",
    isOpen: false
  },
  {
    id: 3,
    name: "Sushi Master",
    img: "https://images.pexels.com/photos/357756/pexels-photo-357756.jpeg?auto=compress&cs=tinysrgb&w=400",
    rating: 4.9,
    reviews: 1200,
    categories: "Sushi, Japonesa",
    deliveryTime: "30-40 min",
    deliveryCost: 6,
    location: "San Isidro",
    isOpen: true
  },
  {
    id: 4,
    name: "Dulce Tentación",
    img: "https://img.freepik.com/fotos-premium/cafe-espresso-doble-trozo-tarta_756748-9958.jpg",
    rating: 4.9,
    reviews: 1200,
    categories: "Postres, Café",
    deliveryTime: "30-40 min",
    deliveryCost: 6,
    location: "Barranco",
    isOpen: true
  },
  {
    id: 5,
    name: "Pollo Peruano",
    img: "https://img.freepik.com/fotos-premium/pollo-a-la-brasa-frango-assado-peruano-com-lados_818261-24130.jpg",
    rating: 4.5,
    reviews: 1000,
    categories: "Pollo a la brasa",
    deliveryTime: "30-40 min",
    deliveryCost: 10,
    location: "Surco",
    isOpen: false
  },
  {
    id: 6,
    name: "Sushi Express",
    img: "https://png.pngtree.com/thumb_back/fw800/background/20231029/pngtree-variety-of-sushi-pieces-beautifully-presented-on-a-rustic-wooden-table-image_13741219.png",
    rating: 4.5,
    reviews: 1000,
    categories: "Sushi y Makis",
    deliveryTime: "30-40 min",
    deliveryCost: 10,
    location: "Jesús María",
    isOpen: true
  },
  {
    id: 7,
    name: "BurgerLand",
    img: "https://th.bing.com/th/id/OIP.wLGvXc5J7z5rP9FF8g9MLQHaE7?o=7rm=3&rs=1&pid=ImgDetMain&o=7&rm=3",
    rating: 4.5,
    reviews: 1000,
    categories:"hamburguesas",
    deliveryTime: "30-40 min",
    deliveryCost: 10,
    location: "Jesús María",
    isOpen: true
  },
  {
    id: 8,
    name: "Pizza Bella",
    img: "https://tse4.mm.bing.net/th/id/OIP.hlxRxM2nCLrvYbmLKC2DMQHaEK?w=996&h=561&rs=1&pid=ImgDetMain&o=7&rm=3",
    rating: 4.5,
    reviews: 760,
    categories: "Pizzas y pastas",
    deliveryTime: "30-40 min",
    deliveryCost: 10,
    location: "La Molina",
    isOpen: false
  },
  {
    id: 9,
    name: "Chifa Oriental",
    img: "https://img.freepik.com/fotos-premium/cultura-comer-comida-oriental-palillos-como-cubiertos-tradicionales_201836-8325.jpg?w=2000",
    rating: 4.3,
    reviews: 500,
    categories: "Comida china",
    deliveryTime: "30-40 min",
    deliveryCost: 10,
    location: "Callao",
    isOpen: true
  },

  //10
  {
    id: 10,
    name: "Taco Loco",
    img: "https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg?auto=compress&cs=tinysrgb&w=400",
    rating: 4.5,
    reviews: 210,
    categories: "Tacos, Mexicana",
    deliveryTime: "20-30 min",
    deliveryCost: 4,
    location: "Pueblo Libre",
    isOpen: true
  },
  {
    id: 11,
    name: "La Parrilla Argentina",
    img: "https://elporteno.es/wp-content/uploads/2022/01/PARRILLADA-EL-PORTEN%CC%83O-TERRAZA-1080x675.jpg",
    rating: 4.7,
    reviews: 340,
    categories: "Carnes, Parrilla",
    deliveryTime: "30-40 min",
    deliveryCost: 5,
    location: "San Isidro",
    isOpen: false
  },
  {
    id: 12,
    name: "Veggie Delight",
    img: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400",
    rating: 4.4,
    reviews: 150,
    categories: "Vegetariano, Saludable",
    deliveryTime: "15-25 min",
    deliveryCost: 3,
    location: "Lince",
    isOpen: true
  },
  {
    id: 13,
    name: "Curry Palace",
    img: "https://static.wixstatic.com/media/c990b7_2edd5ea8dce74b4db70bd8503933fd85~mv2.jpg/v1/fill/w_2500,h_1977,al_c/c990b7_2edd5ea8dce74b4db70bd8503933fd85~mv2.jpg",
    rating: 4.6,
    reviews: 430,
    categories: "India, Curry",
    deliveryTime: "25-35 min",
    deliveryCost: 4,
    location: "Magdalena",
    isOpen: true
  },
  {
    id: 14,
    name: "Pasta Fresca",
    img: "https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=400",
    rating: 4.7,
    reviews: 290,
    categories: "Italiana, Pasta",
    deliveryTime: "20-30 min",
    deliveryCost: 4,
    location: "Miraflores",
    isOpen: false
  },
  {
    id: 15,
    name: "Donut Heaven",
    img: "https://images.pexels.com/photos/31976170/pexels-photo-31976170.jpeg?auto=compress&cs=tinysrgb&w=400",
    rating: 4.8,
    reviews: 500,
    categories: "Postres, Dulces",
    deliveryTime: "10-20 min",
    deliveryCost: 2,
    location: "San Miguel",
    isOpen: true
  }
];




// === FUNCIONES UNIVERSALES DE RENDERIZADO ===

// Función para renderizar tarjetas de restaurante
function renderRestaurantCard(r, showPopular = false) {
  const img = r.img || r.imagen || '';
  const name = r.name || r.nombre || '';
  const rating = r.rating || '';
  const reviews = r.reviews || '';
  const categories = Array.isArray(r.categories) 
    ? r.categories.map(c => c.name || c.id || '').join(', ') 
    : r.categories || '';
  const location = r.location || 'Ubicación no disponible';
  const deliveryTime = r.deliveryTime || '';
  const deliveryCost = r.deliveryCost?.toFixed(2) || '0.00';
  const isOpen = r.isOpen;

  if (showPopular) {
    return `
      <div class="popular-item">
        <div class="card restaurant-card shadow-sm h-100">
          <img src="${img}" class="card-img-top" alt="${name}" onerror="this.onerror=null;this.src='assets/Img/basedatos.png';">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-start mb-2">
              <h5 class="card-title mb-0">${name}</h5>
              <span class="badge bg-success">
                <i class="bi bi-star-fill"></i> ${rating} ${reviews ? `(${reviews})` : ''}
              </span>
            </div>
            <p class="text-muted small mb-2">
              <i class="bi bi-geo-alt"></i> ${categories}
            </p>
            <p class="text-muted small mb-3">
              <i class="bi bi-clock"></i> ${deliveryTime} • S/. ${deliveryCost} delivery
            </p>
            <a href="restaurante.html?id=${r.id}" class="btn btn-primary w-100">Ver menú</a>
          </div>
        </div>
      </div>
    `;
  }

  return `
    <div class="col-md-6 col-lg-4">
      <div class="card restaurant-card shadow-sm h-100">
        <img src="${img}" class="card-img-top" alt="${name}" onerror="this.onerror=null;this.src='assets/Img/basedatos.png';">
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-start mb-2">
            <h5 class="card-title mb-0">${name}</h5>
            <span class="badge bg-success">
              <i class="bi bi-star-fill"></i> ${rating} ${reviews ? `(${reviews})` : ''}
            </span>
          </div>
          <div class="d-flex justify-content-between text-muted small mb-2">
            <div><i class="bi bi-tags"></i> ${categories}</div>
            <div><i class="bi bi-geo-alt"></i> ${location}</div>
            <div><i class="bi bi-clock"></i> ${deliveryTime}</div>
          </div>
          <div class="d-flex justify-content-between text-muted small mb-3">
            <div><i class="ri-motorbike-fill"></i> S/. ${deliveryCost} delivery</div>
            <div>${isOpen ? '🟢 Abierto' : '🔴 Cerrado'}</div>
          </div>
          <a href="restaurante.html?id=${r.id}" class="btn btn-primary w-100">Ver menú</a>
        </div>
      </div>
    </div>
  `;
}

// Renderizar lista de restaurantes
function renderRestaurantsList(data, containerId, showPopular = false) {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (!data || data.length === 0) {
    container.innerHTML = `
      <div class="col-12 text-center py-5">
        <h5>No se encontraron resultados.</h5>
        <p class="text-muted">Prueba otro término o borra los filtros.</p>
      </div>
    `;
    return;
  }

  if (showPopular) {
    container.innerHTML = data.map(r => renderRestaurantCard(r, true)).join('');
  } else {
    container.innerHTML = data.map(r => renderRestaurantCard(r, false)).join('');
  }
}

// Obtener datos base
function getBaseRestaurantData() {
  return Array.isArray(window.restaurantData)
    ? window.restaurantData
    : Array.isArray(window.restaurants)
    ? window.restaurants
    : Array.isArray(restaurants)
    ? restaurants
    : [];
}

// Filtrar restaurantes
function filterRestaurants(query = '', category = '') {
  const baseData = getBaseRestaurantData();
  const q = query.trim().toLowerCase();
  const catFilter = category.trim().toLowerCase();

  return baseData.filter(r => {
    // Filtro por texto
    if (q) {
      const name = (r.name || r.nombre || '').toString().toLowerCase();
      const desc = (r.description || r.descripcion || '').toString().toLowerCase();
      const cats = Array.isArray(r.categories) 
        ? r.categories.map(c => c.name || c.id || '').join(', ').toLowerCase()
        : (r.categories || '').toString().toLowerCase();

      if (!name.includes(q) && !desc.includes(q) && !cats.includes(q)) {
        return false;
      }
    }

    // Filtro por categoría
    if (catFilter) {
      const restaurantCats = Array.isArray(r.categories) 
        ? r.categories.map(c => (c.name || c.id || '').toString().toLowerCase())
        : [(r.categories || '').toString().toLowerCase()];

      if (!restaurantCats.some(cat => cat.includes(catFilter) || catFilter.includes(cat))) {
        return false;
      }
    }

    return true;
  });
}

// === INICIALIZACIÓN PARA RESTAURANTES.HTML ===
document.addEventListener('DOMContentLoaded', function() {
  // Solo ejecutar si estamos en restaurantes.html
  if (window.location.pathname.includes('restaurantes.html')) {
    const restaurantsList = document.getElementById('restaurantsList');
    if (!restaurantsList) return;

    // Leer filtros desde URL
    const params = new URLSearchParams(window.location.search);
    const query = params.get('search') || '';
    const category = params.get('category') || '';

    // Filtrar y renderizar
    const filtered = filterRestaurants(query, category);
    renderRestaurantsList(filtered, 'restaurantsList');
  }
});
