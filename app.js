const express = require('express');
const cors = require('cors');
var app = express();

const UsuarioRoutes = require('./src/routes/usuarios.routes');


app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(cors());

app.use('/api', UsuarioRoutes);


module.exports = app;