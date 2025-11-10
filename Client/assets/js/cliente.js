/**
 * cliente.js – Lógica del panel del cliente
 * DeliveryApp
 */

document.addEventListener("DOMContentLoaded", () => {
  const activeOrdersContainer = document.getElementById("pedidosActivosList");
  const historyContainer = document.getElementById("historialPedidosList");

  const storageKey = "pedidosCliente";

  const defaultPedidos = {
    activos: [
      {
        id: 1,
        negocio: "Pizzería Don Carlo",
        fecha: "2025-11-06 15:10",
        total: 45.9,
        estado: "En camino",
        items: [
          { producto: "Pizza Pepperoni", cantidad: 1, precio: 25.9 },
          { producto: "Gaseosa 1L", cantidad: 1, precio: 6 },
          { producto: "Helado", cantidad: 1, precio: 14 },
        ],
        timeline: [
          { hora: "14:45", estado: "Pedido Confirmado" },
          { hora: "14:50", estado: "Preparando" },
          { hora: "15:10", estado: "En camino" },
        ],
      },
      {
        id: 6,
        negocio: "Pizzería Don Carlo",
        fecha: "2025-11-06 15:10",
        total: 45.9,
        estado: "Preparando",
        items: [
          { producto: "Pizza Pepperoni", cantidad: 1, precio: 25.9 },
          { producto: "Gaseosa 1L", cantidad: 1, precio: 6 },
          { producto: "Helado", cantidad: 1, precio: 14 },
        ],
        timeline: [
          { hora: "14:45", estado: "Pedido Confirmado" },
          { hora: "14:50", estado: "Preparando" },
        ],
      },
    ],
    historial: [
      {
        id: 2,
        negocio: "SushiRoll Express",
        fecha: "2025-10-28 19:40",
        total: 62.5,
        estado: "Entregado",
        items: [
          { producto: "Combo Sushi 20 piezas", cantidad: 1, precio: 52.5 },
          { producto: "Agua mineral", cantidad: 1, precio: 10 },
        ],
        timeline: [
          { hora: "19:10", estado: "Pedido Confirmado" },
          { hora: "19:20", estado: "Preparando" },
          { hora: "19:30", estado: "En camino" },
          { hora: "19:40", estado: "Entregado" },
        ],
      },
      {
        id: 3,
        negocio: "SushiRoll Express",
        fecha: "2025-10-28 19:40",
        total: 62.5,
        estado: "Entregado",
        items: [
          { producto: "Combo Sushi 20 piezas", cantidad: 1, precio: 52.5 },
          { producto: "Agua mineral", cantidad: 1, precio: 10 },
        ],
        timeline: [
          { hora: "19:10", estado: "Pedido Confirmado" },
          { hora: "19:20", estado: "Preparando" },
          { hora: "19:30", estado: "En camino" },
          { hora: "19:40", estado: "Entregado" },
        ],
      },
      {
        id: 4,
        negocio: "SushiRoll Express",
        fecha: "2025-10-28 19:40",
        total: 62.5,
        estado: "Cancelado",
        items: [
          { producto: "Combo Sushi 20 piezas", cantidad: 1, precio: 52.5 },
          { producto: "Agua mineral", cantidad: 1, precio: 10 },
        ],
        timeline: [
          { hora: "19:10", estado: "Pedido Confirmado" },
          { hora: "19:20", estado: "Preparando" },
          { hora: "19:30", estado: "En camino" },
          { hora: "19:40", estado: "Entregado" },
        ],
      },
    ],
  };

  // ----------------------------
  // 🔹 Cargar desde localStorage o usar por defecto
  // ----------------------------
  function loadPedidos() {
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : defaultPedidos;
  }

  function savePedidos(data) {
    localStorage.setItem(storageKey, JSON.stringify(data));
  }

  let pedidos = loadPedidos();

  // ----------------------------
  // 🔹 Renderizar pedidos activos
  // ----------------------------
  function renderPedidosActivos() {
    activeOrdersContainer.innerHTML = "";

    if (pedidos.activos.length === 0) {
      activeOrdersContainer.innerHTML = `<p class="text-muted">No tienes pedidos activos.</p>`;
      return;
    }

    pedidos.activos.forEach((pedido) => {
      const div = document.createElement("div");
      div.classList.add("list-group-item", "mb-2");
      div.innerHTML = `
        <div class="d-flex justify-content-between align-items-center">
          <div>
            <h5>${pedido.negocio}</h5>
            <small>${pedido.fecha}</small><br>
            <span class="badge bg-primary">${pedido.estado}</span>
          </div>
          <div class="text-end">
            <p class="fw-bold mb-1">S/ ${pedido.total.toFixed(2)}</p>
            <button class="btn btn-outline-primary btn-sm btn-detalle" data-id="${pedido.id}">Ver detalles</button>
            <button class="btn btn-outline-success btn-sm btn-rastrear" data-id="${pedido.id}"><i class="bi bi-geo-alt"></i> Rastrear pedido</button>
          </div>
        </div>
      `;
      activeOrdersContainer.appendChild(div);
    });
  }

  // ----------------------------
  // 🔹 Renderizar historial
  // ----------------------------
  function renderHistorial() {
    historyContainer.innerHTML = "";

    if (pedidos.historial.length === 0) {
      historyContainer.innerHTML = `<p class="text-muted">Aún no tienes pedidos anteriores.</p>`;
      return;
    }

    pedidos.historial.forEach((pedido) => {
      const div = document.createElement("div");
      div.classList.add("list-group-item", "mb-2");
      div.innerHTML = `
        <div class="d-flex justify-content-between align-items-center">
          <div>
            <h5>${pedido.negocio}</h5>
            <small>${pedido.fecha}</small><br>
            <span class="badge bg-secondary">${pedido.estado}</span>
          </div>
          <div class="text-end">
            <p class="fw-bold mb-1">S/ ${pedido.total.toFixed(2)}</p>
            <button class="btn btn-outline-primary btn-sm btn-detalle" data-id="${pedido.id}">Ver detalles</button>
          </div>
        </div>
      `;
      historyContainer.appendChild(div);
    });
  }

  // ----------------------------
  // 🔹 Modales con Bootstrap
  // ----------------------------
  function abrirModalDetalles(pedidoId) {
    const pedido =
      pedidos.activos.find((p) => p.id == pedidoId) ||
      pedidos.historial.find((p) => p.id == pedidoId);

    if (!pedido) return;

    const modalBody = document.getElementById("detallePedidoBody");
    modalBody.innerHTML = `
      <h4>${pedido.negocio}</h4>
      <p><strong>Fecha:</strong> ${pedido.fecha}</p>
      <hr>
      <ul class="list-unstyled">
        ${pedido.items
          .map(
            (item) =>
              `<li>${item.cantidad} × ${item.producto} — <strong>S/ ${item.precio.toFixed(
                2
              )}</strong></li>`
          )
          .join("")}
      </ul>
      <p class="mt-2 fw-bold text-end">Total: S/ ${pedido.total.toFixed(2)}</p>
    `;

    const modal = new bootstrap.Modal(
      document.getElementById("detallePedidoModal")
    );
    modal.show();
  }

  function abrirModalRastreo(pedidoId) {
  const pedido = pedidos.activos.find((p) => p.id == pedidoId);
  if (!pedido) return;

  const estados = ["Pedido Confirmado", "Preparando", "En camino", "Entregado"];
  const estadoActual = pedido.estado;
  const progreso = {
    "Pedido Confirmado": 25,
    "Preparando": 50,
    "En camino": 75,
    "Entregado": 100,
  };

  let stepsHTML = "";
  estados.forEach((estado, i) => {
    let clase = "";
    if (estados.indexOf(estadoActual) > i) clase = "completed";
    else if (estado === estadoActual) clase = "active";
    stepsHTML += `
      <div class="tracking-step ${clase}">
        <div class="step-icon">${
          clase === "completed" ? "✓" : estado === "En camino" ? "🚚" : "📍"
        }</div>
        <div class="step-info">
          <p>${estado}</p>
          <small>${
            pedido.timeline[i] ? pedido.timeline[i].hora : ""
          }</small>
        </div>
      </div>
    `;
  });

  const modalBody = document.getElementById("rastrearPedidoBody");
  modalBody.innerHTML = `
    <h5 class="text-center mb-3">${pedido.negocio}</h5>
    <div class="order-tracking">${stepsHTML}</div>
    <div class="progress mt-3">
      <div class="progress-bar bg-success" role="progressbar" style="width: ${
        progreso[estadoActual]
      }%;"></div>
    </div>
    <div class="mapa-placeholder mt-4 text-center text-muted">
      [Mapa o chat con repartidor próximamente]
    </div>
  `;

  const modal = new bootstrap.Modal(
    document.getElementById("rastrearPedidoModal")
  );
  modal.show();
}


  // ----------------------------
  // 🔹 Eventos
  // ----------------------------
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("btn-detalle")) {
      abrirModalDetalles(e.target.dataset.id);
    }
    if (e.target.classList.contains("btn-rastrear")) {
      abrirModalRastreo(e.target.dataset.id);
    }
  });

  // cliente.js o un JS global incluido en todas las páginas
  document.getElementById("btnLogout").addEventListener("click", logout);



  // ----------------------------
  // 🔹 Render inicial
  // ----------------------------
  renderPedidosActivos();
  renderHistorial();
});

// Función de logout
document.getElementById("btnLogout").addEventListener("click", function(e) {
    e.preventDefault(); // evita que el enlace recargue la página

    // Limpiar datos de sesión/localStorage
    localStorage.removeItem('pedidosCliente');
    localStorage.removeItem('usuario');

    console.log("Sesión cerrada correctamente"); // para depuración

    // Redirigir al login
    window.location.href = "../auth/login.html";
});


// ======================================================
// 🔸 SECCIÓN DE PRUEBAS (comentada)
// ======================================================
/*
 function agregarPedidoPrueba() {
   const pedidos = JSON.parse(localStorage.getItem("pedidosCliente"));
   pedidos.activos.push({
     id: Date.now(),
     negocio: "Hamburguesas FastKing",
     fecha: "2025-11-06 20:00",
     total: 38.5,
     estado: "Pedido Confirmado",
     items: [
       { producto: "Combo Doble", cantidad: 1, precio: 25.5 },
       { producto: "Papas Grandes", cantidad: 1, precio: 8 },
       { producto: "Refresco", cantidad: 1, precio: 5 },
     ],
     timeline: [{ hora: "19:50", estado: "Pedido Confirmado" }],
   });
   localStorage.setItem("pedidosCliente", JSON.stringify(pedidos));
   location.reload();
 }
 agregarPedidoPrueba();*/


