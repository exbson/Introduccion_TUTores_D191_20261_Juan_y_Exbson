function login(){

let nombre=document.getElementById("usuario").value
let password=document.getElementById("password").value

fetch("/login",{

method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({nombre,password})

})
.then(res=>res.json())
.then(data=>{

if(data.error){

alert(data.error)
return

}

if(data.rol=="estudiante"){

window.location="estudiante.html"

}

if(data.rol=="docente"){

window.location="docente.html"

}

if(data.rol=="admin"){

window.location="admin.html"

}

})

}

function crear(){

let nombre=document.getElementById("usuario").value
let password=document.getElementById("password").value
let rol=document.getElementById("rol").value

fetch("/registro",{

method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({nombre,password,rol})

})

alert("usuario creado")

}