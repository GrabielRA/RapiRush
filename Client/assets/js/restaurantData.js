// assets/js/restaurantData.js
const restaurantData = [
  // 1
  {
    id: 1,
    name: "La Pizzería Italiana",
    categories: [
      {
        id: "pizzas",
        name: "Pizzas",
        icon: "bi bi-pizza",
        products: [
          { name: "Margarita", description: "Tomate, queso mozzarella, albahaca", price: 25, image: "https://tse3.mm.bing.net/th/id/OIP.T03aJagv5g4JwoG0Di4gFwHaEb?rs=1&pid=ImgDetMain&o=7&rm=3" },
          { name: "Pepperoni", description: "Queso, pepperoni", price: 30, image: "https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg" }
        ]
      },
      { id: "bebidas", name: "Bebidas", icon: "bi bi-cup-straw", products: [{ name: "Coca Cola", description: "Refresco de 500ml", price: 5, image: "https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg" }] }
    ]
  },
  // 2
  {
    id: 2,
    name: "Burger House",
    categories: [
      { id: "hamburguesas", name: "Hamburguesas", icon: "bi bi-burger", products: [{ name: "Cheeseburger", description: "Carne, queso, lechuga, tomate", price: 20, image: "https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg" }, { name: "Veggie Burger", description: "Hamburguesa vegetariana", price: 18, image: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg" }] },
      { id: "bebidas", name: "Bebidas", icon: "bi bi-cup-straw", products: [{ name: "Fanta", description: "Refresco de naranja", price: 5, image: "https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg" }] }
    ]
  },
  // 3
  {
    id: 3,
    name: "Sushi Master",
    categories: [
      { id: "sushi", name: "Sushi", icon: "bi bi-snow", products: [{ name: "California Roll", description: "Cangrejo, aguacate, pepino", price: 35, image: "https://images.pexels.com/photos/357756/pexels-photo-357756.jpeg" }, { name: "Sashimi Salmón", description: "Salmón fresco", price: 40, image: "https://images.pexels.com/photos/357756/pexels-photo-357756.jpeg" }] },
      { id: "bebidas", name: "Bebidas", icon: "bi bi-cup-straw", products: [{ name: "Sake", description: "Bebida japonesa", price: 15, image: "https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg" }] }
    ]
  },
  // 4
  {
    id: 4,
    name: "Dulce Tentación",
    categories: [
      { id: "postres", name: "Postres", icon: "bi bi-cupcake", products: [{ name: "Tarta de Chocolate", description: "Deliciosa tarta casera", price: 18, image: "https://img.freepik.com/fotos-premium/cafe-espresso-doble-trozo-tarta_756748-9958.jpg" }] },
      { id: "cafes", name: "Cafés", icon: "bi bi-cup-fill", products: [{ name: "Cappuccino", description: "Con espuma de leche", price: 10, image: "https://img.freepik.com/fotos-premium/cafe-espresso-doble-trozo-tarta_756748-9958.jpg" }] }
    ]
  },
  // 5
  {
    id: 5,
    name: "Pollo Peruano",
    categories: [
      { id: "pollos", name: "Pollo a la brasa", icon: "bi bi-fire", products: [{ name: "Pollo entero", description: "A la brasa con papas", price: 45, image: "https://img.freepik.com/fotos-premium/pollo-a-la-brasa-frango-assado-peruano-com-lados_818261-24130.jpg" }] }
    ]
  },
  // 6
  {
    id: 6,
    name: "Sushi Express",
    categories: [
      { id: "sushi", name: "Sushi y Makis", icon: "bi bi-snow", products: [{ name: "Maki de Atún", description: "Atún fresco", price: 30, image: "https://png.pngtree.com/thumb_back/fw800/background/20231029/pngtree-variety-of-sushi-pieces-beautifully-presented-on-a-rustic-wooden-table-image_13741219.png" }] }
    ]
  },
  // 7
  {
    id: 7,
    name: "BurgerLand",
    categories: [
      { id: "hamburguesas", name: "Hamburguesas artesanales", icon: "bi bi-burger", products: [{ name: "Classic Burger", description: "Carne premium, queso, lechuga", price: 25, image: "https://th.bing.com/th/id/OIP.wLGvXc5J7z5rP9FF8g9MLQHaE7?o=7rm=3&rs=1&pid=ImgDetMain&o=7&rm=3" }] }
    ]
  },
  // 8
  {
    id: 8,
    name: "Pizza Bella",
    categories: [
      { id: "pizzas", name: "Pizzas y Pastas", icon: "bi bi-pizza", products: [{ name: "Pasta Alfredo", description: "Con salsa cremosa", price: 28, image: "https://tse4.mm.bing.net/th/id/OIP.hlxRxM2nCLrvYbmLKC2DMQHaEK?w=996&h=561&rs=1&pid=ImgDetMain&o=7&rm=3" }] }
    ]
  },
  // 9
  {
    id: 9,
    name: "Chifa Oriental",
    categories: [
      { id: "comida", name: "Comida china", icon: "bi bi-egg-fried", products: [{ name: "Arroz Chaufa", description: "Arroz frito con pollo", price: 22, image: "https://img.freepik.com/fotos-premium/cultura-comer-comida-oriental-palillos-como-cubiertos-tradicionales_201836-8325.jpg?w=2000" }] }
    ]
  },
  // 10
  {
    id: 10,
    name: "Taco Loco",
    categories: [
      { id: "tacos", name: "Tacos", icon: "bi bi-egg", products: [{ name: "Taco al Pastor", description: "Cerdo adobado con piña", price: 12, image: "https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg" }] }
    ]
  },
  // 11
  {
    id: 11,
    name: "La Parrilla Argentina",
    categories: [
      { id: "carnes", name: "Carnes", icon: "bi bi-basket", products: [{ name: "Bife de Chorizo", description: "Carne jugosa a la parrilla", price: 50, image: "https://images.pexels.com/photos/105827/pexels-photo-105827.jpeg" }] }
    ]
  },
  // 12
  {
    id: 12,
    name: "Veggie Delight",
    categories: [
      { id: "vegetariano", name: "Vegetariano", icon: "bi bi-leaf", products: [{ name: "Ensalada César", description: "Con pollo opcional", price: 15, image: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg" }] }
    ]
  },
  // 13
  {
    id: 13,
    name: "Curry Palace",
    categories: [
      { id: "india", name: "Curry", icon: "bi bi-bowl", products: [{ name: "Chicken Curry", description: "Pollo con salsa especiada", price: 35, image: "https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg" }] }
    ]
  },
  // 14
  {
    id: 14,
    name: "Pasta Fresca",
    categories: [
      { id: "italiana", name: "Italiana", icon: "bi bi-pizza", products: [{ name: "Spaghetti Carbonara", description: "Con panceta y queso", price: 25, image: "https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg" }] }
    ]
  },
  // 15
  {
    id: 15,
    name: "Donut Heaven",
    categories: [
      { id: "postres", name: "Postres y Dulces", icon: "bi bi-cupcake", products: [{ name: "Donut Glaseado", description: "Dulce y esponjoso", price: 8, image: "https://images.pexels.com/photos/31976170/pexels-photo-31976170.jpeg" }] }
    ]
  }
];
