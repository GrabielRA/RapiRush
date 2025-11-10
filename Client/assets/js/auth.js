// auth.js - SISTEMA UNIFICADO DE AUTENTICACIÓN
class AuthSystem {
    constructor() {
        this.currentUser = null;
        this.users = JSON.parse(localStorage.getItem('deliveryAppUsers')) || [];
        this.testAccounts = this.initializeTestAccounts();
        this.init();
    }

    init() {
        // Cargar usuario actual (compatible con session.js)
        const savedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
        if (savedUser) {
            try {
                this.currentUser = JSON.parse(savedUser);
                console.log('Usuario cargado:', this.currentUser);
                
                // Actualizar UI si estamos en una página con elementos de usuario
                this.updateUserUI();
            } catch (e) {
                console.warn('Error loading user session', e);
            }
        }

        // Inicializar eventos de logout
        this.initLogoutEvents();
        
        // Redirigir si está en páginas de auth teniendo sesión
        this.redirectIfLoggedIn();
    }

    // CUENTAS DE PRUEBA (de tu login.js)
    initializeTestAccounts() {
        return {
            'cliente@test.com': { 
                password: '123456', 
                role: 'cliente', 
                name: 'Cliente Demo',
                id: 'test_cliente_001',
                phone: '123456789',
                address: 'Av. Demo 123'
            },
            'repartidor@test.com': { 
                password: '123456', 
                role: 'repartidor', 
                name: 'Repartidor Demo',
                id: 'test_repartidor_001',
                phone: '987654321',
                address: 'Av. Reparto 456'
            },
            'restaurante@test.com': { 
                password: '123456', 
                role: 'restaurante', 
                name: 'Restaurante Demo',
                id: 'test_restaurante_001',
                phone: '555555555',
                address: 'Av. Comida 789'
            },
            'admin@test.com': { 
                password: '123456', 
                role: 'admin', 
                name: 'Administrador Demo',
                id: 'test_admin_001',
                phone: '111111111',
                address: 'Av. Admin 000'
            }
        };
    }

    // REGISTRAR NUEVO USUARIO
    register(userData) {
        return new Promise((resolve, reject) => {
            // Validaciones (de tu register.js)
            if (!userData.termsAccepted) {
                reject('Debes aceptar los términos y condiciones');
                return;
            }

            if (userData.password !== userData.confirmPassword) {
                reject('Las contraseñas no coinciden');
                return;
            }

            if (userData.password.length < 6) {
                reject('La contraseña debe tener al menos 6 caracteres');
                return;
            }

            if (userData.phone && userData.phone.length !== 9) {
                reject('El teléfono debe tener 9 dígitos');
                return;
            }

            // Verificar si el email ya existe
            const existingUser = this.users.find(user => user.email === userData.email);
            if (existingUser) {
                reject('El email ya está registrado');
                return;
            }

            // Crear nuevo usuario
            const newUser = {
                id: this.generateId(),
                name: userData.fullName,
                email: userData.email,
                phone: userData.phone,
                address: userData.address,
                password: userData.password,
                role: 'cliente', // Por defecto todos son clientes
                wantsPromotions: userData.wantsPromotions || false,
                loggedIn: true,
                registeredAt: new Date().toISOString(),
                lastLogin: new Date().toISOString(),
                isActive: true
            };

            // Guardar en sistema de usuarios
            this.users.push(newUser);
            localStorage.setItem('deliveryAppUsers', JSON.stringify(this.users));

            // Guardar sesión (compatible con tu sistema actual)
            this.currentUser = newUser;
            this.saveSession(newUser, true); // Siempre rememberMe en registro

            resolve(newUser);
        });
    }

    // INICIAR SESIÓN (combinando ambos enfoques)
    login(email, password, rememberMe = false, selectedRole = 'cliente') {
        return new Promise((resolve, reject) => {
            if (!email || !password) {
                reject('Por favor completa todos los campos');
                return;
            }

            // 1. PRIMERO verificar si es cuenta de prueba
            const testAccount = this.testAccounts[email];
            if (testAccount && testAccount.password === password) {
                const testUser = {
                    id: testAccount.id,
                    name: testAccount.name,
                    email: email,
                    phone: testAccount.phone,
                    address: testAccount.address,
                    password: testAccount.password,
                    role: selectedRole, // ✅ CORRECCIÓN: Usar el rol seleccionado en el dropdown
                    isTestAccount: true,
                    registeredAt: new Date().toISOString(),
                    lastLogin: new Date().toISOString(),
                    isActive: true,
                    loggedIn: true
                };

                this.currentUser = testUser;
                this.saveSession(testUser, rememberMe);
                resolve(testUser);
                return;
            }

            // 2. SI NO ES CUENTA DE PRUEBA, buscar en usuarios registrados
            const user = this.users.find(u => 
                u.email === email && 
                u.password === password && 
                u.isActive === true
            );

            if (!user) {
                reject('Credenciales incorrectas');
                return;
            }

            // Actualizar último login
            user.lastLogin = new Date().toISOString();
            user.loggedIn = true;
            
            // Si el usuario no tiene rol, usar el seleccionado
            if (!user.role && selectedRole) {
                user.role = selectedRole;
            }

            this.currentUser = user;
            this.saveSession(user, rememberMe);
            
            // Actualizar en la lista de usuarios
            this.updateUser(user.id, user);
            
            resolve(user);
        });
    }

    // CERRAR SESIÓN
    // CERRAR SESIÓN
logout() {
    // Mostrar toast de confirmación
    this.showLogoutToast();
    
    // Esperar un poco para que se vea el toast antes de redirigir
    setTimeout(() => {
        if (this.currentUser) {
            // Marcar como desconectado
            this.currentUser.loggedIn = false;
            this.updateUser(this.currentUser.id, { loggedIn: false });
        }
        
        this.currentUser = null;
        localStorage.removeItem('user');
        sessionStorage.removeItem('user');
        
        // Limpiar carrito si existe
        if (window.cart && typeof window.cart.clearCart === 'function') {
            window.cart.clearCart();
        }
        
        // Redirigir al inicio
        const base = window.location.pathname.includes('/dashboard/') ? '../index.html' : 'index.html';
        window.location.href = base;
    }, 1500);
}

// MOSTRAR TOAST DE LOGOUT
showLogoutToast() {
    // Crear el toast container si no existe
    let toastContainer = document.getElementById('logout-toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'logout-toast-container';
        toastContainer.className = 'toast-container position-fixed top-50 start-50 translate-middle';
        document.body.appendChild(toastContainer);
    }

    // Crear el toast
    const toastEl = document.createElement('div');
    toastEl.className = 'toast align-items-center text-white bg-success border-0';
    toastEl.setAttribute('role', 'alert');
    toastEl.setAttribute('aria-live', 'assertive');
    toastEl.setAttribute('aria-atomic', 'true');
    
    toastEl.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                <i class="bi bi-check-circle-fill me-2"></i>
                Sesión cerrada correctamente
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
    `;

    toastContainer.appendChild(toastEl);
    
    // Mostrar el toast
    const toast = new bootstrap.Toast(toastEl, {
        autohide: true,
        delay: 1500
    });
    toast.show();

    // Remover el toast del DOM después de que se oculte
    toastEl.addEventListener('hidden.bs.toast', () => {
        toastEl.remove();
    });
}

    // GUARDAR SESIÓN (compatible con tu sistema)
    saveSession(user, rememberMe = false) {
        const userData = {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            address: user.address,
            role: user.role,
            loggedIn: true,
            loginTime: new Date().toISOString(),
            isTestAccount: user.isTestAccount || false
        };

        if (rememberMe) {
            localStorage.setItem('user', JSON.stringify(userData));
        } else {
            sessionStorage.setItem('user', JSON.stringify(userData));
        }
    }

    // VERIFICAR SI HAY SESIÓN ACTIVA
    isLoggedIn() {
        return this.currentUser !== null && this.currentUser.loggedIn === true;
    }

    // OBTENER USUARIO ACTUAL
    getCurrentUser() {
        return this.currentUser;
    }

    // VERIFICAR ROL
    hasRole(role) {
        return this.currentUser && this.currentUser.role === role;
    }

    // ACTUALIZAR USUARIO
    updateUser(userId, updates) {
        const userIndex = this.users.findIndex(user => user.id === userId);
        if (userIndex !== -1) {
            this.users[userIndex] = { ...this.users[userIndex], ...updates };
            localStorage.setItem('deliveryAppUsers', JSON.stringify(this.users));
            
            // Si es el usuario actual, actualizar también
            if (this.currentUser && this.currentUser.id === userId) {
                this.currentUser = this.users[userIndex];
            }
        }
    }

    // OBTENER TODOS LOS USUARIOS (para admin)
    getAllUsers() {
        return this.users;
    }

    // GENERAR ID ÚNICO
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    // REDIRECCIÓN INTELIGENTE (de tu login.js)
    redirectUser(user, fromCart = false, returnUrl = null) {
        if (fromCart === 'true' && returnUrl) {
            window.location.href = returnUrl;
        } else {
            const targetPage = user.role ? `../dashboard/${user.role}.html` : '../dashboard/cliente.html';
            window.location.href = targetPage;
        }
    }

    // ACTUALIZAR UI DEL USUARIO
    updateUserUI() {
        if (!this.currentUser) return;

        const elements = {
            'nav-username': this.currentUser.name,
            'userName': this.currentUser.name,
            'userNameSidebar': this.currentUser.name,
            'userEmail': this.currentUser.email
        };

        Object.keys(elements).forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = elements[id];
            }
        });

        // Actualizar enlaces de login a "Mi cuenta"
        if (this.isLoggedIn()) {
            document.querySelectorAll('a[href$="auth/login.html"], a[href$="../auth/login.html"]').forEach(function(a){
                a.textContent = 'Mi cuenta';
                const prefix = a.getAttribute('href').startsWith('..') ? '../dashboard/' : 'dashboard/';
                const target = 'index.html';
                const role = this.currentUser.role;
                
                switch(role){
                    case 'cliente': target = prefix + 'cliente.html'; break;
                    case 'repartidor': target = prefix + 'repartidor.html'; break;
                    case 'restaurante': target = prefix + 'restaurante.html'; break;
                    case 'admin': target = prefix + 'admin.html'; break;
                    default: target = prefix + 'cliente.html';
                }
                a.setAttribute('href', target);
            }.bind(this));
        }
    }

    // INICIALIZAR EVENTOS DE LOGOUT
    initLogoutEvents() {
        document.addEventListener('DOMContentLoaded', () => {
            const logoutBtns = document.querySelectorAll('#btnLogout, .btn-logout');
            logoutBtns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.logout();
                });
            });
        });
    }

    // REDIRIGIR SI YA ESTÁ LOGUEADO
    redirectIfLoggedIn() {
        if (this.isLoggedIn() && window.location.pathname.includes('/auth/')) {
            const urlParams = new URLSearchParams(window.location.search);
            const fromCart = urlParams.get('fromCart');
            const returnUrl = urlParams.get('return');
            
            this.redirectUser(this.currentUser, fromCart, returnUrl);
        }
    }

    // MOSTRAR MENSAJE DE ÉXITO CON TOAST
showSuccess(message) {
    this.showToast(message, 'success');
}

// MOSTRAR ERROR CON TOAST
showError(message) {
    this.showToast(message, 'danger');
}

// MOSTRAR TOAST GENERAL
showToast(message, type = 'info') {
    // Crear el toast container si no existe
    let toastContainer = document.getElementById('auth-toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'auth-toast-container';
        toastContainer.className = 'toast-container position-fixed top-0 end-0 p-3';
        toastContainer.style.zIndex = '9999';
        document.body.appendChild(toastContainer);
    }

    // Definir iconos y colores según el tipo
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
        delay: 4000
    });
    toast.show();

    // Remover el toast del DOM después de que se oculte
    toastEl.addEventListener('hidden.bs.toast', () => {
        toastEl.remove();
    });
}

    // TOGGLE PASSWORD VISIBILITY (compatible con tus funciones)
    initPasswordToggle(passwordInputId, toggleButtonId) {
        document.addEventListener('DOMContentLoaded', () => {
            const toggleBtn = document.getElementById(toggleButtonId);
            const passwordInput = document.getElementById(passwordInputId);
            
            if (toggleBtn && passwordInput) {
                toggleBtn.addEventListener('click', function() {
                    const toggleIcon = this.querySelector('i');
                    
                    if (passwordInput.type === 'password') {
                        passwordInput.type = 'text';
                        toggleIcon.classList.remove('bi-eye');
                        toggleIcon.classList.add('bi-eye-slash');
                    } else {
                        passwordInput.type = 'password';
                        toggleIcon.classList.remove('bi-eye-slash');
                        toggleIcon.classList.add('bi-eye');
                    }
                });
            }
        });
    }
}

// Instancia global
window.AuthSystem = new AuthSystem();

// Inicializar eventos cuando carga el DOM
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar toggles de contraseña comúnmente usados
    window.AuthSystem.initPasswordToggle('password', 'togglePassword');
    window.AuthSystem.initPasswordToggle('confirmPassword', 'togglePassword');
});