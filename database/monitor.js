const mysql = require('mysql2');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'G5791',
    database: 'deliveryapp'
});

// Función para mostrar todas las órdenes con detalles
const showOrders = () => {
    const query = `
        SELECT 
            o.id as order_id,
            u.name as client_name,
            r.name as restaurant_name,
            o.status,
            o.total,
            o.created_at,
            GROUP_CONCAT(CONCAT(oi.quantity, 'x ', p.name) SEPARATOR ', ') as items
        FROM orders o
        JOIN users u ON o.client_id = u.id
        JOIN restaurants r ON o.restaurant_id = r.id
        JOIN order_items oi ON o.id = oi.order_id
        JOIN products p ON oi.product_id = p.id
        GROUP BY o.id
        ORDER BY o.created_at DESC
        LIMIT 5
    `;

    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error al consultar órdenes:', err);
            return;
        }
        console.log('\n=== Últimas 5 Órdenes ===');
        results.forEach(order => {
            console.log(`
Order ID: ${order.order_id}
Cliente: ${order.client_name}
Restaurante: ${order.restaurant_name}
Estado: ${order.status}
Total: $${order.total}
Items: ${order.items}
Fecha: ${order.created_at}
-------------------`);
        });
    });

    // Mostrar también el total de órdenes por estado
    const statusQuery = `
        SELECT status, COUNT(*) as count
        FROM orders
        GROUP BY status
    `;

    connection.query(statusQuery, (err, results) => {
        if (err) {
            console.error('Error al consultar estados:', err);
            return;
        }
        console.log('\n=== Resumen de Estados ===');
        results.forEach(status => {
            console.log(`${status.status}: ${status.count} órdenes`);
        });
    });
};

// Mostrar datos cada 5 segundos
console.log('Monitoreando órdenes en tiempo real (Ctrl+C para detener)...');
showOrders();
setInterval(showOrders, 5000);