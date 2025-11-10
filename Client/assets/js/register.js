// register.js - VERSIÓN CON AUTHSYSTEM
document.addEventListener('DOMContentLoaded', function() {
    // Toggle password visibility
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

    // Validación de teléfono (solo números)
    document.getElementById('phone').addEventListener('input', function(e) {
        this.value = this.value.replace(/\D/g, '');
    });

    // Validación de email en tiempo real
    document.getElementById('email').addEventListener('blur', function() {
        const email = this.value;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (email && !emailRegex.test(email)) {
            this.classList.add('is-invalid');
            if (!this.nextElementSibling || !this.nextElementSibling.classList.contains('invalid-feedback')) {
                const feedback = document.createElement('div');
                feedback.className = 'invalid-feedback';
                feedback.textContent = 'Por favor ingresa un email válido';
                this.parentNode.appendChild(feedback);
            }
        } else {
            this.classList.remove('is-invalid');
        }
    });

    // Validación de contraseñas coincidentes
    document.getElementById('confirmPassword').addEventListener('input', function() {
        const password = document.getElementById('password').value;
        const confirmPassword = this.value;
        
        if (confirmPassword && password !== confirmPassword) {
            this.classList.add('is-invalid');
            if (!this.nextElementSibling || !this.nextElementSibling.classList.contains('invalid-feedback')) {
                const feedback = document.createElement('div');
                feedback.className = 'invalid-feedback';
                feedback.textContent = 'Las contraseñas no coinciden';
                this.parentNode.appendChild(feedback);
            }
        } else {
            this.classList.remove('is-invalid');
        }
    });

    // ✅ MANEJAR REGISTRO CON AUTHSYSTEM
    document.getElementById('registerForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Obtener valores
        const userData = {
            fullName: document.getElementById('fullName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            password: document.getElementById('password').value,
            confirmPassword: document.getElementById('confirmPassword').value,
            address: document.getElementById('address').value,
            termsAccepted: document.getElementById('terms').checked,
            wantsPromotions: document.getElementById('promotions').checked
        };

        // ✅ USAR AUTHSYSTEM PARA REGISTRO
        if (window.AuthSystem) {
            window.AuthSystem.register(userData)
                .then((newUser) => {
                    window.AuthSystem.showSuccess('¡Cuenta creada exitosamente! Redirigiendo...');
                    
                    setTimeout(() => {
                        const urlParams = new URLSearchParams(window.location.search);
                        const fromCart = urlParams.get('fromCart');
                        const returnUrl = urlParams.get('return');
                        
                        window.AuthSystem.redirectUser(newUser, fromCart, returnUrl);
                    }, 2000);
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