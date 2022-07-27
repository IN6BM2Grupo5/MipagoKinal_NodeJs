const express = require('express');
const productosController = require('../controllers/productos.controller');
const md_autenticacion = require('../middlewares/autenticacion');

var api= express.Router();

//Agregar Productos
api.post('/productoConStock',md_autenticacion.Auth, productosController.agregarProductosConStock);
//Editar Productos
api.put('/editarProducto/:idProducto',md_autenticacion.Auth, productosController.editarProductos);
//Eliminar Productos
api.delete('/eliminarProductos/:idProducto',md_autenticacion.Auth, productosController.eliminarProducto);
//Productos
api.get('/productosCafeteria',md_autenticacion.Auth, productosController.productosCafeteria);
api.get('/productosSecretaria',md_autenticacion.Auth, productosController.productosSecretaria);
//Busquedas
api.get('/productoPorId/:idProducto',md_autenticacion.Auth, productosController.productoPorId);
api.get('/productoCafeteriaPorNombre/:producto',md_autenticacion.Auth, productosController.productosCafeteriaPorNombre);
api.get('/productoSecretariaPorNombre/:producto',md_autenticacion.Auth, productosController.productosSecretariaPorNombre);

module.exports = api;