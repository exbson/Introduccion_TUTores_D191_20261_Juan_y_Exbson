const mysql = require("mysql")

const db = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "",
  database: "tutorias",
  port: 3306,
  multipleStatements: true
})

db.connect((err) => {
  if (err) {
    console.error("❌ Error conectando a MySQL:", err)
  } else {
    console.log("✅ Conectado a MySQL")
  }
})

module.exports = db