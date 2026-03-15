const mysql = require("mysql")

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306 // Si DB_PORT no existe, usa 3306 por defecto
})

db.connect((err) => {
  if (err) {
    console.log("❌ Error conectando a MySQL:", err)
  } else {
    console.log("✅ Conectado a MySQL")
  }
})

module.exports = db