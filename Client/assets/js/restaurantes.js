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



// --- Código para renderizar las tarjetas solo en restaurantes.html ---
document.addEventListener('DOMContentLoaded', () => {
  const path = window.location.pathname;

  // Solo ejecuta si estamos en restaurantes.html
  if (path.includes('restaurantes.html')) {
    const restaurantsList = document.getElementById('restaurantsList');
    if (!restaurantsList) return;

    // Leer filtros desde query params
    const params = new URLSearchParams(window.location.search);
    const q = (params.get('search') || '').trim().toLowerCase();
    const categoryFilter = (params.get('category') || '').trim().toLowerCase();

    // Fuente de datos: restaurantData > window.restaurants > restaurants
    let base = Array.isArray(window.restaurantData)
      ? window.restaurantData.slice()
      : Array.isArray(window.restaurants)
      ? window.restaurants.slice()
      : Array.isArray(restaurants)
      ? restaurants.slice()
      : [];

    // Función que determina si un restaurante o alguno de sus productos coincide con la query
    function matchesQuery(restaurant, qstr) {
      if (!qstr) return true;
      const name = (restaurant.name || restaurant.nombre || '').toString().toLowerCase();
      const desc = (restaurant.description || restaurant.descripcion || '').toString().toLowerCase();
      if (name.includes(qstr) || desc.includes(qstr)) return true;

      // categorías (array o string)
      if (Array.isArray(restaurant.categories)) {
        for (const c of restaurant.categories) {
          const cname = (c.name || c.id || '').toString().toLowerCase();
          if (cname.includes(qstr)) return true;
          if (Array.isArray(c.products)) {
            for (const p of c.products) {
              const pname = (p.name || '').toString().toLowerCase();
              const pdesc = (p.description || '').toString().toLowerCase();
              if (pname.includes(qstr) || pdesc.includes(qstr)) return true;
            }
          }
        }
      } else if (restaurant.categories) {
        const cats = restaurant.categories.toString().toLowerCase();
        if (cats.includes(qstr)) return true;
      }

      return false;
    }

    // Filtrar según búsqueda y categoría
    let filtered = base.filter(r => matchesQuery(r, q));

    if (categoryFilter) {
      filtered = filtered.filter(r => {
        if (Array.isArray(r.categories)) {
          return r.categories.some(c => {
            const cname = (c.name || c.id || '').toString().toLowerCase();
            return cname.includes(categoryFilter) || categoryFilter.includes(cname);
          });
        }
        return (r.categories || '').toString().toLowerCase().includes(categoryFilter);
      });
    }

    // Si no hay resultados, mostrar mensaje
    if (filtered.length === 0) {
      restaurantsList.innerHTML = `
        <div class="col-12 text-center py-5">
          <h5>No se encontraron restaurantes que coincidan con tu búsqueda.</h5>
          <p class="text-muted">Prueba otro término o borra los filtros.</p>
        </div>`;
      return;
    }

    // Renderizar tarjetas
    filtered.forEach(r => {
      const col = document.createElement('div');
      col.className = 'col-md-6 col-lg-4';
      col.innerHTML = `
  <div class="card restaurant-card shadow-sm h-100">
    <img src="${r.img || r.imagen || ''}" class="card-img-top" alt="${r.name || r.nombre}"
         onerror="this.onerror=null;this.src='assets/Img/basedatos.png';">
    <div class="card-body">
      <div class="d-flex justify-content-between align-items-start mb-2">
        <h5 class="card-title mb-0">${r.name || r.nombre}</h5>
        <span class="badge bg-success">
          <i class="bi bi-star-fill"></i> ${r.rating || ''} ${r.reviews ? `(${r.reviews})` : ''}
        </span>
      </div>

      <!-- 🧩 Fila: categoría, ubicación, tiempo -->
      <div class="d-flex justify-content-between text-muted small mb-2">
        <div><i class="bi bi-tags"></i> ${Array.isArray(r.categories) ? r.categories.map(c => c.name || c.id || '').join(', ') : (r.categories || '')}</div>
        <div><i class="bi bi-geo-alt"></i> ${r.location || 'Ubicación no disponible'}</div>
        <div><i class="bi bi-clock"></i> ${r.deliveryTime || ''}</div>
      </div>

      <!-- 🧩 Fila: delivery y estado -->
      <div class="d-flex justify-content-between text-muted small mb-3">
        <div>🛵 S/. ${r.deliveryCost?.toFixed(2) || '0.00'} delivery</div>
        <div>${r.isOpen ? '🟢 Abierto' : '🔴 Cerrado'}</div>
      </div>

      <a href="restaurante.html?id=${r.id}" class="btn btn-primary w-100">Ver menú</a>
    </div>
  </div>
`;



      restaurantsList.appendChild(col);
    });
  }
});


document.addEventListener("DOMContentLoaded", () => {
  const popularesContainer = document.getElementById("restaurantes-populares");

  // Verificamos que el contenedor exista
  if (!popularesContainer) return;

  // Quitar clases de Bootstrap que rompen el centrado (ej. .row tiene márgenes negativos)
  popularesContainer.classList.remove('row');
  // Aseguramos un padding/margin neutro para que el wrapper centre correctamente
  popularesContainer.style.padding = '0';
  popularesContainer.style.margin = '0 auto';

  // Mostramos los 6 primeros restaurantes como "populares" (3 adicionales)
  // y los presentamos en un slider horizontal que se puede deslizar.
  const populares = restaurants.slice(0, 6);

  // Convertimos el contenedor en slider (clases para CSS)
  popularesContainer.classList.add('popular-slider');
  // Forzamos ancho 100% para que respete el max-width del wrapper
  popularesContainer.style.width = '100%';

  populares.forEach(r => {
    const item = document.createElement("div");
    item.className = "popular-item";
    item.innerHTML = `
      <div class="card restaurant-card shadow-sm h-100">
          <img src="${r.img}" class="card-img-top" alt="${r.name}">
          <div class="card-body">
              <div class="d-flex justify-content-between align-items-start mb-2">
                  <h5 class="card-title mb-0">${r.name}</h5>
                  <span class="badge bg-success">
                      <i class="bi bi-star-fill"></i> ${r.rating} (${r.reviews})
                  </span>
              </div>
              <p class="text-muted small mb-2">
                  <i class="bi bi-geo-alt"></i> ${r.categories}
              </p>
              <p class="text-muted small mb-3">
                  <i class="bi bi-clock"></i> ${r.deliveryTime} • S/. ${r.deliveryCost}.00 delivery
              </p>
              <a href="restaurante.html?id=${r.id}" class="btn btn-primary w-100">Ver menú</a>
          </div>
      </div>
    `;
    popularesContainer.appendChild(item);
  });

  // Envolver el contenedor en un wrapper para mejor control visual y botones superpuestos
  const sectionContainer = popularesContainer.parentElement; // el contenedor directo en index.html
  let wrap = document.querySelector('.popular-slider-wrap');
  if (!wrap && sectionContainer) {
    wrap = document.createElement('div');
    wrap.className = 'popular-slider-wrap';
    // Insertar el wrapper en el DOM en la posición donde estaba popularesContainer
    sectionContainer.insertBefore(wrap, popularesContainer);
    // Mover popularesContainer dentro del wrapper
    wrap.appendChild(popularesContainer);
  }

  // Crear botones prev/next (superpuestos) dentro del wrapper
  if (wrap) {
    let btnPrev = document.getElementById('popular-prev');
    let btnNext = document.getElementById('popular-next');

    if (!btnPrev) {
      btnPrev = document.createElement('button');
      btnPrev.id = 'popular-prev';
      btnPrev.className = 'slider-btn prev';
      btnPrev.title = 'Anterior';
      btnPrev.innerHTML = '<i class="bi bi-chevron-left"></i>';
      wrap.appendChild(btnPrev);
    }

    if (!btnNext) {
      btnNext = document.createElement('button');
      btnNext.id = 'popular-next';
      btnNext.className = 'slider-btn next';
      btnNext.title = 'Siguiente';
      btnNext.innerHTML = '<i class="bi bi-chevron-right"></i>';
      wrap.appendChild(btnNext);
    }

    const scrollAmount = () => Math.round(popularesContainer.clientWidth * 0.7);

    btnPrev.addEventListener('click', () => {
      popularesContainer.scrollBy({ left: -scrollAmount(), behavior: 'smooth' });
    });

    btnNext.addEventListener('click', () => {
      popularesContainer.scrollBy({ left: scrollAmount(), behavior: 'smooth' });
    });
  }

  console.log("Cantidad total de restaurantes:", restaurants.length);
});


