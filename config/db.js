const mysql = require("mysql")

const db = mysql.createConnection({
host: "localhost",
user: "root",
password: "",
database: "tutorias",
port: 3306
})

db.connect((err)=>{
if(err){
console.log("❌ Error conectando a MySQL:", err)
}else{
console.log("✅ Conectado a MySQL")
}
})

module.exports = db