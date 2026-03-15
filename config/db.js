const mysql = require("mysql")

const conexion = mysql.createConnection({

host:"localhost",
user:"root",
password:"",
database:"tutorias"

})

conexion.connect(function(err){

if(err){

console.log("Error de conexión",err)

}else{

console.log("Conectado a MySQL")

}

})

module.exports = conexion