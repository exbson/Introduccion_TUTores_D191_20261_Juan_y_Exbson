const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

let usuarios = [
{ id:1, nombre:"admin", password:"123", rol:"administrador"},
{ id:2, nombre:"docente1", password:"123", rol:"docente"},
{ id:3, nombre:"estudiante1", password:"123", rol:"estudiante"}
];

let tutorias=[];



app.post('/api/login',(req,res)=>{

const {nombre,password}=req.body;

const usuario = usuarios.find(
u=>u.nombre===nombre && u.password===password
);

if(usuario){

res.json({success:true,usuario});

}else{

res.json({success:false});

}

});



app.post('/api/registro',(req,res)=>{

const {nombre,password,rol}=req.body;

const existe=usuarios.find(u=>u.nombre===nombre);

if(existe){

return res.json({success:false});

}

usuarios.push({

id:Date.now(),

nombre,

password,

rol

});

res.json({success:true});

});



app.get('/api/usuarios',(req,res)=>{

res.json(usuarios);

});



app.delete('/api/usuarios/:id',(req,res)=>{

const id=parseInt(req.params.id);

usuarios=usuarios.filter(u=>u.id!==id);

res.json({success:true});

});



app.post('/api/tutorias',(req,res)=>{

const {materia,lugar,fecha,hora,docente}=req.body;

tutorias.push({

id:Date.now(),

materia,

lugar,

fecha,

hora,

docente

});

res.json({success:true});

});



app.get('/api/tutorias',(req,res)=>{

res.json(tutorias);

});



app.delete('/api/tutorias/:id',(req,res)=>{

const id=parseInt(req.params.id);

tutorias=tutorias.filter(t=>t.id!==id);

res.json({success:true});

});

app.listen(PORT,()=>{

console.log("Servidor funcionando en http://localhost:"+PORT);

});
