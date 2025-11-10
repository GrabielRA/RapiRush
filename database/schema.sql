CREATE DATABASE IF NOT EXISTS deliveryapp;
USE deliveryapp;

-- Tabla de Usuarios (todos los tipos de usuarios)
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    role ENUM('admin', 'client', 'restaurant', 'delivery') NOT NULL,
    document_type ENUM('dni', 'ce', 'ruc') NOT NULL,
    document_number VARCHAR(20) NOT NULL,
    status ENUM('pending', 'active', 'inactive') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Zonas de Delivery
CREATE TABLE delivery_zones (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    status BOOLEAN DEFAULT true
);

-- Tabla de Restaurantes
CREATE TABLE restaurants (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    address TEXT NOT NULL,
    phone VARCHAR(20),
    food_type VARCHAR(50),
    category VARCHAR(50),
    opening_time TIME,
    closing_time TIME,
    delivery_fee DECIMAL(10,2),
    min_order DECIMAL(10,2),
    bank_account VARCHAR(50),
    owner_name VARCHAR(100),
    rating DECIMAL(3,2) DEFAULT 0,
    zone_id INT,
    image_url VARCHAR(255),
    status ENUM('pending', 'active', 'inactive') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (zone_id) REFERENCES delivery_zones(id)
);

-- Tabla de Repartidores
CREATE TABLE delivery_people (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    vehicle_type ENUM('bicycle', 'motorcycle', 'car') NOT NULL,
    license_plate VARCHAR(20),
    bank_account VARCHAR(50),
    work_zone INT,
    current_status ENUM('available', 'busy', 'offline') DEFAULT 'offline',
    current_location TEXT,
    rating DECIMAL(3,2) DEFAULT 0,
    vehicle_photo_url VARCHAR(255),
    license_photo_url VARCHAR(255),
    document_photo_url VARCHAR(255),
    background_check_status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (work_zone) REFERENCES delivery_zones(id)
);

-- Tabla de Productos
CREATE TABLE products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    restaurant_id INT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    category VARCHAR(50),
    image_url VARCHAR(255),
    status ENUM('available', 'out_of_stock') DEFAULT 'available',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(id)
);

-- Tabla de Direcciones de Entrega
CREATE TABLE delivery_addresses (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    address_type ENUM('home', 'work', 'other') DEFAULT 'home',
    address TEXT NOT NULL,
    reference TEXT,
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    is_default BOOLEAN DEFAULT false,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Tabla de Métodos de Pago
CREATE TABLE payment_methods (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    type ENUM('credit_card', 'debit_card', 'cash', 'digital_wallet') NOT NULL,
    provider VARCHAR(50),
    last_four VARCHAR(4),
    is_default BOOLEAN DEFAULT false,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Tabla de Pedidos
CREATE TABLE orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    client_id INT,
    restaurant_id INT,
    delivery_id INT,
    address_id INT,
    payment_method_id INT,
    status ENUM('pending', 'confirmed', 'preparing', 'ready', 'assigned', 'on_delivery', 'delivered', 'cancelled') DEFAULT 'pending',
    total DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    delivery_fee DECIMAL(10,2) NOT NULL,
    discount_amount DECIMAL(10,2) DEFAULT 0.00,
    contact_name VARCHAR(100),
    contact_phone VARCHAR(20),
    delivery_notes TEXT,
    scheduled_delivery TIMESTAMP NULL,
    estimated_time INT,
    coupon_code VARCHAR(50),
    payment_status ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES users(id),
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(id),
    FOREIGN KEY (delivery_id) REFERENCES delivery_people(id),
    FOREIGN KEY (address_id) REFERENCES delivery_addresses(id),
    FOREIGN KEY (payment_method_id) REFERENCES payment_methods(id)
);

-- Tabla de Detalles del Pedido
CREATE TABLE order_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT,
    product_id INT,
    quantity INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    notes TEXT,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Tabla de Seguimiento del Pedido
CREATE TABLE order_tracking (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT,
    status VARCHAR(50) NOT NULL,
    description TEXT,
    location TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id)
);

-- Tabla de Reviews/Calificaciones
CREATE TABLE reviews (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT,
    reviewer_id INT,
    reviewed_type ENUM('restaurant', 'delivery', 'client') NOT NULL,
    reviewed_id INT NOT NULL,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (reviewer_id) REFERENCES users(id)
);

-- Tabla de Documentos de Verificación
CREATE TABLE verification_documents (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    document_type VARCHAR(50),
    document_url VARCHAR(255),
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);