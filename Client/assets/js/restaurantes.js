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
    deliveryCost: 5
  },
  {
    id: 2,
    name: "Burger House",
    img: "https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=400",
    rating: 4.6,
    reviews: 980,
    categories: "Hamburguesas, Fast Food",
    deliveryTime: "20-30 min",
    deliveryCost: 4
  },
  {
    id: 3,
    name: "Sushi Master",
    img: "https://images.pexels.com/photos/357756/pexels-photo-357756.jpeg?auto=compress&cs=tinysrgb&w=400",
    rating: 4.9,
    reviews: 1200,
    categories: "Sushi, Japonesa",
    deliveryTime: "30-40 min",
    deliveryCost: 6
  },
  {
    id: 4,
    name: "Dulce Tentación",
    img: "https://img.freepik.com/fotos-premium/cafe-espresso-doble-trozo-tarta_756748-9958.jpg",
    rating: 4.9,
    reviews: 1200,
    categories: "Postres, Café",
    deliveryTime: "30-40 min",
    deliveryCost: 6
  },
  {
    id: 5,
    name: "Pollo Peruano",
    img: "https://img.freepik.com/fotos-premium/pollo-a-la-brasa-frango-assado-peruano-com-lados_818261-24130.jpg",
    rating: 4.5,
    reviews: 1000,
    categories: "Pollo a la brasa",
    deliveryTime: "30-40 min",
    deliveryCost: 10
  },
  {
    id: 6,
    name: "Sushi Express",
    img: "https://png.pngtree.com/thumb_back/fw800/background/20231029/pngtree-variety-of-sushi-pieces-beautifully-presented-on-a-rustic-wooden-table-image_13741219.png",
    rating: 4.5,
    reviews: 1000,
    categories: "Sushi y Makis",
    deliveryTime: "30-40 min",
    deliveryCost: 10
  },
  {
    id: 7,
    name: "BurgerLand",
    img: "https://th.bing.com/th/id/OIP.wLGvXc5J7z5rP9FF8g9MLQHaE7?o=7rm=3&rs=1&pid=ImgDetMain&o=7&rm=3",
    rating: 4.5,
    reviews: 1000,
    categories: "Hamburguesas artesanales",
    deliveryTime: "30-40 min",
    deliveryCost: 10
  },
  {
    id: 8,
    name: "Pizza Bella",
    img: "https://tse4.mm.bing.net/th/id/OIP.hlxRxM2nCLrvYbmLKC2DMQHaEK?w=996&h=561&rs=1&pid=ImgDetMain&o=7&rm=3",
    rating: 4.5,
    reviews: 760,
    categories: "Pizzas y pastas",
    deliveryTime: "30-40 min",
    deliveryCost: 10
  },
  {
    id: 9,
    name: "Chifa Oriental",
    img: "https://img.freepik.com/fotos-premium/cultura-comer-comida-oriental-palillos-como-cubiertos-tradicionales_201836-8325.jpg?w=2000",
    rating: 4.3,
    reviews: 500,
    categories: "Comida china",
    deliveryTime: "30-40 min",
    deliveryCost: 10
  },

  // --- 6 Restaurantes adicionales ---
  {
    id: 10,
    name: "Taco Loco",
    img: "https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg?auto=compress&cs=tinysrgb&w=400",
    rating: 4.5,
    reviews: 210,
    categories: "Tacos, Mexicana",
    deliveryTime: "20-30 min",
    deliveryCost: 4
  },
  {
    id: 11,
    name: "La Parrilla Argentina",
    img: "https://images.pexels.com/photos/105827/pexels-photo-105827.jpeg?auto=compress&cs=tinysrgb&w=400",
    rating: 4.7,
    reviews: 340,
    categories: "Carnes, Parrilla",
    deliveryTime: "30-40 min",
    deliveryCost: 5
  },
  {
    id: 12,
    name: "Veggie Delight",
    img: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400",
    rating: 4.4,
    reviews: 150,
    categories: "Vegetariano, Saludable",
    deliveryTime: "15-25 min",
    deliveryCost: 3
  },
  {
    id: 13,
    name: "Curry Palace",
    img: "https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg?auto=compress&cs=tinysrgb&w=400",
    rating: 4.6,
    reviews: 430,
    categories: "India, Curry",
    deliveryTime: "25-35 min",
    deliveryCost: 4
  },
  {
    id: 14,
    name: "Pasta Fresca",
    img: "https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=400",
    rating: 4.7,
    reviews: 290,
    categories: "Italiana, Pasta",
    deliveryTime: "20-30 min",
    deliveryCost: 4
  },
  {
    id: 15,
    name: "Donut Heaven",
    img: "https://images.pexels.com/photos/31976170/pexels-photo-31976170.jpeg?auto=compress&cs=tinysrgb&w=400",
    rating: 4.8,
    reviews: 500,
    categories: "Postres, Dulces",
    deliveryTime: "10-20 min",
    deliveryCost: 2
  }
];



// --- Código para renderizar las tarjetas solo en restaurantes.html ---
document.addEventListener('DOMContentLoaded', () => {
  const path = window.location.pathname;

  // Solo ejecuta si estamos en restaurantes.html
  if (path.includes('restaurantes.html')) {
    const restaurantsList = document.getElementById('restaurantsList');
    if (!restaurantsList) return;

    restaurants.forEach(r => {
      const col = document.createElement('div');
      col.className = 'col-md-6 col-lg-4';
      col.innerHTML = `
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
      restaurantsList.appendChild(col);
    });
  }
});
document.addEventListener("DOMContentLoaded", () => {
  const popularesContainer = document.getElementById("restaurantes-populares");

  // Verificamos que el contenedor exista
  if (!popularesContainer) return;

  // Mostramos solo los 3 primeros restaurantes como "populares"
  const populares = restaurants.slice(0, 3);

  populares.forEach(r => {
    const col = document.createElement("div");
    col.className = "col-md-6 col-lg-4";
    col.innerHTML = `
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
    popularesContainer.appendChild(col);
  });

  console.log("Cantidad total de restaurantes:", restaurants.length);
});


