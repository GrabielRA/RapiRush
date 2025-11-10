/**
 * carrito.js - Manejo del carrito de compras
 * DeliveryApp
 */

// Clase para manejar el carrito
class ShoppingCart {
    constructor() {
        this.storageKey = 'cart';
        this.items = this.loadCart();
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
        return true;
    }

    // Actualizar cantidad de un item
    updateQuantity(index, change) {
        if (index >= 0 && index < this.items.length) {
            this.items[index].quantity += change;

            if (this.items[index].quantity <= 0) {
                this.removeItem(index);
            } else {
                this.saveCart();
            }
        }
    }

    // Remover item del carrito
    removeItem(index) {
        if (index >= 0 && index < this.items.length) {
            this.items.splice(index, 1);
            this.saveCart();
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
        const count = this.getTotalItems();
        
        countElements.forEach(element => {
            if (element) {
                element.textContent = count;
                
                // Animación de actualización
                element.classList.add('animate-bounce');
                setTimeout(() => {
                    element.classList.remove('animate-bounce');
                }, 500);
            }
        });
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

        const toastHTML = `
            <div id="${toastId}" class="toast" role="alert">
                <div class="toast-header ${bgColor} text-white">
                    <i class="bi bi-${icon} me-2"></i>
                    <strong class="me-auto">${type === 'success' ? '¡Éxito!' : type === 'error' ? 'Error' : 'Información'}</strong>
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
        
        // Si estamos en la página del carrito, recargar vista
        if (typeof loadCart === 'function') {
            loadCart();
        }
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



        // Cargar y mostrar items del carrito
        function loadCart() {
            const cart = JSON.parse(localStorage.getItem('cart') || '[]');
            const cartItemsContainer = document.getElementById('cart-items-container');
            const emptyMessage = document.getElementById('empty-cart-message');
            const orderSummary = document.getElementById('order-summary');
            const continueShopping = document.getElementById('continue-shopping');

            if (cart.length === 0) {
                emptyMessage.style.display = 'block';
                orderSummary.style.display = 'none';
                continueShopping.style.display = 'none';
                return;
            }

            emptyMessage.style.display = 'none';
            orderSummary.style.display = 'block';
            continueShopping.style.display = 'block';

            // Generar HTML de items
            let itemsHTML = '';
            cart.forEach((item, index) => {
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
                            </div>
                            <div class="col-md-2 text-center">
                                <p class="mb-0 fw-bold">S/. ${item.price.toFixed(2)}</p>
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
                                <p class="mb-0 fw-bold text-primary">S/. ${(item.price * item.quantity).toFixed(2)}</p>
                                <button class="btn btn-sm btn-link text-danger p-0" onclick="removeItem(${index})">
                                    <i class="bi bi-trash"></i> Eliminar
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            });

            cartItemsContainer.innerHTML = itemsHTML;
            updateOrderSummary();
            updateCartCount();
        }

        function updateQuantity(index, change) {
            const cart = JSON.parse(localStorage.getItem('cart') || '[]');
            cart[index].quantity += change;
            
            if (cart[index].quantity <= 0) {
                cart.splice(index, 1);
            }
            
            localStorage.setItem('cart', JSON.stringify(cart));
            loadCart();
        }

        function removeItem(index) {
            const cart = JSON.parse(localStorage.getItem('cart') || '[]');
            cart.splice(index, 1);
            localStorage.setItem('cart', JSON.stringify(cart));
            loadCart();
        }

        function updateOrderSummary() {
            const cart = JSON.parse(localStorage.getItem('cart') || '[]');
            const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            const deliveryFee = subtotal > 0 ? 5.00 : 0;
            const discount = 0;
            const total = subtotal + deliveryFee - discount;

            document.getElementById('subtotal').textContent = `S/. ${subtotal.toFixed(2)}`;
            document.getElementById('delivery-fee').textContent = `S/. ${deliveryFee.toFixed(2)}`;
            document.getElementById('discount').textContent = `- S/. ${discount.toFixed(2)}`;
            document.getElementById('total').textContent = `S/. ${total.toFixed(2)}`;
        }

        function updateCartCount() {
            const cart = JSON.parse(localStorage.getItem('cart') || '[]');
            const count = cart.reduce((total, item) => total + item.quantity, 0);
            document.getElementById('cart-count').textContent = count;
        }

        function applyPromoCode() {
            const promoCode = document.getElementById('promo-code').value;
            const promoMessage = document.getElementById('promo-message');
            
            // Simulación de validación de código
            if (promoCode.toUpperCase() === 'DESCUENTO10') {
                promoMessage.textContent = '¡Código aplicado! 10% de descuento';
                promoMessage.style.display = 'block';
                // Aquí aplicarías el descuento real
            } else if (promoCode) {
                promoMessage.textContent = 'Código inválido';
                promoMessage.className = 'text-danger';
                promoMessage.style.display = 'block';
            }
        }

        function proceedToCheckout() {
            const cart = JSON.parse(localStorage.getItem('cart') || '[]');
            if (cart.length === 0) {
                alert('Tu carrito está vacío');
                return;
            }
            window.location.href = 'checkout.html';
        }

        // Cargar carrito al iniciar
        loadCart();
   