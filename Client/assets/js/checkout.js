// checkout.js - VERSIÓN ACTUALIZADA con limpieza de cupón

// Mostrar/ocultar sección de tarjeta
document.querySelectorAll('input[name="paymentMethod"]').forEach(radio => {
    radio.addEventListener('change', function() {
        const cardSection = document.getElementById('card-details-section');
        if (this.value === 'card') {
            cardSection.style.display = 'block';
        } else {
            cardSection.style.display = 'none';
        }
    });
});

// Formatear número de tarjeta
document.getElementById('cardNumber')?.addEventListener('input', function(e) {
    let value = e.target.value.replace(/\s/g, '');
    let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
    e.target.value = formattedValue;
});

// Formatear fecha de expiración
document.getElementById('cardExpiry')?.addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
        value = value.slice(0, 2) + '/' + value.slice(2, 4);
    }
    e.target.value = value;
});

// Cargar resumen del pedido
function loadOrderSummary() {
    const cart = window.cart ? window.cart.getItems() : [];
    
    if (cart.length === 0) {
        window.location.href = 'carrito.html';
        return;
    }

    const itemsList = document.getElementById('order-items-list');
    let itemsHTML = '';
    
    cart.forEach(item => {
        itemsHTML += `
            <div class="d-flex justify-content-between align-items-center mb-2">
                <div class="d-flex align-items-center">
                    <span class="badge bg-secondary me-2">${item.quantity}x</span>
                    <span class="small">${item.name}</span>
                </div>
                <span class="small fw-bold">S/. ${(item.price * item.quantity).toFixed(2)}</span>
            </div>
        `;
    });
    
    itemsList.innerHTML = itemsHTML;

    const subtotal = window.cart ? window.cart.getSubtotal() : 0;
    const deliveryFee = window.cart ? window.cart.getDeliveryFee() : 0;
    const discount = window.cart ? window.cart.getDiscount() : 0;
    const total = subtotal + deliveryFee - discount;

    document.getElementById('summary-subtotal').textContent = `S/. ${subtotal.toFixed(2)}`;
    document.getElementById('summary-delivery').textContent = `S/. ${deliveryFee.toFixed(2)}`;
    document.getElementById('summary-discount').textContent = `- S/. ${discount.toFixed(2)}`;
    document.getElementById('summary-total').textContent = `S/. ${total.toFixed(2)}`;
}

// Confirmar pedido
function confirmOrder() {
    const form = document.getElementById('checkout-form');
    
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
    
    if (paymentMethod === 'card') {
        const cardNumber = document.getElementById('cardNumber').value;
        const cardName = document.getElementById('cardName').value;
        const cardExpiry = document.getElementById('cardExpiry').value;
        const cardCvv = document.getElementById('cardCvv').value;
        
        if (!cardNumber || !cardName || !cardExpiry || !cardCvv) {
            alert('Por favor completa todos los datos de la tarjeta');
            return;
        }
    }

    // Generar número de pedido
    const orderNumber = Math.floor(100000 + Math.random() * 900000);
    document.getElementById('order-number').textContent = orderNumber;

    // ✅ PROCESAR PEDIDO Y LIMPIAR CUPÓN
    (function(){
        try{
            const cart = window.cart.getItems();
            const subtotal = window.cart.getSubtotal();
            const deliveryFee = window.cart.getDeliveryFee();
            const discount = window.cart.getDiscount();
            const total = subtotal + deliveryFee - discount;

            const user = window.Session && window.Session.getUser ? window.Session.getUser() : null;
            const nowTs = Date.now();
            const isoNow = new Date(nowTs).toISOString();

            var firstInterval = 2 * 60 * 1000;
            try{
                if(window.Session && window.Session.ORDER_PROGRESS_CONFIG && Array.isArray(window.Session.ORDER_PROGRESS_CONFIG.intervals)){
                    firstInterval = window.Session.ORDER_PROGRESS_CONFIG.intervals[0] || firstInterval;
                }
            }catch(e){ }

            const order = {
                id: orderNumber,
                date: isoNow,
                items: cart,
                subtotal: subtotal,
                delivery: deliveryFee,
                discount: discount,
                total: total,
                status: 'pendiente',
                email: (user && user.email) ? user.email : document.getElementById('email').value || null,
                name: (user && user.name) ? user.name : (document.getElementById('firstName').value + ' ' + document.getElementById('lastName').value),
                tracking: [
                    { step: 'Pedido recibido', key: 'received', description: 'Hemos recibido tu pedido', time: isoNow }
                ],
                nextStepAt: nowTs + firstInterval
            };

            if(window.Session && window.Session.addOrder){
                window.Session.addOrder(order);
            } else {
                if(order.email){
                    const key = 'orders_' + order.email.toLowerCase();
                    const existing = JSON.parse(localStorage.getItem(key) || '[]');
                    existing.unshift(order);
                    localStorage.setItem(key, JSON.stringify(existing));
                }
            }

            // ✅ LIMPIAR CUPÓN Y CARRITO DESPUÉS DEL PEDIDO
            window.cart.clearPromoCode();
            window.cart.clearCart();

        }catch(e){
            console.warn('Error saving order', e);
        }
    })();

    const modal = new bootstrap.Modal(document.getElementById('confirmModal'));
    modal.show();
}

// Cargar al iniciar
loadOrderSummary();