// session.js
// Lee la sesión guardada en localStorage/sessionStorage y actualiza la UI (nombre en el nav, correo, logout)
(function(){
  'use strict';

  function getUser(){
    try{
      return JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || 'null');
    }catch(e){
      return null;
    }
  }

  function saveUser(user){
    try{
      // If user was stored in localStorage (rememberMe) keep same place, else sessionStorage
      var wasInLocal = !!localStorage.getItem('user');
      var serialized = JSON.stringify(user);
      if(wasInLocal){
        localStorage.setItem('user', serialized);
      } else {
        // default to sessionStorage unless explicitly present in localStorage
        sessionStorage.setItem('user', serialized);
      }
    }catch(e){
      console.warn('Could not save user', e);
    }
  }

  function ordersKeyFor(email){
    return 'orders_' + (email || '').toLowerCase();
  }

  function getOrders(email){
    try{
      var key = ordersKeyFor(email || (getUser() && getUser().email));
      if(!key) return [];
      return JSON.parse(localStorage.getItem(key) || '[]');
    }catch(e){
      return [];
    }
  }

  function addOrder(order){
    try{
      var userEmail = (getUser() && getUser().email) || order.email;
      if(!userEmail) return false;
      var key = ordersKeyFor(userEmail);
      var existing = JSON.parse(localStorage.getItem(key) || '[]');
      existing.unshift(order); // newest first
      localStorage.setItem(key, JSON.stringify(existing));

      // also, attach simple orders list to user object for convenience
      var user = getUser();
      if(user && user.email && user.email.toLowerCase() === userEmail.toLowerCase()){
        user.orders = existing;
        saveUser(user);
      }
      return true;
    }catch(e){
      console.warn('Could not add order', e);
      return false;
    }
  }

  function updateOrder(updatedOrder){
    try{
      var userEmail = (updatedOrder && updatedOrder.email) || (getUser() && getUser().email);
      if(!userEmail) return false;
      var key = ordersKeyFor(userEmail);
      var existing = JSON.parse(localStorage.getItem(key) || '[]');
      var replaced = false;
      existing = existing.map(function(o){
        if(String(o.id) === String(updatedOrder.id)){
          replaced = true;
          return updatedOrder;
        }
        return o;
      });
      if(!replaced){
        // if not found, add it
        existing.unshift(updatedOrder);
      }
      localStorage.setItem(key, JSON.stringify(existing));

      // sync to user.orders if user matches
      var user = getUser();
      if(user && user.email && user.email.toLowerCase() === userEmail.toLowerCase()){
        user.orders = existing;
        saveUser(user);
      }
      return true;
    }catch(e){
      console.warn('Could not update order', e);
      return false;
    }
  }

  function logout(){
    localStorage.removeItem('user');
    sessionStorage.removeItem('user');
    // Redirigir a la página principal (ajusta la ruta según la ubicación actual)
    var base = window.location.pathname.includes('/dashboard/') ? '../index.html' : 'index.html';
    window.location.href = base;
  }

  document.addEventListener('DOMContentLoaded', function(){
    var user = getUser();
    var name = user && user.name ? user.name : null;

    // Elementos a actualizar si existen
    var mappings = [ 'nav-username', 'userName', 'userNameSidebar' ];
    mappings.forEach(function(id){
      var el = document.getElementById(id);
      if(el){
        el.textContent = name || el.getAttribute('data-default') || (id === 'nav-username' ? 'Ingreso' : 'Usuario');
      }
    });

    var emailEl = document.getElementById('userEmail');
    if(emailEl){
      emailEl.textContent = (user && user.email) ? user.email : '';
    }

    // Añadir handler de logout a botones existentes
    var logoutBtns = document.querySelectorAll('#btnLogout, .btn-logout');
    logoutBtns.forEach(function(btn){
      btn.addEventListener('click', function(e){ e.preventDefault(); logout(); });
    });

    // Convertir enlaces de 'Ingresar' a 'Mi cuenta' y apuntar al dashboard si hay sesión
    if(user && user.loggedIn){
      // Reemplazar enlaces de login por 'Mi cuenta' y apuntar según rol
      document.querySelectorAll('a[href$="auth/login.html"], a[href$="../auth/login.html"]').forEach(function(a){
        a.textContent = 'Mi cuenta';
        var prefix = a.getAttribute('href').startsWith('..') ? '../dashboard/' : 'dashboard/';
        var target = 'index.html';
        switch(user.role){
          case 'cliente': target = prefix + 'cliente.html'; break;
          case 'repartidor': target = prefix + 'repartidor.html'; break;
          case 'restaurante': target = prefix + 'restaurante.html'; break;
          case 'admin': target = prefix + 'admin.html'; break;
          default: target = prefix + 'cliente.html';
        }
        a.setAttribute('href', target);
      });

      // Asegurar que existe opción de Cerrar sesión en los menús desplegables
      var menus = document.querySelectorAll('.dropdown-menu');
      menus.forEach(function(menu){
        var hasLogout = Array.from(menu.querySelectorAll('a')).some(function(a){
          return a.textContent.toLowerCase().includes('cerrar');
        });
        if(!hasLogout){
          var li = document.createElement('li');
          var a = document.createElement('a');
          a.className = 'dropdown-item';
          a.href = '#';
          a.textContent = 'Cerrar sesión';
          a.addEventListener('click', function(e){ e.preventDefault(); logout(); });
          li.appendChild(a);
          menu.appendChild(li);
        }
      });
    }

    // Si no hay usuario, asegurarse que los enlaces muestren 'Ingresar'
    if(!user){
      document.querySelectorAll('a[href$="auth/login.html"], a[href$="../auth/login.html"]').forEach(function(a){
        if(!a.textContent.trim()) a.textContent = 'Ingresar';
      });
    }
  });

  // Exponer API para otras páginas
  // Secuencia: recibido -> aceptado -> preparando -> en camino ->llegado -> entregado   (valores predeterminados realistas, en milisegundos)
  var ORDER_PROGRESS_CONFIG = {
// tiempo entre transiciones: recibido->aceptado, aceptado->preparando, preparando->en_entrega, en_entrega->entregado, llegado->>entregado 
//   formato de tiempo 5 × 60 × 1000 = 300,000 milisegundos

    intervals: [2 * 60 * 1000, 1 * 60 * 1000, 1 * 60 * 1000, 1 * 60 * 1000, 2 * 60 * 1000],

    // Con qué frecuencia el planificador verifica todos los pedidos (ms)
    checkInterval: 30 * 1000,
    // Multiplicador de depuración (si >0 y depuración es true reducirá los intervalos)
    debugMultiplier: 0.02
  };

  var _debugMode = false;

  function setDebugMode(enabled){
    _debugMode = !!enabled;
  }

  function getConfiguredInterval(index){
    var base = ORDER_PROGRESS_CONFIG.intervals[index] || (5 * 60 * 1000);
    if(_debugMode) return Math.max(1000, Math.round(base * ORDER_PROGRESS_CONFIG.debugMultiplier));
    return base;
  }

  // find next status info given a current status string
  function getNextStatusInfo(current){
    var seq = [
      {key:'received', status:'pendiente', label:'Pedido recibido'},
      {key:'accepted', status:'aceptado', label:'Aceptado por el restaurante'},
      {key:'preparing', status:'preparando', label:'En preparación'},
      {key:'out_for_delivery', status:'en camino', label:'En camino'},
      {key:'arrived', status:'llegado', label:'Pedido llegado al destino'},
      {key:'delivered', status:'entregado', label:'Entregado'}
    ];

    var idx = seq.findIndex(function(s){ return String(s.status).toLowerCase() === String(current).toLowerCase() || String(s.key).toLowerCase() === String(current).toLowerCase(); });
    if(idx === -1) idx = 0;
    if(idx < seq.length - 1) return { next: seq[idx+1], nextIndex: idx };
    return null;
  }

  // Advance a single order one step using scheduled times to compute timestamps
  function advanceOrderStepGlobal(order){
    if(!order || !order.status) return false;
    if(String(order.status).toLowerCase() === 'cancelado' || String(order.status).toLowerCase() === 'entregado') return false;

    var info = getNextStatusInfo(order.status);
    if(!info) return false;

    // Determine scheduledTime for this step: prefer order.nextStepAt, else fall back to now
    var scheduledTime = order.nextStepAt ? Number(order.nextStepAt) : Date.now();

    // Create tracking entry with scheduledTime
    order.tracking = order.tracking || [];
    order.tracking.push({ step: info.next.label, key: info.next.key, description: info.next.label, time: new Date(scheduledTime).toISOString() });
    order.status = info.next.status;
    // 🔊 Si el pedido llegó al destino, reproducir sonido
    if (info.next.status.toLowerCase() === 'llegado') {
      try {
        const audio = new Audio('../assets/sounds/arrived.mp3'); // ruta del sonido
        audio.play().catch(() => console.warn('No se pudo reproducir sonido'));
      } catch(e) {
        console.warn('Error al reproducir sonido', e);
      }
    }


    // compute nextStepAt from the configured interval for this transition (info.nextIndex gives previous index)
    var interval = getConfiguredInterval(info.nextIndex);
    // schedule next relative to scheduledTime (keeps consistent spacing even if processing is delayed)
    var further = getNextStatusInfo(order.status);
    if(further){
      order.nextStepAt = scheduledTime + interval;
    } else {
      delete order.nextStepAt;
    }

    // persist
    updateOrder(order);
    return true;
  }

  // Scan all orders in localStorage and advance those whose nextStepAt <= now
  function processAllOrders(){
    try{
      var changed = false;
      var now = Date.now();
      for(var i=0;i<localStorage.length;i++){
        var key = localStorage.key(i);
        if(!key || key.indexOf('orders_') !== 0) continue;
        var arr = JSON.parse(localStorage.getItem(key) || '[]');
        var updated = false;
        arr = arr.map(function(order){
          try{
            if(order && order.nextStepAt && Number(order.nextStepAt) <= now){
              var advanced = advanceOrderStepGlobal(order);
              if(advanced) updated = true;
            }
          }catch(e){ console.warn('processAllOrders item error', e); }
          return order;
        });
        if(updated){
          localStorage.setItem(key, JSON.stringify(arr));
          // also sync to user object if matches
          var user = getUser();
          if(user && user.email && key === ordersKeyFor(user.email)){
            user.orders = arr;
            saveUser(user);
          }
          changed = true;
        }
      }
      return changed;
    }catch(e){
      console.warn('Error in processAllOrders', e);
      return false;
    }
  }

  // Start the scheduler
  var _ordersSchedulerId = null;
  function startOrdersScheduler(){
    if(_ordersSchedulerId) return;
    // run periodically
    _ordersSchedulerId = setInterval(function(){
      try{ processAllOrders(); }catch(e){ console.warn(e); }
    }, ORDER_PROGRESS_CONFIG.checkInterval);
    // also run once immediately
    setTimeout(processAllOrders, 500);
  }

  // stop scheduler if needed
  function stopOrdersScheduler(){
    if(_ordersSchedulerId){ clearInterval(_ordersSchedulerId); _ordersSchedulerId = null; }
  }

  // Exponer API para otras páginas
  window.Session = {
    getUser: getUser,
    saveUser: saveUser,
    logout: logout,
    getOrders: getOrders,
    addOrder: addOrder,
    updateOrder: updateOrder,
    // scheduler controls and config
    ORDER_PROGRESS_CONFIG: ORDER_PROGRESS_CONFIG,
    setDebugOrderProgress: setDebugMode,
    startOrdersScheduler: startOrdersScheduler,
    stopOrdersScheduler: stopOrdersScheduler,
    processAllOrders: processAllOrders
  };

  // Auto-start scheduler
  startOrdersScheduler();

})();
