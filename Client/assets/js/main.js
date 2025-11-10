// assets/js/main.js - VERSIÓN OPTIMIZADA

if (!window.AuthSystem) {
    console.warn('AuthSystem no está disponible');
}
// ❌ ELIMINADO: función updateCartCount() duplicada
// ✅ AHORA usa window.cart.updateCartCount()

// Inicialización cuando carga el DOM
document.addEventListener('DOMContentLoaded', () => {
  // ✅ USAR window.cart en lugar de función duplicada
  if (window.cart && typeof window.cart.updateCartCount === 'function') {
    window.cart.updateCartCount();
  }

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
  let restaurant = null;
  if (typeof restaurantData !== 'undefined' && Array.isArray(restaurantData)) {
    restaurant = restaurantData.find(r => r.id === restaurantId) || null;
  }

  // Fallback: si no está en restaurantData, buscar en el array simple `restaurants`
  if (!restaurant && typeof restaurants !== 'undefined' && Array.isArray(restaurants)) {
    restaurant = restaurants.find(r => r.id === restaurantId) || null;
    // Si encontramos en el array simple, normalizar su estructura para que tenga categories
    if (restaurant) {
      if (!Array.isArray(restaurant.categories)) {
        // si categories existe como string, transformarlo a una categoría vacía (los productos pueden estar en restaurant.products)
        restaurant.categories = [
          {
            id: 'menu',
            name: restaurant.categories || 'Menú',
            icon: 'bi bi-list',
            products: Array.isArray(restaurant.products) ? restaurant.products : []
          }
        ];
      }
    }
  }

  if (!restaurant) {
    console.error('Restaurante no encontrado en restaurantData ni en restaurants. id=', restaurantId);
    document.body.innerHTML = '<h2 class="text-center mt-5">Restaurante no encontrado</h2>';
    return;
  }

  // DEBUG: mostrar qué objeto de restaurante se cargó
  console.log('Detalle restaurante cargado:', JSON.parse(JSON.stringify(restaurant)));
  try {
    const catCount = Array.isArray(restaurant.categories) ? restaurant.categories.length : 0;
    console.log('Número de categorías:', catCount);
  } catch (e) {
    console.warn('No se pudo leer categories:', e);
  }

  // Renderizar título y categorías
  document.title = restaurant.name;
  const nameEl = document.getElementById('restaurant-name');
  const nameHeaderEl = document.getElementById('restaurant-name-header');
  if (nameEl) nameEl.textContent = restaurant.name;
  if (nameHeaderEl) nameHeaderEl.textContent = restaurant.name;

  // Renderizar cada categoría y sus productos
  const categories = Array.isArray(restaurant.categories) ? restaurant.categories : [];
  if (categories.length === 0) {
    const emptyMsg = document.createElement('div');
    emptyMsg.className = 'text-center py-5';
    emptyMsg.innerHTML = '<h5>No hay productos disponibles en este restaurante.</h5>';
    categoriesContainer.appendChild(emptyMsg);
    return;
  }

  categories.forEach(category => {
    const section = document.createElement('section');
    section.className = "mb-5";
    section.innerHTML = `
      <h3 class="mb-3"><i class="${category.icon} me-2"></i> ${category.name}</h3>
      <div class="row" id="${category.id}"></div>
    `;
    categoriesContainer.appendChild(section);

    const row = section.querySelector('.row');
    // obtener info extra del restaurante (rating, deliveryTime) si está disponible
    const siteInfo = (typeof restaurants !== 'undefined') ? restaurants.find(r => r.id === restaurant.id) : null;
    const ratingText = siteInfo ? `${siteInfo.rating} (${siteInfo.reviews})` : '';
    const deliveryTimeText = siteInfo ? siteInfo.deliveryTime : '';

  category.products.forEach(product => {
    const col = document.createElement('div');
    col.className = "col-12 col-md-6 col-lg-4 mb-4";

    // Obtener el precio base del producto
    const basePrice = product.basePrice || (product.sizes ? product.sizes.personal : product.price || 0);

    // Preparar tamaños de forma segura para el onclick (evitar .replace sobre undefined)
    const sizesSafe = product.sizes ? JSON.stringify(product.sizes).replace(/"/g, '&quot;') : 'null';
    const escapedName = escapeForOnclick(product.name || '');
    const escapedDesc = escapeForOnclick(product.description || '');
    const escapedImage = escapeForOnclick(product.image || '');
    const escapedRestaurant = escapeForOnclick(restaurant.name || '');


    col.innerHTML = `
    <div class="restaurant-card shadow-sm h-100">
      <img loading="lazy" src="${product.image || ''}" class="w-100" alt="${product.name || ''}" onerror="this.onerror=null;this.src='assets/Img/basedatos.png';">
      <div class="card-body">
        <h5 class="mb-1">${product.name || ''} <span class="badge bg-secondary text-white ms-2">${category.name}</span></h5>
        <p class="text-small text-muted mb-2">${product.description || ''}</p>
        <div class="d-flex align-items-center justify-content-between mb-2 text-small text-muted">
          <div><i class="bi bi-star-fill text-warning"></i> ${product.rating || restaurant.rating || ''} ${product.reviews ? `(${product.reviews})` : restaurant.reviews ? `(${restaurant.reviews})` : ''}</div>
          <div><i class="bi bi-clock"></i> ${restaurant.deliveryTime || ''}</div>
        </div>
        <div class="d-flex justify-content-between align-items-center">
          <div>
            <div class="fw-bold">Desde S/ ${Number(basePrice).toFixed(2)}</div>
            <div class="text-small text-muted">Envío S/ ${restaurant.deliveryCost || '0'}.00</div>
          </div>
          <button class="btn btn-primary btn-sm"
  onclick="openProductModal('${escapedName}', ${basePrice}, '${escapedDesc}', '${escapedImage}', ${sizesSafe}, '${escapedRestaurant}')">
  <i class="bi bi-cart-plus"></i> Agregar
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

function openProductModal(name, price, description, image, sizes, restaurant) {
  currentProduct = { 
    name, 
    description, 
    image, 
    basePrice: Number(price),
    sizes: sizes,
    restaurant: restaurant
  };
  currentQty = 1;
  currentSizeExtra = 0;

  // Elementos del modal
  const nameEl = document.getElementById('modalProductName');
  const descEl = document.getElementById('modalProductDescription');
  const imgEl = document.getElementById('modalProductImage');
  const qtyEl = document.getElementById('modal-quantity');
  const totalEl = document.getElementById('modal-total-price');
  const notesEl = document.getElementById('product-notes');
  const sizesContainer = document.getElementById('sizes-container');

  // Resetear campos
  if (nameEl) nameEl.textContent = name;
  if (descEl) descEl.textContent = description;
  if (imgEl) imgEl.src = image;
  if (qtyEl) qtyEl.value = currentQty;
  if (notesEl) notesEl.value = '';

  // Actualizar opciones de tamaño
  if (sizesContainer && sizes) {
    sizesContainer.innerHTML = '';
    Object.entries(sizes).forEach(([size, price], index) => {
      const div = document.createElement('div');
      div.className = 'form-check';
      div.innerHTML = `
        <input class="form-check-input" type="radio" name="size" 
               id="size-${size}" value="${price}" 
               ${index === 0 ? 'checked' : ''}>
        <label class="form-check-label" for="size-${size}">
          ${size.charAt(0).toUpperCase() + size.slice(1)} - S/ ${price.toFixed(2)}
        </label>
      `;
      sizesContainer.appendChild(div);
    });

    // Establecer precio inicial basado en el primer tamaño
    const firstSize = Object.values(sizes)[0];
    currentProduct.basePrice = Number(firstSize);
    if (totalEl) totalEl.textContent = currentProduct.basePrice.toFixed(2);

    // Escuchar cambios de tamaño
    document.querySelectorAll('input[name="size"]').forEach(radio => {
      radio.onchange = () => {
        currentProduct.basePrice = Number(radio.value);
        updateModalTotal();
      };
    });
  } else if (totalEl) {
    totalEl.textContent = currentProduct.basePrice.toFixed(2);
  }

  // Mostrar modal
  const modalEl = document.getElementById('productModal');
  if (modalEl) new bootstrap.Modal(modalEl).show();
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
  const total = currentProduct.basePrice * currentQty;
  if (totalEl) totalEl.textContent = total.toFixed(2);
}

// --- Agregar al carrito ---
function addFromModal() {
    if (!currentProduct) return;

    const notes = document.getElementById('product-notes').value.trim();
    const sizeRadio = document.querySelector('input[name="size"]:checked');
    const sizeLabel = sizeRadio ? sizeRadio.nextElementSibling.textContent.split(' - ')[0].trim() : 'Personal';
    const total = currentProduct.basePrice * currentQty;

    // ✅ USAR window.cart EN LUGAR DE localStorage DIRECTO
    if (window.cart && typeof window.cart.addItem === 'function') {
        window.cart.addItem({
            name: currentProduct.name,
            price: currentProduct.basePrice,
            size: sizeLabel,
            quantity: currentQty,
            total: total,
            notes: notes,
            image: currentProduct.image,
            restaurant: currentProduct.restaurant || 'Restaurante'
        });
    } else {
        console.error('carrito.js no está cargado correctamente');
        // ❌ ELIMINADO: alert molesto
        return;
    }

    // ✅ USAR CartUtils.showToast EN LUGAR DE CÓDIGO DUPLICADO
    if (window.CartUtils && typeof window.CartUtils.showToast === 'function') {
        window.CartUtils.showToast('Producto agregado al carrito');
    } else {
        // ❌ ELIMINADO: alert de fallback
        // Solo mostrar en consola
        console.log('Producto agregado al carrito');
    }

    // Cerrar modal
    const modalEl = document.getElementById('productModal');
    if (modalEl) bootstrap.Modal.getInstance(modalEl)?.hide();
}

// Utilidad para escapar strings antes de inyectarlos en onclick (evita comillas sin escapar)
function escapeForOnclick(str) {
  return String(str).replace(/'/g, "\\'").replace(/"/g, '\\"');
}

// ===================================================
// 🔹 Cerrar sesión (válido para cualquier página)
// ===================================================
document.addEventListener("DOMContentLoaded", () => {
  const btnLogout = document.getElementById("btnLogout");
  if (btnLogout) {
    btnLogout.addEventListener("click", () => {
      // Limpiar datos del usuario
      localStorage.removeItem("usuarioActivo");
      localStorage.removeItem("pedidosCliente");
      
      // ✅ USAR window.cart.clearCart() EN LUGAR DE localStorage DIRECTO
      if (window.cart && typeof window.cart.clearCart === 'function') {
        window.cart.clearCart();
      } else {
        localStorage.removeItem("cart");
      }

      // Redirigir a la página de inicio o login
      window.location.href = "index.html";
    });
  }
});