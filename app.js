const express = require('express');
const cors = require('cors');
var app = express();

const UsuarioRoutes = require('./src/routes/usuarios.routes');
const ProductoRoutes = require('./src/routes/productos.routes');
const PedidosRoutes = require('./src/routes/pedidos.routes');


app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(cors());

app.use('/api', UsuarioRoutes,ProductoRoutes,PedidosRoutes);


module.exports = app;