const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

let usuarios = [
{ id:1, nombre:"admin", password:"123", rol:"administrador", activo:true},
{ id:2, nombre:"docente1", password:"123", rol:"docente", activo:true},
{ id:3, nombre:"estudiante1", password:"123", rol:"estudiante", activo:true}
];

let tutorias=[];
let comentarios=[];
let chat=[];

/* LOGIN */

app.post('/api/login',(req,res)=>{

const {nombre,password}=req.body;

const usuario = usuarios.find(
u=>u.nombre===nombre && u.password===password
);

if(!usuario) return res.json({success:false});

if(!usuario.activo) return res.json({success:false});

res.json({success:true,usuario});

});

/* REGISTRO */

app.post('/api/registro',(req,res)=>{

const {nombre,password,rol}=req.body;

const existe=usuarios.find(u=>u.nombre===nombre);

if(existe) return res.json({success:false});

usuarios.push({
id:Date.now(),
nombre,
password,
rol,
activo:true
});

res.json({success:true});

});

/* USUARIOS */

app.get('/api/usuarios',(req,res)=>{
res.json(usuarios);
});

app.delete('/api/usuarios/:id',(req,res)=>{

const id=parseInt(req.params.id);

usuarios=usuarios.filter(u=>u.id!==id);

res.json({success:true});

});

app.put('/api/usuarios/bloquear/:id',(req,res)=>{

const id=parseInt(req.params.id);

const usuario=usuarios.find(u=>u.id===id);

if(usuario){
usuario.activo=!usuario.activo;
}

res.json({success:true});

});

/* CREAR USUARIO ADMIN */

app.post('/api/admin/crearUsuario',(req,res)=>{

const {nombre,password,rol}=req.body;

usuarios.push({
id:Date.now(),
nombre,
password,
rol,
activo:true
});

res.json({success:true});

});

/* ESTADISTICAS */

app.get('/api/admin/stats',(req,res)=>{

const docentes=usuarios.filter(u=>u.rol==="docente").length;
const estudiantes=usuarios.filter(u=>u.rol==="estudiante").length;

res.json({
usuarios:usuarios.length,
docentes,
estudiantes,
tutorias:tutorias.length
});

});

/* CREAR TUTORIA */

app.post('/api/tutorias',(req,res)=>{

const {materia,lugar,fecha,hora,docente,tipo}=req.body;

tutorias.push({
id:Date.now(),
materia,
lugar,
fecha,
hora,
docente,
tipo,
inscritos:0
});

res.json({success:true});

});

/* LISTAR TUTORIAS */

app.get('/api/tutorias',(req,res)=>{
res.json(tutorias);
});

/* ELIMINAR TUTORIA */

app.delete('/api/tutorias/:id',(req,res)=>{

const id=parseInt(req.params.id);

tutorias=tutorias.filter(t=>t.id!==id);

res.json({success:true});

});

/* RESERVAR TUTORIA */

app.post('/api/reservar',(req,res)=>{

const {usuario,materia}=req.body;

const tutoria = tutorias.find(t=>t.materia===materia);

if(!tutoria){
return res.json({success:false});
}

if(!tutoria.inscritos){
tutoria.inscritos = 0;
}

tutoria.inscritos++;

res.json({success:true});

});

/* COMENTARIOS */

app.post('/api/comentarios',(req,res)=>{

const {usuario,mensaje}=req.body;

comentarios.push({
id:Date.now(),
usuario,
mensaje
});

res.json({success:true});

});

app.get('/api/comentarios',(req,res)=>{
res.json(comentarios);
});

/* CHAT */

app.post('/api/chat',(req,res)=>{

const {usuario,mensaje}=req.body;

chat.push({
id:Date.now(),
usuario,
mensaje
});

res.json({success:true});

});

app.get('/api/chat',(req,res)=>{
res.json(chat);
});

app.listen(PORT,()=>{
console.log("Servidor funcionando en http://localhost:"+PORT);
});