const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

/* =========================
   BASE DE DATOS EN MEMORIA
   ========================= */

let usuarios = [
{ id:1, nombre:"admin", password:"123", rol:"administrador"},
{ id:2, nombre:"docente1", password:"123", rol:"docente"},
{ id:3, nombre:"estudiante1", password:"123", rol:"estudiante"}
];

let tutorias = [];

let comentarios = [];


/* =========================
   LOGIN
   ========================= */

app.post('/api/login',(req,res)=>{

const {nombre,password}=req.body;

const usuario = usuarios.find(
u => u.nombre === nombre && u.password === password
);

if(usuario){

res.json({
success:true,
usuario
});

}else{

res.json({
success:false
});

}

});


/* =========================
   VER USUARIOS
   ========================= */

app.get('/api/usuarios',(req,res)=>{

res.json(usuarios);

});


/* =========================
   ELIMINAR USUARIO
   ========================= */

app.delete('/api/usuarios/:id',(req,res)=>{

const id = parseInt(req.params.id);

usuarios = usuarios.filter(
u => u.id !== id
);

res.json({
success:true
});

});


/* =========================
   CREAR TUTORIA
   ========================= */

app.post('/api/tutorias',(req,res)=>{

const {materia,lugar,fecha,hora,modalidad,docente} = req.body;

const nuevaTutoria = {

id: Date.now(),

materia,

lugar,

fecha,

hora,

modalidad,

docente,

estudiantes:[]

};

tutorias.push(nuevaTutoria);

res.json({
success:true
});

});


/* =========================
   VER TUTORIAS
   ========================= */

app.get('/api/tutorias',(req,res)=>{

res.json(tutorias);

});


/* =========================
   INSCRIBIRSE A TUTORIA
   ========================= */

app.post('/api/inscribirse',(req,res)=>{

const {tutoriaId,estudiante} = req.body;

const tutoria = tutorias.find(
t => t.id === tutoriaId
);

if(tutoria){

tutoria.estudiantes.push(estudiante);

res.json({
success:true
});

}else{

res.json({
success:false
});

}

});


/* =========================
   AGREGAR COMENTARIO
   ========================= */

app.post('/api/comentarios',(req,res)=>{

const {tutoriaId,usuario,comentario} = req.body;

const nuevoComentario = {

id: Date.now(),

tutoriaId,

usuario,

comentario

};

comentarios.push(nuevoComentario);

res.json({
success:true
});

});


/* =========================
   VER COMENTARIOS
   ========================= */

app.get('/api/comentarios/:tutoriaId',(req,res)=>{

const id = parseInt(req.params.tutoriaId);

const lista = comentarios.filter(
c => c.tutoriaId === id
);

res.json(lista);

});


/* =========================
   INICIAR SERVIDOR
   ========================= */

app.listen(PORT,()=>{

console.log("Servidor funcionando en http://localhost:"+PORT);

});
