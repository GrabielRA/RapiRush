// login.js - VERSIÓN CON AUTHSYSTEM
document.addEventListener('DOMContentLoaded', function() {
    // Toggle password visibility (mantenemos por compatibilidad)
    document.getElementById('togglePassword').addEventListener('click', function() {
        const passwordInput = document.getElementById('password');
        const toggleIcon = document.getElementById('toggleIcon');
        
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

    // ✅ USAR AUTHSYSTEM para verificar sesión
    if (window.AuthSystem && window.AuthSystem.isLoggedIn()) {
        const user = window.AuthSystem.getCurrentUser();
        const urlParams = new URLSearchParams(window.location.search);
        const fromCart = urlParams.get('fromCart');
        const returnUrl = urlParams.get('return');
        
        window.AuthSystem.redirectUser(user, fromCart, returnUrl);
        return;
    }

    // ✅ MANEJAR LOGIN CON AUTHSYSTEM
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const rememberMe = document.getElementById('rememberMe').checked;
        const selectedRole = document.getElementById('userRole').value;

        if (!email || !password) {
            if (window.AuthSystem) {
                window.AuthSystem.showError('Por favor completa todos los campos');
            } else {
                alert('Por favor completa todos los campos');
            }
            return;
        }

        // ✅ USAR AUTHSYSTEM PARA LOGIN
        if (window.AuthSystem) {
            window.AuthSystem.login(email, password, rememberMe, selectedRole)
                .then((user) => {
                    window.AuthSystem.showSuccess(`¡Bienvenido ${user.name}! Redirigiendo...`);
                    
                    setTimeout(() => {
                        const urlParams = new URLSearchParams(window.location.search);
                        const fromCart = urlParams.get('fromCart');
                        const returnUrl = urlParams.get('return');
                        
                        window.AuthSystem.redirectUser(user, fromCart, returnUrl);
                    }, 1000);
                })
                .catch((error) => {
                    window.AuthSystem.showError(error);
                });
        } else {
            // Fallback si AuthSystem no está disponible
            alert('Sistema de autenticación no disponible');
        }
    });
});