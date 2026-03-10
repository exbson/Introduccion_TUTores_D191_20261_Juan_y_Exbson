let currentUser = null;

/* LOGIN */

async function login(){

const res = await fetch('/api/login',{
method:'POST',
headers:{'Content-Type':'application/json'},
body:JSON.stringify({
nombre:document.getElementById("user").value,
password:document.getElementById("pass").value
})
});

const data = await res.json();

if(data.success){

currentUser = data.usuario;
showDash();

}else{

alert("Usuario o contraseña incorrectos");

}

}

/* REGISTRO */

async function registrar(){

const res = await fetch('/api/registro',{
method:'POST',
headers:{'Content-Type':'application/json'},
body:JSON.stringify({
nombre:document.getElementById("reg-user").value,
password:document.getElementById("reg-pass").value,
rol:document.getElementById("reg-rol").value
})
});

const data = await res.json();

if(data.success){

alert("Cuenta creada");
toggleAuth(false);

}else{

alert("Usuario ya existe");

}

}

/* CAMBIAR FORMULARIO */

function toggleAuth(reg){

document.getElementById("login-form").classList.toggle("hidden",reg);
document.getElementById("register-form").classList.toggle("hidden",!reg);

}

/* LOGOUT */

function logout(){
location.reload();
}

/* DASHBOARD */

function showDash(){

document.getElementById("view-auth").classList.add("hidden");
document.getElementById("view-dash").classList.remove("hidden");

document.getElementById("user-display").innerText="Hola "+currentUser.nombre;
document.getElementById("role-tag").innerText=currentUser.rol;

renderContent();

}

/* RENDER CONTENIDO */

function renderContent(){

const c=document.getElementById("content");

/* ADMIN */

if(currentUser.rol==="administrador"){

c.innerHTML=`

<h3>Panel administrador</h3>

<div class="grid">

<div class="stat">
<h2 id="stat-usuarios">0</h2>
Usuarios
</div>

<div class="stat">
<h2 id="stat-docentes">0</h2>
Docentes
</div>

<div class="stat">
<h2 id="stat-estudiantes">0</h2>
Estudiantes
</div>

<div class="stat">
<h2 id="stat-tutorias">0</h2>
Tutorías
</div>

</div>

<h3>Crear usuario</h3>

<input id="nuevo-nombre" placeholder="Nombre">
<input id="nuevo-pass" placeholder="Contraseña">

<select id="nuevo-rol">
<option value="administrador">Administrador</option>
<option value="docente">Docente</option>
<option value="estudiante">Estudiante</option>
</select>

<button onclick="crearUsuarioAdmin()" class="btn-success">
Crear usuario
</button>

<h3>Buscar usuario</h3>

<input id="buscar" onkeyup="buscarUsuario()" placeholder="Buscar...">

<h3>Usuarios</h3>

<div id="lista-usuarios"></div>

<h3>Tutorías</h3>

<div id="lista-tutorias"></div>

`;

cargarStats();
cargarUsuarios();
cargarTutorias();

}

/* DOCENTE */

if(currentUser.rol==="docente"){

c.innerHTML=`

<h3>Crear tutoría</h3>

<input id="materia" placeholder="Materia">

<select id="tipo">
<option value="presencial">Presencial</option>
<option value="virtual">Virtual</option>
</select>

<input id="lugar" placeholder="Lugar o enlace">

<input type="date" id="fecha">
<input type="time" id="hora">

<button onclick="crearTutoria()" class="btn-primary">
Crear tutoría
</button>

<h3>Mis tutorías</h3>

<div id="lista-tutorias"></div>

`;

cargarTutorias();

}

/* ESTUDIANTE */

if(currentUser.rol==="estudiante"){

c.innerHTML=`

<h3>Tutorías disponibles</h3>

<p>Selecciona una tutoría y participa en los comentarios.</p>

<div id="lista-tutorias"></div>

<h3>Comentarios de tutorías</h3>

<textarea id="comentario" placeholder="Escribe tu comentario"></textarea>

<button onclick="enviarComentario()" class="btn-primary">
Enviar comentario
</button>

<div id="lista-comentarios"></div>

`;

cargarTutorias();
cargarComentarios();

}

}

/* ESTADISTICAS */

async function cargarStats(){

const res=await fetch('/api/admin/stats');
const data=await res.json();

document.getElementById("stat-usuarios").innerText=data.usuarios;
document.getElementById("stat-docentes").innerText=data.docentes;
document.getElementById("stat-estudiantes").innerText=data.estudiantes;
document.getElementById("stat-tutorias").innerText=data.tutorias;

}

/* CREAR USUARIO */

async function crearUsuarioAdmin(){

await fetch('/api/admin/crearUsuario',{
method:'POST',
headers:{'Content-Type':'application/json'},
body:JSON.stringify({
nombre:document.getElementById("nuevo-nombre").value,
password:document.getElementById("nuevo-pass").value,
rol:document.getElementById("nuevo-rol").value
})
});

document.getElementById("nuevo-nombre").value="";
document.getElementById("nuevo-pass").value="";

cargarUsuarios();
cargarStats();

}

/* BUSCAR USUARIO */

function buscarUsuario(){

const texto=document.getElementById("buscar").value.toLowerCase();

document.querySelectorAll("#lista-usuarios .item").forEach(i=>{

i.style.display=i.innerText.toLowerCase().includes(texto)?"flex":"none";

});

}

/* CARGAR USUARIOS */

async function cargarUsuarios(){

const res=await fetch('/api/usuarios');
const data=await res.json();

const div=document.getElementById("lista-usuarios");

if(!div) return;

div.innerHTML="";

data.forEach(u=>{

div.innerHTML+=`

<div class="item">

<div>
<b>${u.nombre}</b> (${u.rol})
</div>

<div>

<button onclick="eliminarUsuario('${u.nombre}')" class="btn-danger">
Eliminar
</button>

</div>

</div>

`;

});

}

/* ELIMINAR USUARIO */

async function eliminarUsuario(nombre){

if(!confirm("¿Eliminar usuario?")) return;

await fetch('/api/admin/eliminarUsuario',{
method:'POST',
headers:{'Content-Type':'application/json'},
body:JSON.stringify({nombre})
});

cargarUsuarios();
cargarStats();

}

/* CREAR TUTORIA */

async function crearTutoria(){

await fetch('/api/tutorias',{
method:'POST',
headers:{'Content-Type':'application/json'},
body:JSON.stringify({
materia:document.getElementById("materia").value,
lugar:document.getElementById("lugar").value,
fecha:document.getElementById("fecha").value,
hora:document.getElementById("hora").value,
docente:currentUser.nombre
})
});

renderContent();

}

/* CARGAR TUTORIAS */

async function cargarTutorias(){

const res=await fetch('/api/tutorias');
const data=await res.json();

const div=document.getElementById("lista-tutorias");

if(!div) return;

div.innerHTML="";

data.forEach(t=>{

div.innerHTML+=`

<div class="item">

<div>

<h4>${t.materia}</h4>

<p><b>Docente:</b> ${t.docente}</p>

<p><b>Fecha:</b> ${t.fecha}</p>

<p><b>Hora:</b> ${t.hora}</p>

<p><b>Tipo:</b> ${t.tipo || "presencial"}</p>

<p><b>Lugar / enlace:</b> ${t.lugar || "Por confirmar"}</p>

<p><b>Estudiantes inscritos:</b> ${t.inscritos || 0}</p>

<button onclick="reservarTutoria('${t.materia}')" class="btn-success">
Reservar tutoría
</button>

</div>

</div>

`;

});

}

/* COMENTARIOS */

async function enviarComentario(){

const mensaje=document.getElementById("comentario").value;

if(mensaje==="") return;

await fetch('/api/comentarios',{
method:'POST',
headers:{'Content-Type':'application/json'},
body:JSON.stringify({
usuario:currentUser.nombre,
mensaje
})
});

document.getElementById("comentario").value="";

cargarComentarios();

}

async function cargarComentarios(){

const res=await fetch('/api/comentarios');
const data=await res.json();

const div=document.getElementById("lista-comentarios");

if(!div) return;

div.innerHTML="";

data.forEach(c=>{

div.innerHTML+=`

<div class="item">

<b>${c.usuario}</b>
<p>${c.mensaje}</p>

</div>

`;

});

}

/* RESERVAR TUTORIA */

async function reservarTutoria(materia){

const res = await fetch('/api/reservar',{
method:'POST',
headers:{'Content-Type':'application/json'},
body:JSON.stringify({
usuario:currentUser.nombre,
materia:materia
})
});

const data = await res.json();

if(data.success){

alert("Tutoría reservada");
renderContent();

}else{

alert("No se pudo reservar");

}

}