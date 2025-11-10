// ==============================
// cliente.js – Panel del cliente (ACTUALIZADO con sincronización de carrito)
// ==============================
document.addEventListener('DOMContentLoaded', function() {
  // 🔹 Cargar usuario logueado
  const user = window.Session && window.Session.getUser ? window.Session.getUser() : null;
  if (!user || !user.loggedIn) {
    window.location.href = '../auth/login.html';
    return;
  }

  // ✅ ESCUCHAR ACTUALIZACIONES DEL CARRITO
  function setupCartListener() {
    // Actualizar inmediatamente
    if (window.cart && typeof window.cart.updateCartCount === 'function') {
      window.cart.updateCartCount();
    }
    
    // Escuchar eventos futuros
    if (window.CartEvents) {
      window.CartEvents.onUpdate(function(count) {
        const cartCountElements = document.querySelectorAll('#cart-count, .cart-count');
        cartCountElements.forEach(element => {
          if (element) {
            element.textContent = count;
          }
        });
      });
    }
  }

  setupCartListener();

  // Llenar datos del perfil
  document.getElementById('userName').textContent = user.name || '';
  document.getElementById('userNameSidebar').textContent = user.name || '';
  document.getElementById('userEmail').textContent = user.email || '';

  document.getElementById('profileFullName').value = user.name || '';
  document.getElementById('profileEmail').value = user.email || '';
  document.getElementById('profilePhone').value = user.phone || '';

  // ==============================
  // 🔸 Estados considerados activos
  // ==============================
  const ACTIVE_STATES = ['pendiente','preparando','en camino','llegado','delivering','preparing'];

  // ==============================
  // 🔹 Sonido de llegada
  // ==============================
  function playArrivalSound() {
    const audio = new Audio('../assets/sounds/arrival.mp3');
    audio.play().catch(() => {
      console.log('🔇 El navegador bloqueó la reproducción automática de sonido.');
    });
  }

  // ==============================
  // 🔹 Renderizar pedidos
  // ==============================
  function renderOrders() {
    const orders = window.Session && window.Session.getOrders ? window.Session.getOrders(user.email) : [];
    const activosContainer = document.getElementById('pedidosActivosList');
    const historialContainer = document.getElementById('historialPedidosList');
    activosContainer.innerHTML = '';
    historialContainer.innerHTML = '';

    if (!orders || orders.length === 0) {
      activosContainer.innerHTML = '<div class="text-muted">No hay pedidos activos</div>';
      historialContainer.innerHTML = '<div class="text-muted">Todavía no tienes historial de pedidos</div>';
      return;
    }

    orders.forEach(function(o) {
      const item = document.createElement('a');
      item.className = 'list-group-item list-group-item-action';
      item.href = '#';
      item.dataset.orderId = o.id;
      item.innerHTML = `
        <div class="d-flex w-100 justify-content-between">
          <h6 class="mb-1">Pedido #${o.id} - S/. ${o.total.toFixed ? o.total.toFixed(2) : o.total}</h6>
          <small>${new Date(o.date).toLocaleString()}</small>
        </div>
        <p class="mb-1 small text-muted">Estado: ${o.status}</p>
      `;

      // 🔸 Detalle completo del pedido
      item.addEventListener('click', function(e) {
        e.preventDefault();
        const detalleBody = document.getElementById('detallePedidoBody');
        detalleBody.innerHTML = '';
        let html = `<h5>Pedido #${o.id}</h5>`;
        html += `<p><strong>Fecha:</strong> ${new Date(o.date).toLocaleString()}</p>`;
        html += `<p><strong>Total:</strong> S/. ${o.total.toFixed ? o.total.toFixed(2) : o.total}</p>`;
        html += '<hr><h6>Items</h6><ul>';
        (o.items || []).forEach(it => {
          html += `<li>${it.quantity}x ${it.name} — S/. ${(it.price * it.quantity).toFixed(2)}</li>`;
        });
        html += '</ul>';
        detalleBody.innerHTML = html;

        const detalleModalEl = document.getElementById('detallePedidoModal');
        const detalleFooter = detalleModalEl.querySelector('.modal-footer');
        Array.from(detalleFooter.querySelectorAll('.btn-custom')).forEach(b => b.remove());

        const isActive = ACTIVE_STATES.includes(String(o.status).toLowerCase());
        if (isActive) {
          const btnCancel = document.createElement('button');
          btnCancel.className = 'btn btn-danger btn-custom';
          btnCancel.textContent = 'Cancelar pedido';
          btnCancel.addEventListener('click', function() {
            if (!confirm('¿Deseas cancelar este pedido?')) return;
            o.tracking = o.tracking || [];
            o.tracking.push({ step: 'Pedido cancelado', key: 'cancelled', description: 'El usuario canceló el pedido', time: new Date().toISOString() });
            o.status = 'cancelado';
            delete o.nextStepAt;
            if (window.Session && window.Session.updateOrder) window.Session.updateOrder(o);
            renderOrders();
            computeStats();
            bootstrap.Modal.getInstance(detalleModalEl)?.hide();
          });

          const btnMarkDelivered = document.createElement('button');
          btnMarkDelivered.className = 'btn btn-success btn-custom';
          btnMarkDelivered.textContent = 'Marcar como entregado';
          btnMarkDelivered.addEventListener('click', function() {
            if (!confirm('¿Marcar este pedido como entregado?')) return;
            o.tracking = o.tracking || [];
            o.tracking.push({ step: 'Pedido entregado', key: 'delivered', description: 'Pedido marcado como entregado', time: new Date().toISOString() });
            o.status = 'entregado';
            delete o.nextStepAt;
            if (window.Session && window.Session.updateOrder) window.Session.updateOrder(o);
            renderOrders();
            computeStats();
            bootstrap.Modal.getInstance(detalleModalEl)?.hide();
          });

          detalleFooter.insertBefore(btnMarkDelivered, detalleFooter.firstChild);
          detalleFooter.insertBefore(btnCancel, detalleFooter.firstChild);
        }

        new bootstrap.Modal(detalleModalEl).show();
      });

      // 🔹 Botones rápidos (ver detalle / rastrear)
      const isActive = ACTIVE_STATES.includes(String(o.status).toLowerCase());
      const detailBtn = document.createElement('button');
      detailBtn.className = 'btn btn-sm btn-outline-primary me-2';
      detailBtn.textContent = '📋 Ver detalles';
      detailBtn.addEventListener('click', e => {
        e.preventDefault(); e.stopPropagation();
        const detalleBody = document.getElementById('detallePedidoBody');
        detalleBody.innerHTML = `
          <h5>${o.negocio || 'Pedido #' + o.id}</h5>
          <p><strong>Fecha:</strong> ${new Date(o.date).toLocaleString()}</p>
          <hr>
          <ul class="list-unstyled">
            ${(o.items || [])
              .map(it => `<li>${it.quantity} × ${it.name || it.producto} — <strong>S/ ${(it.price * it.quantity).toFixed(2)}</strong></li>`)
              .join('')}
          </ul>
          <p class="mt-2 fw-bold text-end">Total: S/ ${Number(o.total).toFixed(2)}</p>
        `;
        new bootstrap.Modal(document.getElementById('detallePedidoModal')).show();
      });

      const trackBtn = document.createElement('button');
      trackBtn.className = 'btn btn-sm btn-outline-success';
      trackBtn.textContent = isActive ? '🚚 Rastrear' : 'Verificar pedido';
      trackBtn.addEventListener('click', e => {
        e.preventDefault(); e.stopPropagation();
        showTracking(o);
      });

      const btnWrap = document.createElement('div');
      btnWrap.className = 'mt-2 d-flex justify-content-end';
      btnWrap.appendChild(detailBtn);
      btnWrap.appendChild(trackBtn);
      item.appendChild(btnWrap);

      // Separar pedidos activos e historial
      if (isActive) {
        activosContainer.appendChild(item);
      } else {
        historialContainer.appendChild(item);
      }
    });
  }

  // ==============================
  // 🔹 Rastreo (timeline)
  // ==============================
  function showTracking(order) {
    const rastrearBody = document.getElementById('rastrearPedidoBody');
    rastrearBody.innerHTML = '';
    const steps = order.tracking || [];
    let html = '';

    if (String(order.status).toLowerCase() === 'llegado') {
      html += `<div class="alert alert-info text-center fw-bold">🚚 Tu pedido ha llegado al destino. Confirma cuando lo recibas.</div>`;
    } else if (String(order.status).toLowerCase() === 'entregado') {
      html += `<div class="alert alert-success text-center fw-bold">✅ Tu pedido fue entregado correctamente.</div>`;
    }

    if (steps.length === 0) {
      html += '<div class="text-muted">No hay información de rastreo para este pedido</div>';
    } else {
      html += '<div class="timeline">';
      steps.forEach(s => {
        const isDelivered = s.key === 'delivered';
        html += `
          <div class="d-flex align-items-start mb-3">
            <div style="width:40px; text-align:center;">
              <i class="bi ${isDelivered ? 'bi-check-circle-fill text-success' : 'bi-circle-fill text-primary'}"></i>
            </div>
            <div>
              <div><strong>${s.step}</strong> <small class="text-muted">${new Date(s.time).toLocaleString()}</small></div>
              <div class="small text-muted">${s.description || ''}</div>
            </div>
          </div>
        `;
      });
      html += '</div>';
    }

    rastrearBody.innerHTML = html;
    new bootstrap.Modal(document.getElementById('rastrearPedidoModal')).show();
  }

  // ==============================
  // 🔹 Avance de estado (simulación)
  // ==============================
    function nextStatus(current) {
      const seq = [
        { key: 'received', status: 'pendiente', label: 'Pedido recibido' },
        { key: 'accepted', status: 'aceptado', label: 'Aceptado por el restaurante' },
        { key: 'preparing', status: 'preparando', label: 'En preparación' },
        { key: 'out_for_delivery', status: 'en camino', label: 'En camino' },
        { key: 'arrived', status: 'llegado', label: 'Pedido llegado al destino' },
        { key: 'delivered', status: 'entregado', label: 'Entregado' }
      ];
      let idx = seq.findIndex(s => String(s.status).toLowerCase() === String(current).toLowerCase());
      if (idx === -1) idx = 0;
      if (idx < seq.length - 1) return seq[idx + 1];
      return null;
    }

    function simulateAdvance(order) {
      const current = order.status || (order.tracking && order.tracking[order.tracking.length - 1]?.key) || 'received';
      const next = nextStatus(current);
      if (!next) {
        alert('El pedido ya está finalizado');
        return;
      }
      const stepObj = { step: next.label, key: next.key, description: next.label, time: new Date().toISOString() };
      order.tracking = order.tracking || [];
      order.tracking.push(stepObj);
      order.status = next.status;

      if (next.status === 'llegado') {
        playArrivalSound();
        if (window.CartUtils && typeof window.CartUtils.showToast === 'function') {
            window.CartUtils.showToast(`🚚 Tu pedido #${order.id} ha llegado. Confirma cuando lo recibas.`, 'info');
        }
      }

      if (window.Session && window.Session.updateOrder) {
        window.Session.updateOrder(order);
      }
      renderOrders();
      computeStats();
      showTracking(order);
    }

  // ==============================
  // 🔹 Estadísticas
  // ==============================
  function computeStats() {
    const orders = window.Session && window.Session.getOrders ? window.Session.getOrders(user.email) : [];
    const total = orders.length;
    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();
    let spentThisMonth = 0, totalSpentAllTime = 0;

    orders.forEach(o => {
      const d = new Date(o.date);
      const amt = Number(o.total) || 0;
      totalSpentAllTime += amt;
      if (d.getMonth() === month && d.getFullYear() === year) spentThisMonth += amt;
    });

    const points = Math.floor(totalSpentAllTime);
    document.getElementById('totalOrdersCount').textContent = total;
    document.getElementById('spentThisMonth').textContent = spentThisMonth.toFixed(2);
    document.getElementById('userPoints').textContent = points;
  }

  renderOrders();
  computeStats();
});
// ==============================
// 🔹 EDITAR PERFIL - GUARDAR CAMBIOS
// ==============================

// Inicializar eventos del modal de perfil
document.addEventListener('DOMContentLoaded', function() {
    const btnSaveProfile = document.getElementById('btnSaveProfile');
    const profileModal = document.getElementById('profileModal');
    
    if (btnSaveProfile) {
        btnSaveProfile.addEventListener('click', saveProfileChanges);
    }
    
    // Cuando se abre el modal, cargar los datos actuales
    if (profileModal) {
        profileModal.addEventListener('show.bs.modal', function() {
            loadProfileData();
        });
    }
});

// Cargar datos actuales del perfil en el modal
function loadProfileData() {
    const user = window.Session && window.Session.getUser ? window.Session.getUser() : null;
    if (!user) return;
    
    document.getElementById('profileFullName').value = user.name || '';
    document.getElementById('profileEmail').value = user.email || '';
    document.getElementById('profilePhone').value = user.phone || '';
}

// Guardar cambios del perfil
function saveProfileChanges() {
    const user = window.Session && window.Session.getUser ? window.Session.getUser() : null;
    if (!user) {
        showProfileToast('Error: No se pudo cargar la información del usuario', 'danger');
        return;
    }

    // Obtener nuevos valores
    const newName = document.getElementById('profileFullName').value.trim();
    const newPhone = document.getElementById('profilePhone').value.trim();

    // Validaciones
    if (!newName) {
        showProfileToast('El nombre no puede estar vacío', 'danger');
        return;
    }

    if (newPhone && !/^\d{9}$/.test(newPhone)) {
        showProfileToast('El teléfono debe tener 9 dígitos', 'danger');
        return;
    }

    // Actualizar datos del usuario
    const updatedUser = {
        ...user,
        name: newName,
        phone: newPhone
    };

    // Guardar en Session
    if (window.Session && window.Session.saveUser) {
        window.Session.saveUser(updatedUser);
    }

    // Guardar en AuthSystem si está disponible
    if (window.AuthSystem && window.AuthSystem.updateUser) {
        window.AuthSystem.updateUser(user.id, {
            name: newName,
            phone: newPhone
        });
    }

    // Actualizar la UI
    updateProfileUI(updatedUser);
    
    // Mostrar mensaje de éxito
    showProfileToast('Perfil actualizado correctamente', 'success');
    
    // Cerrar el modal después de un breve delay
    setTimeout(() => {
        const modal = bootstrap.Modal.getInstance(document.getElementById('profileModal'));
        if (modal) modal.hide();
    }, 1500);
}

// Actualizar la UI con los nuevos datos
function updateProfileUI(user) {
    // Actualizar elementos en el navbar
    const userNameElements = document.querySelectorAll('#userName, #userNameSidebar, #nav-username');
    userNameElements.forEach(element => {
        if (element) element.textContent = user.name || 'Usuario';
    });

    // Actualizar email si es necesario
    const userEmailElement = document.getElementById('userEmail');
    if (userEmailElement) userEmailElement.textContent = user.email || '';

    // Actualizar teléfono si está en algún elemento
    const userPhoneElement = document.getElementById('userPhone');
    if (userPhoneElement) userPhoneElement.textContent = user.phone || '';
}

// Mostrar toast de perfil
function showProfileToast(message, type = 'info') {
    // Crear toast container si no existe
    let toastContainer = document.getElementById('profile-toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'profile-toast-container';
        toastContainer.className = 'toast-container position-fixed top-0 end-0 p-3';
        toastContainer.style.zIndex = '9999';
        document.body.appendChild(toastContainer);
    }

    // Configuración según el tipo
    const toastConfig = {
        success: {
            icon: 'bi-check-circle-fill',
            bgClass: 'bg-success',
            textClass: 'text-white'
        },
        danger: {
            icon: 'bi-exclamation-triangle-fill',
            bgClass: 'bg-danger',
            textClass: 'text-white'
        },
        info: {
            icon: 'bi-info-circle-fill',
            bgClass: 'bg-info',
            textClass: 'text-white'
        }
    };

    const config = toastConfig[type] || toastConfig.info;

    // Crear el toast
    const toastEl = document.createElement('div');
    toastEl.className = `toast ${config.bgClass} ${config.textClass} border-0`;
    toastEl.setAttribute('role', 'alert');
    toastEl.setAttribute('aria-live', 'assertive');
    toastEl.setAttribute('aria-atomic', 'true');
    
    toastEl.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                <i class="bi ${config.icon} me-2"></i>
                ${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
    `;

    toastContainer.appendChild(toastEl);
    
    // Mostrar el toast
    const toast = new bootstrap.Toast(toastEl, {
        autohide: true,
        delay: 3000
    });
    toast.show();

    // Remover el toast del DOM después de que se oculte
    toastEl.addEventListener('hidden.bs.toast', () => {
        toastEl.remove();
    });
}

// También actualizamos el orden de scripts en cliente.html