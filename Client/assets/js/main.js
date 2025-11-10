// assets/js/main.js

// Actualizar contador del carrito
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const count = cart.reduce((total, item) => total + (item.quantity || 0), 0);
  const cartBadge = document.getElementById('cart-count');
  if (cartBadge) cartBadge.textContent = count;
}

// Inicialización cuando carga el DOM
document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();

  // Solo ejecutar el código de detalle si estamos en la página de restaurante
  const categoriesContainer = document.getElementById('categories-container');
  if (!categoriesContainer) {
    // No estamos en la vista de detalle: salir
    return;
  }

  // Obtener restaurantId de URL
  const params = new URLSearchParams(window.location.search);
  const restaurantId = parseInt(params.get('id'), 10);
  if (Number.isNaN(restaurantId)) {
    document.body.innerHTML = '<h2 class="text-center mt-5">Restaurante no encontrado</h2>';
    return;
  }

  // Buscar en restaurantData (archivo que contiene menús por restaurante)
  const restaurant = (typeof restaurantData !== 'undefined') ? restaurantData.find(r => r.id === restaurantId) : null;

  if (!restaurant) {
    document.body.innerHTML = '<h2 class="text-center mt-5">Restaurante no encontrado</h2>';
    return;
  }

  // Renderizar título y categorías
  document.title = restaurant.name;
  const nameEl = document.getElementById('restaurant-name');
  const nameHeaderEl = document.getElementById('restaurant-name-header');
  if (nameEl) nameEl.textContent = restaurant.name;
  if (nameHeaderEl) nameHeaderEl.textContent = restaurant.name;

  // Renderizar cada categoría y sus productos
  restaurant.categories.forEach(category => {
    const section = document.createElement('section');
    section.className = "mb-5";
    section.innerHTML = `
      <h3 class="mb-3"><i class="${category.icon} me-2"></i> ${category.name}</h3>
      <div class="row" id="${category.id}"></div>
    `;
    categoriesContainer.appendChild(section);

    const row = section.querySelector('.row');
    category.products.forEach(product => {
      const col = document.createElement('div');
      col.className = "col-md-6 col-lg-4 mb-4";
      col.innerHTML = `
        <div class="card shadow-sm h-100">
          <img src="${product.image}" class="card-img-top" alt="${product.name}">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">${product.name}</h5>
            <p class="card-text text-muted">${product.description || ''}</p>
            <div class="mt-auto d-flex justify-content-between align-items-center">
              <h6 class="text-primary mb-0">S/. ${Number(product.price).toFixed(2)}</h6>
              <button class="btn btn-sm btn-primary" onclick="openProductModal('${escapeForOnclick(product.name)}', ${Number(product.price)}, '${escapeForOnclick(product.description || '')}', '${escapeForOnclick(product.image)}')">
                <i class="bi bi-cart-plus"></i>
              </button>
            </div>
          </div>
        </div>
      `;
      row.appendChild(col);
    });
  });
});

// --- Modal de producto avanzado ---
let currentProduct = null;
let currentQty = 1;
let currentSizeExtra = 0;

function openProductModal(name, price, description, image) {
  currentProduct = { name, price, description, image, basePrice: Number(price) };
  currentQty = 1;
  currentSizeExtra = 0;

  // Elementos del modal
  const nameEl = document.getElementById('modalProductName');
  const descEl = document.getElementById('modalProductDescription');
  const imgEl = document.getElementById('modalProductImage');
  const qtyEl = document.getElementById('modal-quantity');
  const totalEl = document.getElementById('modal-total-price');
  const notesEl = document.getElementById('product-notes');

  // Resetear campos
  if (nameEl) nameEl.textContent = name;
  if (descEl) descEl.textContent = description;
  if (imgEl) imgEl.src = image;
  if (qtyEl) qtyEl.value = currentQty;
  if (notesEl) notesEl.value = '';
  if (totalEl) totalEl.textContent = currentProduct.basePrice.toFixed(2);

  // Resetear radios de tamaño
  document.querySelectorAll('input[name="size"]').forEach(radio => radio.checked = radio.id === 'size-small');

  // Mostrar modal
  const modalEl = document.getElementById('productModal');
  if (modalEl) new bootstrap.Modal(modalEl).show();

  // Escuchar cambios de tamaño
  document.querySelectorAll('input[name="size"]').forEach(radio => {
    radio.onchange = () => {
      currentSizeExtra = Number(radio.value);
      updateModalTotal();
    };
  });
}

// --- Cambiar cantidad ---
function changeModalQuantity(delta) {
  const qtyEl = document.getElementById('modal-quantity');
  currentQty = Math.max(1, currentQty + delta);
  qtyEl.value = currentQty;
  updateModalTotal();
}

// --- Actualizar total ---
function updateModalTotal() {
  const totalEl = document.getElementById('modal-total-price');
  const total = (currentProduct.basePrice + currentSizeExtra) * currentQty;
  if (totalEl) totalEl.textContent = total.toFixed(2);
}

// --- Agregar al carrito ---
function addFromModal() {
  if (!currentProduct) return;

  const notes = document.getElementById('product-notes').value.trim();
  const sizeRadio = document.querySelector('input[name="size"]:checked');
  const sizeLabel = sizeRadio ? sizeRadio.nextElementSibling.textContent : 'Personal';
  const total = (currentProduct.basePrice + currentSizeExtra) * currentQty;

  const cart = JSON.parse(localStorage.getItem('cart') || '[]');

  // Crear nuevo producto con opciones
  const item = {
    name: currentProduct.name,
    price: currentProduct.basePrice,
    size: sizeLabel,
    extra: currentSizeExtra,
    quantity: currentQty,
    total: total,
    notes: notes,
    image: currentProduct.image
  };

  cart.push(item);
  localStorage.setItem('cart', JSON.stringify(cart));

  updateCartCount();
  alert(`Agregado: ${item.name} (${item.size}) x${item.quantity}`);

  // Cerrar modal
  const modalEl = document.getElementById('productModal');
  if (modalEl) bootstrap.Modal.getInstance(modalEl)?.hide();
}



// Utilidad para escapar strings antes de inyectarlos en onclick (evita comillas sin escapar)
function escapeForOnclick(str) {
  return String(str).replace(/'/g, "\\'").replace(/"/g, '\\"');
}
