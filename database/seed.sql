USE deliveryapp;

-- Insertar zonas de delivery
INSERT INTO delivery_zones (name, description) VALUES
('Zona Norte', 'Área norte de la ciudad'),
('Zona Sur', 'Área sur de la ciudad'),
('Zona Centro', 'Centro de la ciudad');

-- Insertar usuarios de prueba
INSERT INTO users (email, password, name, phone, address, role, document_type, document_number, status) VALUES
-- La contraseña es '123456' hasheada con bcrypt
('admin@demo.com', '$2a$10$XgXLGkZ9Uu8zd9BmKX2Gh.RXtSBqMBDqhN6ILkwVcOqbBE.s8n.RK', 'Administrador', '999888777', 'Oficina Central', 'admin', 'dni', '12345678', 'active'),
('restaurant@demo.com', '$2a$10$XgXLGkZ9Uu8zd9BmKX2Gh.RXtSBqMBDqhN6ILkwVcOqbBE.s8n.RK', 'Dueño Restaurante', '999888666', 'Av. Principal 123', 'restaurant', 'ruc', '20123456789', 'active'),
('delivery@demo.com', '$2a$10$XgXLGkZ9Uu8zd9BmKX2Gh.RXtSBqMBDqhN6ILkwVcOqbBE.s8n.RK', 'Repartidor Demo', '999888555', 'Calle Los Pinos 123', 'delivery', 'dni', '87654321', 'active'),
('cliente@demo.com', '$2a$10$XgXLGkZ9Uu8zd9BmKX2Gh.RXtSBqMBDqhN6ILkwVcOqbBE.s8n.RK', 'Cliente Demo', '999888444', 'Urb. Las Flores 123', 'client', 'dni', '76543210', 'active');

-- Insertar restaurantes de prueba
INSERT INTO restaurants (user_id, name, description, address, phone, food_type, category, opening_time, closing_time, delivery_fee, min_order, owner_name, zone_id, image_url, status) VALUES
(2, 'La Pizzería Italiana', 'Las mejores pizzas de la ciudad', 'Av. Principal 123', '999777666', 'Italiana', 'pizza', '11:00:00', '23:00:00', 5.00, 20.00, 'Giuseppe Italiano', 1, 'https://via.placeholder.com/400x200', 'active'),
(2, 'Burger House', 'Hamburguesas artesanales', 'Calle Comercial 456', '999777555', 'Americana', 'burger', '12:00:00', '23:00:00', 4.00, 15.00, 'John Burger', 2, 'https://via.placeholder.com/400x200', 'active'),
(2, 'Sushi Master', 'El mejor sushi de la ciudad', 'Plaza Central 789', '999777444', 'Japonesa', 'sushi', '12:00:00', '22:00:00', 6.00, 25.00, 'Akira Sushi', 3, 'https://via.placeholder.com/400x200', 'active');

-- Insertar productos de prueba
INSERT INTO products (restaurant_id, name, description, price, category, image_url) VALUES
-- Productos para La Pizzería Italiana
(1, 'Pizza Margherita', 'Tomate, mozzarella y albahaca fresca', 12.00, 'pizza', 'https://via.placeholder.com/200x200'),
(1, 'Pizza Pepperoni', 'Pepperoni con queso mozzarella', 14.00, 'pizza', 'https://via.placeholder.com/200x200'),
(1, 'Pizza Hawaiana', 'Jamón, piña y queso', 13.50, 'pizza', 'https://via.placeholder.com/200x200'),

-- Productos para Burger House
(2, 'Hamburguesa Clásica', 'Carne, lechuga, tomate, cebolla', 8.50, 'burger', 'https://via.placeholder.com/200x200'),
(2, 'Hamburguesa BBQ', 'Carne, salsa BBQ, cebolla caramelizada', 10.00, 'burger', 'https://via.placeholder.com/200x200'),
(2, 'Papas Fritas', 'Papas crujientes con sal', 4.50, 'sides', 'https://via.placeholder.com/200x200'),

-- Productos para Sushi Master
(3, 'Combo Sushi (20 piezas)', 'Variedad de sushi fresco', 28.00, 'sushi', 'https://via.placeholder.com/200x200'),
(3, 'Sashimi Salmón', 'Salmón fresco cortado finamente', 15.00, 'sushi', 'https://via.placeholder.com/200x200'),
(3, 'Rollo California', 'Cangrejo, aguacate, pepino', 12.00, 'sushi', 'https://via.placeholder.com/200x200');

-- Insertar repartidor de prueba
INSERT INTO delivery_people (user_id, vehicle_type, license_plate, bank_account, work_zone, current_status, rating) VALUES
(3, 'motorcycle', 'ABC-123', '123-456-789', 1, 'available', 4.5);

-- Insertar dirección de entrega de prueba
INSERT INTO delivery_addresses (user_id, address_type, address, reference, is_default) VALUES
(4, 'home', 'Urb. Las Flores 123', 'Casa blanca de dos pisos', true);

-- Insertar método de pago de prueba
INSERT INTO payment_methods (user_id, type, provider, last_four, is_default) VALUES
(4, 'credit_card', 'VISA', '4532', true);

-- Insertar una orden de prueba
INSERT INTO orders (client_id, restaurant_id, delivery_id, address_id, payment_method_id, status, total, subtotal, delivery_fee, contact_name, contact_phone, estimated_time) VALUES
(4, 1, 1, 1, 1, 'preparing', 31.50, 26.50, 5.00, 'Cliente Demo', '999888444', 30);

-- Insertar items de la orden de prueba
INSERT INTO order_items (order_id, product_id, quantity, price, notes) VALUES
(1, 1, 2, 12.00, NULL),
(1, 2, 1, 14.00, 'Extra queso');

-- Insertar seguimiento del pedido
INSERT INTO order_tracking (order_id, status, description) VALUES
(1, 'confirmed', 'Pedido confirmado por el restaurante'),
(1, 'preparing', 'El restaurante está preparando tu pedido');

-- Insertar reviews de prueba
INSERT INTO reviews (order_id, reviewer_id, reviewed_type, reviewed_id, rating, comment) VALUES
(1, 4, 'restaurant', 1, 5, 'Excelente servicio y comida muy rica'),
(1, 4, 'delivery', 1, 4, 'Buen servicio de entrega');

-- Insertar documentos de verificación de prueba
INSERT INTO verification_documents (user_id, document_type, document_url, status) VALUES
(3, 'license', 'https://example.com/docs/license1.pdf', 'approved'),
(3, 'dni', 'https://example.com/docs/dni1.pdf', 'approved');