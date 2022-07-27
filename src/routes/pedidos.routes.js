const express = require('express');
const pedidoController = require('../controllers/pedidos.controller');
const md_autenticacion = require('../middlewares/autenticacion');

var api = express.Router();

//Pedidos
api.post('/pedido/:idProducto', md_autenticacion.Auth, pedidoController.pedido);
api.post('/pedirMarbete', md_autenticacion.Auth, pedidoController.pedirMarbete);
//Cancelar Pedidos
api.put('/cancelarPedido/:idPedido', md_autenticacion.Auth, pedidoController.cancelarPedido);
//Confirmar Pedidos
api.put('/confirmarEntrega/:idPedido', md_autenticacion.Auth, pedidoController.confirmarEntrega);
//VerPedidos
api.get('/verPedidos', md_autenticacion.Auth, pedidoController.verPedidos);
api.get('/verPedidosAdminHoy', md_autenticacion.Auth, pedidoController.verPedidosAdminHoy);
//BuscarPedidos
api.get('/pedidosPorCarnet/:carnet', md_autenticacion.Auth, pedidoController.pedidosPorCarnet);
api.get('/pedidosPorNombre/:nombre', md_autenticacion.Auth, pedidoController.pedidosPorNombre);
api.get('/pedidosPorFecha/:fecha', md_autenticacion.Auth, pedidoController.pedidosPorFecha);

module.exports = api;