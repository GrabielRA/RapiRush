/**
 * carrito.js - Manejo del carrito de compras
 * DeliveryApp
 */

// Clase para manejar el carrito
class ShoppingCart {
    constructor() {
        this.storageKey = 'cart';
        this.items = this.loadCart();
        this.initializeEventListeners();
    }

    // Inicializar event listeners
    initializeEventListeners() {
        document.addEventListener('DOMContentLoaded', () => {
            this.updateCartCount();
            this.renderCart();
        });
    }

    // Renderizar carrito en la página (wrapper seguro para la función global loadCart)
    renderCart() {
        try {
            // Si existe la función loadCart (definida en este archivo para la página del carrito), llámala.
            if (typeof loadCart === 'function') {
                loadCart();
                return true;
            }
        } catch (error) {
            console.error('Error al renderizar el carrito:', error);
        }
        return false;
    }

    // Cargar carrito desde localStorage
    loadCart() {
        try {
            const cart = localStorage.getItem(this.storageKey);
            return cart ? JSON.parse(cart) : [];
        } catch (error) {
            console.error('Error al cargar el carrito:', error);
            return [];
        }
    }

    // Guardar carrito en localStorage
    saveCart() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.items));
            this.updateCartCount();
            this.renderCart();
            this.updateOrderSummaryDirect();
        } catch (error) {
            console.error('Error al guardar el carrito:', error);
        }
    }

    // Agregar item al carrito
    addItem(product) {
        const existingItem = this.items.find(
            item => item.name === product.name && 
                    item.restaurant === product.restaurant &&
                    item.notes === product.notes
        );

        if (existingItem) {
            existingItem.quantity += product.quantity || 1;
        } else {
            this.items.push({
                id: Date.now(),
                name: product.name,
                price: parseFloat(product.price),
                quantity: product.quantity || 1,
                image: product.image || 'https://via.placeholder.com/100',
                restaurant: product.restaurant,
                notes: product.notes || ''
            });
        }

        this.saveCart();
        this.updateCartCount();
        // Si estamos en la página del carrito, actualizar la vista
        if (document.getElementById('cart-items-container')) {
            loadCart();
        }
        return true;
    }

    // Actualizar cantidad de un item
    updateQuantity(index, change) {
        if (index >= 0 && index < this.items.length) {
            const item = this.items[index];
            const newQuantity = item.quantity + change;

            if (newQuantity <= 0) {
                this.removeItem(index);
            } else {
                item.quantity = newQuantity;
                // Actualizar cantidad en la interfaz inmediatamente
                const quantityElement = document.querySelector(`[data-index="${index}"] .quantity-control .fw-bold`);
                if (quantityElement) {
                    quantityElement.textContent = newQuantity;
                    CartUtils.animateElement(quantityElement, 'animate-bounce');
                }
                // Actualizar subtotal inmediatamente
                const subtotalElement = document.querySelector(`[data-index="${index}"] .text-primary`);
                if (subtotalElement) {
                    subtotalElement.textContent = CartUtils.formatPrice(item.price * newQuantity);
                    CartUtils.animateElement(subtotalElement, 'animate-pulse');
                }
                
                // Actualizar resumen inmediatamente
                this.updateOrderSummaryDirect();
                
                this.saveCart();
            }
        }
    }

    // Remover item del carrito
    removeItem(index) {
        if (index >= 0 && index < this.items.length) {
            const itemElement = document.querySelector(`[data-index="${index}"]`);
            if (itemElement) {
                // Animación de desvanecimiento
                itemElement.style.transition = 'all 0.3s ease';
                itemElement.style.transform = 'translateX(100%)';
                itemElement.style.opacity = '0';

                setTimeout(() => {
                    this.items.splice(index, 1);
                    // Actualizar resumen inmediatamente
                    this.updateOrderSummaryDirect();
                    this.saveCart();
                }, 300);
            } else {
                this.items.splice(index, 1);
                // Actualizar resumen inmediatamente
                this.updateOrderSummaryDirect();
                this.saveCart();
            }
        }
    }

    // Limpiar todo el carrito
    clearCart() {
        this.items = [];
        this.saveCart();
    }

    // Obtener total de items
    getTotalItems() {
        return this.items.reduce((total, item) => total + item.quantity, 0);
    }

    // Obtener subtotal
    getSubtotal() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    // Obtener costo de delivery
    getDeliveryFee() {
        const subtotal = this.getSubtotal();
        if (subtotal === 0) return 0;
        if (subtotal >= 50) return 0; // Delivery gratis para pedidos mayores a S/.50
        return 5.00;
    }

    // Obtener descuento
    getDiscount() {
        // Aquí puedes implementar lógica de descuentos
        return 0;
    }

    // Obtener total final
    getTotal() {
        return this.getSubtotal() + this.getDeliveryFee() - this.getDiscount();
    }

    // Actualizar contador en navbar
    updateCartCount() {
        const countElements = document.querySelectorAll('#cart-count, .cart-count');
        const count = this.items.reduce((total, item) => total + item.quantity, 0);
        
        countElements.forEach(element => {
            if (element) {
                if (element.textContent !== String(count)) {
                    element.textContent = count;
                    CartUtils.animateElement(element, 'animate-bounce');
                }
            }
        });
    }

    // Actualizar resumen del pedido directo (sin esperar saveCart)
    updateOrderSummaryDirect() {
        const elements = {
            subtotal: document.getElementById('subtotal'),
            deliveryFee: document.getElementById('delivery-fee'),
            discount: document.getElementById('discount'),
            total: document.getElementById('total')
        };

        if (!elements.subtotal) return;

        const subtotal = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const deliveryFee = subtotal > 50 ? 0 : 5.00; // Delivery gratis para pedidos mayores a S/50
        const discount = this.getActivePromo()?.value || 0;
        const total = subtotal + deliveryFee - discount;

        // Animar y actualizar cambios en los precios inmediatamente
        Object.entries({ 
            subtotal: subtotal,
            'delivery-fee': deliveryFee,
            discount: discount,
            total: total
        }).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) {
                const currentPrice = parseFloat(element.textContent.replace('S/. ', '')) || 0;
                if (currentPrice !== value) {
                    CartUtils.animateElement(element, 'animate-pulse');
                    element.textContent = CartUtils.formatPrice(value);
                }
            }
        });

        // Si el carrito está vacío, mostrar mensaje de carrito vacío
        const emptyMessage = document.getElementById('empty-cart-message');
        const orderSummary = document.getElementById('order-summary');
        const continueShopping = document.getElementById('continue-shopping');

        if (this.items.length === 0) {
            if (emptyMessage) emptyMessage.style.display = 'block';
            if (orderSummary) orderSummary.style.display = 'none';
            if (continueShopping) continueShopping.style.display = 'none';
        } else {
            if (emptyMessage) emptyMessage.style.display = 'none';
            if (orderSummary) orderSummary.style.display = 'block';
            if (continueShopping) continueShopping.style.display = 'block';
        }
    }

    // Validar si el carrito está vacío
    isEmpty() {
        return this.items.length === 0;
    }

    // Obtener items del carrito
    getItems() {
        return this.items;
    }

    // Aplicar código promocional
    applyPromoCode(code) {
        const validCodes = {
            'DESCUENTO10': { type: 'percentage', value: 10, description: '10% de descuento' },
            'PRIMERACOMPRA': { type: 'fixed', value: 15, description: 'S/. 15 de descuento' },
            'DELIVERY0': { type: 'delivery', value: 0, description: 'Delivery gratis' }
        };

        const promo = validCodes[code.toUpperCase()];
        
        if (promo) {
            // Guardar código promocional
            localStorage.setItem('promoCode', JSON.stringify(promo));
            return { success: true, promo };
        }

        return { success: false, message: 'Código inválido' };
    }

    // Obtener código promocional activo
    getActivePromo() {
        try {
            const promo = localStorage.getItem('promoCode');
            return promo ? JSON.parse(promo) : null;
        } catch {
            return null;
        }
    }

    // Remover código promocional
    removePromo() {
        localStorage.removeItem('promoCode');
    }
}

// Funciones de utilidad para animaciones y notificaciones
const CartUtils = {
    // Mostrar notificación toast
    showToast(message, type = 'success') {
        // Crear toast si no existe
        let toastContainer = document.getElementById('toast-container');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.id = 'toast-container';
            toastContainer.className = 'position-fixed bottom-0 end-0 p-3';
            toastContainer.style.zIndex = '11';
            document.body.appendChild(toastContainer);
        }

        const toastId = 'toast-' + Date.now();
        const bgColor = type === 'success' ? 'bg-success' : type === 'error' ? 'bg-danger' : 'bg-info';
        const icon = type === 'success' ? 'check-circle-fill' : type === 'error' ? 'x-circle-fill' : 'info-circle-fill';

        // Agregar badge de carrito al mensaje si es una operación de carrito
        const cartBadge = `<span class="badge bg-light text-dark ms-2" id="toast-cart-count"></span>`;
        const cartIcon = type === 'success' ? '<i class="bi bi-cart-plus-fill me-2"></i>' : '';

        const toastHTML = `
            <div id="${toastId}" class="toast" role="alert">
                <div class="toast-header ${bgColor} text-white">
                    ${cartIcon}<i class="bi bi-${icon} me-2"></i>
                    <strong class="me-auto">${type === 'success' ? '¡Éxito!' : type === 'error' ? 'Error' : 'Información'}</strong>
                    ${type === 'success' ? cartBadge : ''}
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast"></button>
                </div>
                <div class="toast-body">
                    ${message}
                </div>
            </div>
        `;

        toastContainer.insertAdjacentHTML('beforeend', toastHTML);
        
        const toastElement = document.getElementById(toastId);
        const toast = new bootstrap.Toast(toastElement, { delay: 3000 });
        toast.show();

        // Remover del DOM después de ocultarse
        toastElement.addEventListener('hidden.bs.toast', () => {
            toastElement.remove();
        });
    },

    // Confirmar acción
    confirm(message, callback) {
        if (window.confirm(message)) {
            callback();
        }
    },

    // Formatear precio
    formatPrice(price) {
        return `S/. ${parseFloat(price).toFixed(2)}`;
    },

    // Animar elemento
    animateElement(element, animationClass) {
        element.classList.add(animationClass);
        setTimeout(() => {
            element.classList.remove(animationClass);
        }, 500);
    }
};

// Inicializar carrito global
let cart = new ShoppingCart();

// Función global para agregar al carrito (compatible con onclick en HTML)
function addToCart(name, price, image, restaurant = 'Restaurante') {
    cart.addItem({
        name: name,
        price: price,
        image: image,
        restaurant: restaurant,
        quantity: 1
    });
    CartUtils.showToast('Producto agregado al carrito');
}

// Función global para actualizar cantidad
function updateQuantity(index, change) {
    cart.updateQuantity(index, change);
    
    // Si estamos en la página del carrito, recargar vista
    if (typeof loadCart === 'function') {
        loadCart();
    }
}

// Función global para remover item
function removeItem(index) {
    CartUtils.confirm('¿Estás seguro de eliminar este producto?', () => {
        cart.removeItem(index);
        CartUtils.showToast('Producto eliminado', 'info');
        // No recargamos la vista aquí: el método removeItem de la clase llama a saveCart()
        // que a su vez llama a renderCart() después de actualizar items (respeta la animación).
    });
}

// Actualizar contador al cargar cualquier página
document.addEventListener('DOMContentLoaded', () => {
    cart.updateCartCount();
});

// Exportar para uso en otros scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ShoppingCart, CartUtils };
}



// Función para cargar y mostrar items del carrito en la página de carrito
function loadCart() {
    const cartItemsContainer = document.getElementById('cart-items-container');
    const emptyMessage = document.getElementById('empty-cart-message');
    const orderSummary = document.getElementById('order-summary');
    const continueShopping = document.getElementById('continue-shopping');

    // Si no estamos en la página del carrito, salir
    if (!cartItemsContainer) return;

    const items = cart.getItems();

        // Si no hay items, reconstruir el contenido del contenedor con el mensaje de carrito vacío
        if (items.length === 0) {
            cartItemsContainer.innerHTML = `
                <div class="text-center py-5" id="empty-cart-message">
                    <i class="bi bi-cart-x display-1 text-muted"></i>
                    <h4 class="mt-3">Tu carrito está vacío</h4>
                    <p class="text-muted">Agrega productos de tus restaurantes favoritos</p>
                    <a href="index.html" class="btn btn-primary mt-3">
                        <i class="bi bi-shop"></i> Explorar restaurantes
                    </a>
                </div>
            `;

            if (orderSummary) orderSummary.style.display = 'none';
            if (continueShopping) continueShopping.style.display = 'none';

            // Actualizar resumen y contador aunque el carrito esté vacío
            cart.updateCartCount();
            cart.updateOrderSummaryDirect();

            return;
        }

    if (emptyMessage) emptyMessage.style.display = 'none';
    if (orderSummary) orderSummary.style.display = 'block';
    if (continueShopping) continueShopping.style.display = 'block';

    // Generar HTML de items
    let itemsHTML = '';
    items.forEach((item, index) => {
        itemsHTML += `
            <div class="cart-item" data-index="${index}">
                <div class="row align-items-center">
                    <div class="col-md-2">
                        <img src="${item.image || 'https://via.placeholder.com/100'}" 
                             class="img-fluid rounded" alt="${item.name}">
                    </div>
                    <div class="col-md-4">
                        <h6 class="mb-1">${item.name}</h6>
                        <small class="text-muted">${item.restaurant}</small>
                        ${item.notes ? `<p class="text-muted small mt-1"><i class="bi bi-card-text"></i> ${item.notes}</p>` : ''}
                    </div>
                    <div class="col-md-2 text-center">
                        <p class="mb-0 fw-bold">${CartUtils.formatPrice(item.price)}</p>
                    </div>
                    <div class="col-md-2">
                        <div class="quantity-control">
                            <button class="btn btn-sm btn-outline-secondary" onclick="updateQuantity(${index}, -1)">
                                <i class="bi bi-dash"></i>
                            </button>
                            <span class="fw-bold">${item.quantity}</span>
                            <button class="btn btn-sm btn-outline-secondary" onclick="updateQuantity(${index}, 1)">
                                <i class="bi bi-plus"></i>
                            </button>
                        </div>
                    </div>
                    <div class="col-md-2 text-end">
                        <p class="mb-0 fw-bold text-primary">${CartUtils.formatPrice(item.price * item.quantity)}</p>
                        <button class="btn btn-sm btn-link text-danger p-0" onclick="removeItem(${index})">
                            <i class="bi bi-trash"></i> Eliminar
                        </button>
                    </div>
                </div>
                <hr class="my-3">
            </div>
        `;
    });

    cartItemsContainer.innerHTML = itemsHTML;
    cart.updateOrderSummaryDirect();
}

// Función para aplicar código promocional
function applyPromoCode() {
    const promoCode = document.getElementById('promo-code').value;
    const promoMessage = document.getElementById('promo-message');
    
    if (!promoCode) return;

    const result = cart.applyPromoCode(promoCode);
    
    if (result.success) {
        promoMessage.textContent = `¡Código aplicado! ${result.promo.description}`;
        promoMessage.className = 'text-success';
        CartUtils.showToast('Código promocional aplicado correctamente', 'success');
        cart.updateOrderSummaryDirect();
    } else {
        promoMessage.textContent = result.message;
        promoMessage.className = 'text-danger';
        CartUtils.showToast('Código promocional inválido', 'error');
    }
    promoMessage.style.display = 'block';
}

// Función para proceder al checkout
function proceedToCheckout() {
    if (cart.isEmpty()) {
        CartUtils.showToast('Tu carrito está vacío', 'error');
        return;
    }
    window.location.href = 'checkout.html';
}

// Cargar carrito al iniciar
document.addEventListener('DOMContentLoaded', () => {
    loadCart();
    cart.updateCartCount();
});