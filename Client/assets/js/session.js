// session.js - VERSIÓN SIMPLIFICADA (usa AuthSystem)
(function(){
  'use strict';

  // ✅ USAR AuthSystem en lugar de funciones duplicadas
  function getUser(){
    return window.AuthSystem ? window.AuthSystem.getCurrentUser() : null;
  }

  function saveUser(user){
    if (window.AuthSystem && user && user.id) {
      window.AuthSystem.updateUser(user.id, user);
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
      existing.unshift(order);
      localStorage.setItem(key, JSON.stringify(existing));

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
        existing.unshift(updatedOrder);
      }
      localStorage.setItem(key, JSON.stringify(existing));

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
    if (window.AuthSystem) {
      window.AuthSystem.logout();
    } else {
      // Fallback si AuthSystem no está disponible
      localStorage.removeItem('user');
      sessionStorage.removeItem('user');
      var base = window.location.pathname.includes('/dashboard/') ? '../index.html' : 'index.html';
      window.location.href = base;
    }
  }

  // ✅ ACTUALIZAR CARRITO DESPUÉS DEL LOGIN/REGISTRO
  function updateCartOnAuth() {
    setTimeout(() => {
      if (window.cart && typeof window.cart.forceGlobalUpdate === 'function') {
        window.cart.forceGlobalUpdate();
      } else if (window.cart && typeof window.cart.updateCartCount === 'function') {
        window.cart.updateCartCount();
      }
      
      if (window.CartEvents) {
        window.CartEvents.emitUpdate();
      }
    }, 500);
  }

  document.addEventListener('DOMContentLoaded', function(){
    var user = getUser();
    var name = user && user.name ? user.name : null;

    var mappings = [ 'nav-username', 'userName', 'userNameSidebar' ];
    mappings.forEach(function(id){
      var el = document.getElementById(id);
      if(el){
        el.textContent = name || el.getAttribute('data-default') || (id === 'nav-username' ? 'Hola' : 'Usuario');
      }
    });

    var emailEl = document.getElementById('userEmail');
    if(emailEl){
      emailEl.textContent = (user && user.email) ? user.email : '';
    }

    var logoutBtns = document.querySelectorAll('#btnLogout, .btn-logout');
    logoutBtns.forEach(function(btn){
      btn.addEventListener('click', function(e){ e.preventDefault(); logout(); });
    });

    // ✅ ACTUALIZAR CARRITO SI EL USUARIO ESTÁ LOGUEADO
    if (user && user.loggedIn) {
      updateCartOnAuth();
    }

    if(user && user.loggedIn){
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

    if(!user){
      document.querySelectorAll('a[href$="auth/login.html"], a[href$="../auth/login.html"]').forEach(function(a){
        if(!a.textContent.trim()) a.textContent = 'Ingresar';
      });
    }
  });

  var ORDER_PROGRESS_CONFIG = {
    intervals: [2 * 60 * 1000, 1 * 60 * 1000, 1 * 60 * 1000, 1 * 60 * 1000, 2 * 60 * 1000],
    checkInterval: 30 * 1000,
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

  function advanceOrderStepGlobal(order){
    if(!order || !order.status) return false;
    if(String(order.status).toLowerCase() === 'cancelado' || String(order.status).toLowerCase() === 'entregado') return false;

    var info = getNextStatusInfo(order.status);
    if(!info) return false;

    var scheduledTime = order.nextStepAt ? Number(order.nextStepAt) : Date.now();

    order.tracking = order.tracking || [];
    order.tracking.push({ step: info.next.label, key: info.next.key, description: info.next.label, time: new Date(scheduledTime).toISOString() });
    order.status = info.next.status;
    
    if (info.next.status.toLowerCase() === 'llegado') {
      try {
        const audio = new Audio('../assets/sounds/arrived.mp3');
        audio.play().catch(() => console.warn('No se pudo reproducir sonido'));
      } catch(e) {
        console.warn('Error al reproducir sonido', e);
      }
    }

    var interval = getConfiguredInterval(info.nextIndex);
    var further = getNextStatusInfo(order.status);
    if(further){
      order.nextStepAt = scheduledTime + interval;
    } else {
      delete order.nextStepAt;
    }

    updateOrder(order);
    return true;
  }

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

  var _ordersSchedulerId = null;
  function startOrdersScheduler(){
    if(_ordersSchedulerId) return;
    _ordersSchedulerId = setInterval(function(){
      try{ processAllOrders(); }catch(e){ console.warn(e); }
    }, ORDER_PROGRESS_CONFIG.checkInterval);
    setTimeout(processAllOrders, 500);
  }

  function stopOrdersScheduler(){
    if(_ordersSchedulerId){ clearInterval(_ordersSchedulerId); _ordersSchedulerId = null; }
  }

  window.Session = {
    getUser: getUser,
    saveUser: saveUser,
    logout: logout,
    getOrders: getOrders,
    addOrder: addOrder,
    updateOrder: updateOrder,
    ORDER_PROGRESS_CONFIG: ORDER_PROGRESS_CONFIG,
    setDebugOrderProgress: setDebugMode,
    startOrdersScheduler: startOrdersScheduler,
    stopOrdersScheduler: stopOrdersScheduler,
    processAllOrders: processAllOrders
  };

  startOrdersScheduler();
})();