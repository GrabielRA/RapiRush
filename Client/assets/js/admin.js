// ==========================
// DeliveryApp Admin Script
// ==========================

// Variables globales
let currentUser = null;

// Al cargar la página
document.addEventListener('DOMContentLoaded', function () {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateUserDisplay();
    }

    /*// Si no hay usuario logueado, redirigir al login
    const currentPage = window.location.pathname.split('/').pop();
    if (currentPage === 'admin.html' && (!currentUser || currentUser.role !== 'admin')) {
        alert('Acceso denegado. Inicia sesión como administrador.');
        window.location.href = '..\Client\auth\login.html';
        return;
    }*/

    // Inicializar panel
    initializeAdmin();
});

// ==========================
// Inicialización del panel
// ==========================
function initializeAdmin() {
    showSection('dashboard');
    updateUserDisplay();
}

// ==========================
// Navegación entre secciones
// ==========================
function showSection(sectionName) {
    // Ocultar todas las secciones
    document.querySelectorAll('.admin-section').forEach(section => section.classList.remove('active'));

    // Mostrar solo la seleccionada
    document.getElementById(sectionName + '-section')?.classList.add('active');

    // Actualizar el botón activo del menú lateral
    document.querySelectorAll('.sidebar-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[onclick="showSection('${sectionName}')"]`)?.classList.add('active');
}





// ==========================
// Gestión de pedidos
// ==========================
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
        showNotification(`Pedido ${orderId} asignado correctamente`, 'success');
    }
}

// ==========================
// Gestión de restaurantes y repartidores
// ==========================
function showAddRestaurantModal() {
    alert('Funcionalidad para agregar restaurante - En desarrollo');
}

function showAddDeliveryModal() {
    alert('Funcionalidad para agregar repartidor - En desarrollo');
}

// ==========================
// Reportes
// ==========================
function generateReport() {
    alert('Generando reporte... (demo)');
}

// ==========================
// Notificaciones visuales
// ==========================
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed; top: 20px; right: 20px; padding: 15px;
        background: ${type === 'success' ? '#28a745' : '#17a2b8'};
        color: white; border-radius: 8px; z-index: 10000;
        animation: slideInRight 0.3s ease-out;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}
