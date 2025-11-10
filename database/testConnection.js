const mysql = require('mysql2');

// Configuración de la conexión
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',  // Reemplaza con tu usuario de MySQL si es diferente
  password: 'G5791',  // Reemplaza con tu contraseña de MySQL
  database: 'deliveryapp'
});

// Probar la conexión
connection.connect((err) => {
  if (err) {
    console.error('Error conectando a la base de datos:', err);
    return;
  }
  console.log('Conexión exitosa a la base de datos MySQL');
  
  // Hacer una consulta de prueba
  connection.query('SELECT COUNT(*) as total FROM users', (err, results) => {
    if (err) {
      console.error('Error en la consulta:', err);
    } else {
      console.log('Número total de usuarios:', results[0].total);
    }
    
    // Cerrar la conexión
    connection.end((err) => {
      if (err) {
        console.error('Error al cerrar la conexión:', err);
        return;
      }
      console.log('Conexión cerrada correctamente');
    });
  });
});