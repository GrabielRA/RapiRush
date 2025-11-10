// ===============================
// DeliveryApp - Orders Page Script
// ===============================

// Variables globales
let currentUser = null;

// Al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    const savedUser = localStorage.getItem('currentUser');

    // Verificar usuario
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateUserDisplay();
    } else {
        // Si no hay sesión activa, redirigir al inicio
        window.location.href = 'index.html';
        return;
    }

    // Inicializar pedidos
    initializeOrders();
});

// ===============================
// Mostrar nombre del usuario
// ===============================
function updateUserDisplay() {
    const userDisplay = document.getElementById('userNameDisplay');
    if (userDisplay && currentUser) {
        userDisplay.textContent = currentUser.name;
    }
}

// ===============================
// Cerrar sesión
// ===============================
function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

// ===============================
// Inicializar la página de pedidos
// ===============================
function initializeOrders() {
    loadUserOrders();
}

// ===============================
// Cargar pedidos del usuario
// ===============================
function loadUserOrders() {
    // Si más adelante agregas almacenamiento real, esto seguirá funcionando
    const orders = JSON.parse(localStorage.getItem('userOrders') || '[]');
    const ordersList = document.getElementById('userOrdersList');
    const emptyOrders = document.getElementById('emptyOrders');

    if (!ordersList || !emptyOrders) return;

    // 🔹 Mostrar siempre los pedidos de demostración (los del HTML)
    ordersList.style.display = 'block';
    emptyOrders.style.display = 'none';
}



// ===============================
// Filtrar pedidos por estado
// ===============================
function filterUserOrders(status) {
    // Actualizar botones activos
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => btn.classList.remove('active'));

    const activeButton = [...buttons].find(btn =>
        btn.textContent.toLowerCase().includes(status === 'all' ? 'todos' : status)
    );
    if (activeButton) activeButton.classList.add('active');

    // Mostrar u ocultar tarjetas de pedidos
    document.querySelectorAll('.user-order-card').forEach(card => {
        card.style.display = (status === 'all' || card.classList.contains(status)) ? 'block' : 'none';
    });
}
