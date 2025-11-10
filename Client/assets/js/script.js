// Global variables
let currentUser = null;
let restaurants = [];
let cart = [];
let currentModal = null;

// Mock data
const mockRestaurants = [
    {
        id: 1,
        name: "Pizza Palace",
        category: "pizza",
        location: "norte",
        rating: 4.5,
        deliveryTime: "25-35 min",
        deliveryFee: 3.00,
        image: "https://images.pexels.com/photos/2762942/pexels-photo-2762942.jpeg?auto=compress&cs=tinysrgb&w=400",
        menu: [
            { id: 101, name: "Pizza Margherita", price: 12.00, description: "Tomate, mozzarella y albahaca fresca" },
            { id: 102, name: "Pizza Pepperoni", price: 14.00, description: "Pepperoni con queso mozzarella" },
            { id: 103, name: "Pizza Hawaiana", price: 13.50, description: "Jamón, piña y queso" }
        ]
    },
    {
        id: 2,
        name: "Burger House",
        category: "burger",
        location: "centro",
        rating: 4.2,
        deliveryTime: "20-30 min",
        deliveryFee: 2.50,
        image: "https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=400",
        menu: [
            { id: 201, name: "Hamburguesa Clásica", price: 8.50, description: "Carne, lechuga, tomate, cebolla" },
            { id: 202, name: "Hamburguesa BBQ", price: 10.00, description: "Carne, salsa BBQ, cebolla caramelizada" },
            { id: 203, name: "Papas Fritas", price: 4.50, description: "Papas crujientes con sal" }
        ]
    },
     {
        id: 3,
        name: "Sushi Master",
        category: "sushi",
        location: "sur",
        rating: 4.8,
        deliveryTime: "30-40 min",
        deliveryFee: 4.00,
        image: "https://images.pexels.com/photos/357756/pexels-photo-357756.jpeg?auto=compress&cs=tinysrgb&w=400",
        menu: [
            { id: 301, name: "Combo Sushi (20 piezas)", price: 28.00, description: "Variedad de sushi fresco" },
            { id: 302, name: "Sashimi Salmón", price: 15.00, description: "Salmón fresco cortado finamente" },
            { id: 303, name: "Rollo California", price: 12.00, description: "Cangrejo, aguacate, pepino" }
        ]
    },
];

// Mock users for demo
const mockUsers = {
    'usuario@demo.com': { password: '123456', name: 'Usuario Demo', role: 'user' },
    'admin@demo.com': { password: 'admin123', name: 'Administrador', role: 'admin' }
};

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateUserDisplay();
    }

    const protectedPages = ['dashboard.html', 'orders.html', 'admin.html'];
    const currentPage = window.location.pathname.split('/').pop();
    
    if (protectedPages.includes(currentPage) && !currentUser) {
        window.location.href = 'index.html';
        return;
    }

    if (currentPage === 'admin.html' && (!currentUser || currentUser.role !== 'admin')) {
        alert('Acceso denegado.');
        window.location.href = 'dashboard.html';
        return;
    }

    if (currentPage === 'dashboard.html') initializeDashboard();
    else if (currentPage === 'admin.html') initializeAdmin();
    else if (currentPage === 'orders.html') initializeOrders();

    initializeFormHandlers();
});

// Authentication
function initializeFormHandlers() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) loginForm.addEventListener('submit', handleLogin);

    const registerForm = document.getElementById('registerForm');
    if (registerForm) registerForm.addEventListener('submit', handleRegister);
}

function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const isAdmin = document.getElementById('isAdmin').checked;

    if (mockUsers[email] && mockUsers[email].password === password) {
        const user = mockUsers[email];
        if (isAdmin && user.role !== 'admin') {
            alert('Credenciales de administrador incorrectas.');
            return;
        }
        currentUser = { email: email, name: user.name, role: user.role };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        window.location.href = (isAdmin && user.role === 'admin') ? 'admin.html' : 'dashboard.html';
    } else {
        alert('Credenciales incorrectas.');
    }
}

function handleRegister(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    if (password !== document.getElementById('confirmPassword').value) {
        alert('Las contraseñas no coinciden.');
        return;
    }
    if (mockUsers[email]) {
        alert('Este email ya está registrado.');
        return;
    }
    mockUsers[email] = { password: password, name: `${document.getElementById('firstName').value} ${document.getElementById('lastName').value}`, role: 'user' };
    alert('Registro exitoso. Ahora puedes iniciar sesión.');
    window.location.href = 'index.html';
}

function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

function updateUserDisplay() {
    document.querySelectorAll('#userNameDisplay, #adminNameDisplay').forEach(display => {
        if (display && currentUser) display.textContent = currentUser.name;
    });
}

// Dashboard functions
function initializeDashboard() {
    restaurants = [...mockRestaurants];
    loadRestaurants();
    updateCartDisplay();
    // Event listeners for search, filters, etc.
    document.getElementById('searchInput')?.addEventListener('input', filterRestaurants);
    document.getElementById('categoryFilter')?.addEventListener('change', filterRestaurants);
    document.getElementById('locationFilter')?.addEventListener('change', filterRestaurants);
}

function loadRestaurants(restaurantsToShow = restaurants) {
    const grid = document.getElementById('restaurantsGrid');
    if (!grid) return;
    grid.innerHTML = '';
    restaurantsToShow.forEach(restaurant => grid.appendChild(createRestaurantCard(restaurant)));
}

function createRestaurantCard(restaurant) {
    const card = document.createElement('div');
    card.className = 'restaurant-card fade-in';
    card.innerHTML = `
        <img src="${restaurant.image}" alt="${restaurant.name}" class="restaurant-image">
        <div class="restaurant-info">
            <div class="restaurant-header">
                <h3 class="restaurant-name">${restaurant.name}</h3>
                <div class="restaurant-rating">⭐ ${restaurant.rating}</div>
            </div>
            <div class="restaurant-details">
                <span>🕒 ${restaurant.deliveryTime}</span>
                <span>🚚 $${restaurant.deliveryFee.toFixed(2)}</span>
            </div>
            <div class="restaurant-menu">
                ${restaurant.menu.slice(0, 2).map(item => `
                    <div class="menu-item">
                        <div class="menu-item-header">
                            <span class="menu-item-name">${item.name}</span>
                            <span class="menu-item-price">$${item.price.toFixed(2)}</span>
                        </div>
                        <button class="add-to-cart" onclick="openProductModal(${restaurant.id}, ${item.id})">Agregar</button>
                    </div>
                `).join('')}
            </div>
        </div>`;
    return card;
}

function filterRestaurants() {
    const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || '';
    const category = document.getElementById('categoryFilter')?.value || '';
    const location = document.getElementById('locationFilter')?.value || '';
    
    let filtered = restaurants.filter(r => 
        (r.name.toLowerCase().includes(searchTerm) || r.category.toLowerCase().includes(searchTerm)) &&
        (!category || r.category === category) &&
        (!location || r.location === location)
    );
    loadRestaurants(filtered);
}

// Product modal
function openProductModal(restaurantId, itemId) {
    const restaurant = restaurants.find(r => r.id === restaurantId);
    const item = restaurant.menu.find(i => i.id === itemId);
    if (!restaurant || !item) return;

    currentModal = { restaurant, item, quantity: 1 };
    document.getElementById('modalProductName').textContent = item.name;
    document.getElementById('modalProductDescription').textContent = item.description;
    document.getElementById('modalProductImage').src = restaurant.image;
    updateModalPrice();
    document.getElementById('productModal').classList.add('show');
}

function closeModal() {
    document.getElementById('productModal').classList.remove('show');
    currentModal = null;
}

function changeModalQuantity(change) {
    if (!currentModal) return;
    currentModal.quantity = Math.max(1, currentModal.quantity + change);
    document.getElementById('modalQuantity').textContent = currentModal.quantity;
    updateModalPrice();
}

function updateModalPrice() {
    if (!currentModal) return;
    const price = currentModal.item.price * currentModal.quantity;
    document.getElementById('modalPrice').textContent = price.toFixed(2);
}

// Cart functions
function addToCartFromModal() {
    if (!currentModal) return;
    const { restaurant, item, quantity } = currentModal;
    const cartItem = {
        id: Date.now(),
        itemId: item.id,
        name: item.name,
        price: item.price,
        quantity: quantity,
        total: item.price * quantity,
        restaurantName: restaurant.name
    };
    cart.push(cartItem);
    updateCartDisplay();
    closeModal();
    showNotification('Producto agregado al carrito', 'success');
}

function updateCartDisplay() {
    const cartItems = document.getElementById('cartItems');
    const cartCount = document.getElementById('cartCount');
    const cartTotal = document.getElementById('cartTotal');
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (!cartItems) return;

    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center;">Tu carrito está vacío</p>';
        if(cartCount) cartCount.textContent = '0';
        if(cartTotal) cartTotal.textContent = '0.00';
        if(checkoutBtn) checkoutBtn.disabled = true;
        return;
    }
    
    let total = 0;
    let itemCount = 0;
    cartItems.innerHTML = '';
    cart.forEach(item => {
        total += item.total;
        itemCount += item.quantity;
        const cartItemElement = document.createElement('div');
        cartItemElement.className = 'cart-item';
        cartItemElement.innerHTML = `
            <div>
                <h4>${item.name}</h4>
                <small>${item.restaurantName}</small>
            </div>
            <div class="cart-item-controls">
                <span>${item.quantity} x $${item.price.toFixed(2)}</span>
                <strong style="margin-left: 10px;">$${item.total.toFixed(2)}</strong>
            </div>`;
        cartItems.appendChild(cartItemElement);
    });
    if(cartCount) cartCount.textContent = itemCount;
    if(cartTotal) cartTotal.textContent = total.toFixed(2);
    if(checkoutBtn) checkoutBtn.disabled = false;
}

function toggleCart() {
    document.getElementById('cartSidebar')?.classList.toggle('open');
}

function checkout() {
    if (cart.length === 0) return;
    const orders = JSON.parse(localStorage.getItem('userOrders') || '[]');
    orders.unshift({ id: '#' + Math.floor(10000 + Math.random() * 90000), items: [...cart], total: cart.reduce((sum, item) => sum + item.total, 0), status: 'pending' });
    localStorage.setItem('userOrders', JSON.stringify(orders));
    cart = [];
    updateCartDisplay();
    toggleCart();
    alert('¡Pedido realizado con éxito!');
    window.location.href = 'orders.html';
}

// Admin functions
function initializeAdmin() {
    showSection('dashboard');
    updateUserDisplay();
}

function showSection(sectionName) {
    document.querySelectorAll('.admin-section').forEach(section => section.classList.remove('active'));
    document.getElementById(sectionName + '-section')?.classList.add('active');
    document.querySelectorAll('.sidebar-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[onclick="showSection('${sectionName}')"]`)?.classList.add('active');
}

function filterOrders(status) {
    document.querySelectorAll('.order-card').forEach(card => {
        card.style.display = (status === 'all' || card.classList.contains(status)) ? 'block' : 'none';
    });
}

function updateOrderStatus(orderId, newStatus) {
    if (confirm(`¿Cambiar estado del pedido ${orderId} a "${newStatus}"?`)) {
        showNotification(`Pedido ${orderId} actualizado a ${newStatus}`, 'success');
    }
}

function assignDelivery(orderId) {
    if (confirm(`¿Asignar repartidor al pedido ${orderId}?`)) {
        showNotification(`Pedido ${orderId} asignado`, 'success');
    }
}

function showAddRestaurantModal() { alert('Funcionalidad para agregar restaurante - En desarrollo'); }
function showAddDeliveryModal() { alert('Funcionalidad para agregar repartidor - En desarrollo'); }
function generateReport() { alert('Generando reporte... (demo)'); }


// Orders page functions
function initializeOrders() {
    updateUserDisplay();
    loadUserOrders();
}

function loadUserOrders() {
    const orders = JSON.parse(localStorage.getItem('userOrders') || '[]');
    const ordersList = document.getElementById('userOrdersList');
    const emptyOrders = document.getElementById('emptyOrders');
    
    if (orders.length === 0) {
        if (ordersList) ordersList.style.display = 'none';
        if (emptyOrders) emptyOrders.style.display = 'block';
    } else {
        if (ordersList) ordersList.style.display = 'block'; // En una app real, aquí se renderizarían los pedidos
        if (emptyOrders) emptyOrders.style.display = 'none';
    }
}

function filterUserOrders(status) {
    document.querySelectorAll('.user-order-card').forEach(card => {
        card.style.display = (status === 'all' || card.classList.contains(status)) ? 'block' : 'none';
    });
}

// Utility functions
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed; top: 20px; right: 20px; padding: 15px;
        background: ${type === 'success' ? '#28a745' : '#17a2b8'};
        color: white; border-radius: 8px; z-index: 10000;
        animation: slideInRight 0.3s ease-out;`;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.remove();
    }, 3000);
}