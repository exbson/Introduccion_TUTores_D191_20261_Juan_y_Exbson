const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const session = require("express-session")

const db = require("./config/db")

const app = express()

app.use(cors())
app.use(bodyParser.json())
app.use(express.static("public"))

app.use(session({
secret:"tutorias",
resave:false,
saveUninitialized:true
}))

/* ================= LOGIN ================= */

app.post("/login",(req,res)=>{

let {usuario,password} = req.body

let sql="SELECT * FROM usuarios WHERE nombre=? AND password=?"

db.query(sql,[usuario,password],(err,result)=>{

if(err){
console.log(err)
return res.json({error:"Error servidor"})
}

if(result.length===0){
return res.json({error:"Usuario o contraseña incorrectos"})
}

let user=result[0]

if(user.estado==="bloqueado"){
return res.json({error:"Usuario bloqueado"})
}

req.session.user=user

res.json({
id:user.id,
nombre:user.nombre,
rol:user.rol
})

})

})

/* ================= USUARIO ACTUAL ================= */

app.get("/usuarioActual",(req,res)=>{

if(!req.session.user){
return res.json({})
}

res.json({
id:req.session.user.id,
nombre:req.session.user.nombre,
rol:req.session.user.rol
})

})

/* ================= REGISTRO USUARIO ================= */

app.post("/registro",(req,res)=>{

let {usuario,password,rol} = req.body

let sql = `
INSERT INTO usuarios(nombre,password,rol,estado)
VALUES(?,?,?, 'activo')
`

db.query(sql,[usuario,password,rol],(err,result)=>{

if(err){
console.log(err)
return res.json({error:"Error al crear usuario"})
}

res.json({mensaje:"Usuario creado correctamente"})

})

})

/* ================= LISTAR USUARIOS ================= */

app.get("/usuarios",(req,res)=>{

db.query("SELECT * FROM usuarios",(err,result)=>{

if(err){
console.log(err)
return res.json([])
}

res.json(result)

})

})

/* ================= BLOQUEAR USUARIO ================= */

app.post("/bloquear",(req,res)=>{

let {id} = req.body

let sql = "UPDATE usuarios SET estado='bloqueado' WHERE id=?"

db.query(sql,[id],(err)=>{

if(err){
console.log(err)
return res.json({error:"No se pudo bloquear"})
}

res.json({mensaje:"Usuario bloqueado"})

})

})

/* ================= ACTIVAR USUARIO ================= */

app.post("/activar",(req,res)=>{

let {id} = req.body

let sql = "UPDATE usuarios SET estado='activo' WHERE id=?"

db.query(sql,[id],(err)=>{

if(err){
console.log(err)
return res.json({error:"No se pudo activar"})
}

res.json({mensaje:"Usuario activado"})

})

})

/* ================= ELIMINAR USUARIO ================= */

app.post("/eliminarUsuario",(req,res)=>{

let {id} = req.body

db.query("SELECT rol FROM usuarios WHERE id=?",[id],(err,result)=>{

if(result.length===0){
return res.json({error:"Usuario no existe"})
}

if(result[0].rol==="admin"){
return res.json({error:"No se puede eliminar un administrador"})
}

let sql="DELETE FROM usuarios WHERE id=?"

db.query(sql,[id],(err)=>{

if(err){
console.log(err)
return res.json({error:"No se pudo eliminar"})
}

res.json({mensaje:"Usuario eliminado"})

})

})

})

/* ================= CREAR TUTORIA ================= */

app.post("/crearTutoria",(req,res)=>{

if(!req.session.user){
return res.json({error:"Debes iniciar sesión"})
}

if(req.session.user.rol!=="docente"){
return res.json({error:"Solo docentes pueden crear tutorías"})
}

let {materia,salon,fecha,hora,tipo}=req.body
let docente_id=req.session.user.id

let sql=`
INSERT INTO tutorias
(materia,salon,fecha,hora,tipo,docente_id)
VALUES(?,?,?,?,?,?)
`

db.query(sql,[materia,salon,fecha,hora,tipo,docente_id],(err)=>{

if(err){
console.log(err)
return res.json({error:"Error al crear tutoría"})
}

res.json({mensaje:"Tutoría creada"})

})

})

/* ================= ELIMINAR TUTORIA ================= */

app.post("/eliminarTutoria",(req,res)=>{

if(!req.session.user){
return res.json({error:"Debes iniciar sesión"})
}

if(req.session.user.rol!=="docente"){
return res.json({error:"Solo docentes pueden eliminar tutorías"})
}

let {id} = req.body
let docente_id = req.session.user.id

let sql = "DELETE FROM tutorias WHERE id=? AND docente_id=?"

db.query(sql,[id,docente_id],(err,result)=>{

if(err){
console.log(err)
return res.json({error:"No se pudo eliminar"})
}

if(result.affectedRows===0){
return res.json({
error:"⛔ Acción no permitida. Solo puedes eliminar las tutorías que tú creaste."
})
}

res.json({mensaje:"Tutoría eliminada correctamente"})

})

})

/* ================= LISTAR TUTORIAS ================= */

app.get("/tutorias",(req,res)=>{

let sql=`
SELECT 
t.id,
t.materia,
t.salon,
t.fecha,
t.hora,
t.tipo,
u.nombre AS docente,
COUNT(DISTINCT r.estudiante_id) AS reservas
FROM tutorias t
JOIN usuarios u ON t.docente_id=u.id
LEFT JOIN reservas r ON r.tutoria_id=t.id
GROUP BY t.id
`

db.query(sql,(err,tutorias)=>{

if(err){
console.log(err)
return res.json([])
}

let sqlComentarios=`
SELECT 
r.tutoria_id,
r.comentario,
u.nombre AS usuario
FROM reservas r
JOIN usuarios u ON r.estudiante_id=u.id
WHERE r.comentario IS NOT NULL AND r.comentario!=''
`

db.query(sqlComentarios,(err,comentarios)=>{

if(err){
console.log(err)
comentarios=[]
}

tutorias.forEach(t=>{

t.comentarios=comentarios
.filter(c=>c.tutoria_id===t.id)
.map(c=>({
usuario:c.usuario,
texto:c.comentario
}))

})

res.json(tutorias)

})

})

})

/* ================= RESERVAR O COMENTAR ================= */

app.post("/reservar",(req,res)=>{

if(!req.session.user){
return res.json({error:"Debes iniciar sesión"})
}

let estudiante_id=req.session.user.id
let {tutoria_id,comentario}=req.body

let verificar=`
SELECT * FROM reservas
WHERE estudiante_id=? AND tutoria_id=?
`

db.query(verificar,[estudiante_id,tutoria_id],(err,result)=>{

if(err){
console.log(err)
return res.json({error:"Error servidor"})
}

if(result.length>0){

if(comentario && comentario.trim()!==""){

let sqlActualizar=`
UPDATE reservas
SET comentario=?
WHERE estudiante_id=? AND tutoria_id=?
`

db.query(sqlActualizar,[comentario,estudiante_id,tutoria_id],(err)=>{

if(err){
console.log(err)
return res.json({error:"No se pudo guardar comentario"})
}

return res.json({mensaje:"Comentario guardado"})

})

}else{
return res.json({error:"Ya reservaste esta tutoría"})
}

}else{

let sql=`
INSERT INTO reservas(estudiante_id,tutoria_id,comentario)
VALUES(?,?,?)
`

db.query(sql,[estudiante_id,tutoria_id,comentario || ""],(err)=>{

if(err){
console.log(err)
return res.json({error:"No se pudo reservar"})
}

res.json({mensaje:"Reserva creada"})

})

}

})

})

/* ================= CERRAR SESION ================= */

app.get("/logout",(req,res)=>{

req.session.destroy()

res.json({mensaje:"Sesión cerrada"})

})

/* ================= SERVIDOR ================= */

app.listen(3000,()=>{

console.log("Servidor corriendo en http://localhost:3000")

})