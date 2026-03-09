const express = require('express');
const app = express();
const path = require('path');

app.use(express.json());
app.use(express.static('.'));

// --- BASE DE DATOS TEMPORAL ---
let usuarios = [
    { id: 1, nombre: "admin", pass: "123", rol: "administrador" },
    { id: 2, nombre: "profe1", pass: "123", rol: "docente" },
    { id: 3, nombre: "alumno1", pass: "123", rol: "estudiante" }
];

let tutorias = [];


// --- RUTAS DE USUARIOS ---

app.post('/api/login', (req, res) => {

    const { nombre, pass } = req.body;

    const user = usuarios.find(u => u.nombre === nombre && u.pass === pass);

    if (user) {
        res.json({ success: true, user });
    } else {
        res.status(401).json({ success: false });
    }

});


app.post('/api/registro', (req, res) => {

    const { nombre, pass, rol } = req.body;

    if (usuarios.find(u => u.nombre === nombre)) {
        return res.status(400).json({
            success: false,
            message: "Usuario ya existe"
        });
    }

    const nuevo = {
        id: Date.now(),
        nombre,
        pass,
        rol
    };

    usuarios.push(nuevo);

    res.json({ success: true });

});


app.get('/api/usuarios', (req, res) => {
    res.json(usuarios);
});


app.delete('/api/usuarios/:id', (req, res) => {

    usuarios = usuarios.filter(u => u.id != req.params.id);

    res.json({ success: true });

});


// --- RUTAS DE TUTORIAS ---

app.get('/api/tutorias', (req, res) => {
    res.json(tutorias);
});


app.post('/api/tutorias', (req, res) => {

    const { materia, lugar, hora, fecha, modalidad, docente } = req.body;

    const nuevaTutoria = {
        id: Date.now(),
        materia,
        lugar,
        hora,
        fecha,
        modalidad,
        docente,
        estudiantes: [],
        comentarios: []   // 👈 necesario para guardar comentarios
    };

    tutorias.push(nuevaTutoria);

    res.json({ success: true });

});


app.delete('/api/tutorias/:id', (req, res) => {

    tutorias = tutorias.filter(t => t.id != req.params.id);

    res.json({ success: true });

});


app.post('/api/tutorias/aceptar', (req, res) => {

    const { tutoriaId, alumnoNombre } = req.body;

    const tutoria = tutorias.find(t => t.id == tutoriaId);

    if (tutoria && !tutoria.estudiantes.includes(alumnoNombre)) {

        tutoria.estudiantes.push(alumnoNombre);

    }

    res.json({ success: true });

});


// --- COMENTARIOS DE TUTORIAS ---

app.post('/api/tutorias/comentario', (req, res) => {

    const { tutoriaId, usuario, texto } = req.body;

    const tutoria = tutorias.find(t => t.id == tutoriaId);

    if (!tutoria) {

        return res.status(404).json({
            success: false,
            message: "Tutoría no encontrada"
        });

    }

    tutoria.comentarios.push({
        usuario,
        texto
    });

    res.json({ success: true });

});


// --- INICIAR SERVIDOR ---

app.listen(3000, () => {

    console.log("----------------------------------------------");
    console.log("¡EXITO! El servidor está listo.");
    console.log("Abre en tu navegador: http://localhost:3000");
    console.log("----------------------------------------------");

});
