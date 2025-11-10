// Configuración de la API
const API_URL = 'http://localhost:3000/api';

// Funciones de utilidad para llamadas a la API
const api = {
    // Auth
    login: async (credentials) => {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials)
        });
        return response.json();
    },

    register: async (userData) => {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });
        return response.json();
    },

    // Restaurants
    getRestaurants: async (filters = {}) => {
        const queryString = new URLSearchParams(filters).toString();
        const response = await fetch(`${API_URL}/restaurants?${queryString}`);
        return response.json();
    },

    getRestaurantById: async (id) => {
        const response = await fetch(`${API_URL}/restaurants/${id}`);
        return response.json();
    },

    // Orders
    createOrder: async (orderData) => {
        const response = await fetch(`${API_URL}/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(orderData)
        });
        return response.json();
    },

    getOrders: async () => {
        const response = await fetch(`${API_URL}/orders`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        return response.json();
    }
};

export default api;