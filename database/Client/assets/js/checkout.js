// assets/js/checkout.js
document.addEventListener('DOMContentLoaded', () => {
  if (document.body.dataset.page !== 'checkout') return;
  const form = document.getElementById('checkout-form');
  const summary = document.getElementById('checkout-summary');
  renderCheckoutSummary();
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    // Simulación simple de "procesamiento"
    const cart = getCart();
    if (cart.length === 0) {
      alert('Tu carrito está vacío.');
      return;
    }
    const data = {
      name: document.getElementById('name').value,
      address: document.getElementById('address').value,
      phone: document.getElementById('phone').value,
      payment: document.getElementById('payment').value,
      cart
    };
    // Aquí en el backend crearías el pedido; en el frontend simulamos éxito:
    console.log('Pedido simulado:', data);
    alert('Pedido realizado (simulado). Gracias.');
    clearCart();
    renderCheckoutSummary();
    // opcional: redirigir a "index.html"
    window.location.href = 'index.html';
  });
});
