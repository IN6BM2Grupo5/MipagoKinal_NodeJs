const Producto = require("../models/productos.models");
const Pedidos = require('../models/pedidos.models')

//Agregar Productos
function agregarProductos(req, res) {
    var modeloProductos = new Producto();
    var parametros = req.body;
    if (req.user.rol == 'Admin_Cafeteria') {
        if (parametros.producto && parametros.descripcion && parametros.precio) {
            if (parametros.precio >= 0) {
                Producto.findOne({ producto: parametros.producto, tipo: 'Cafeteria' }, (err, productoExistente) => {
                    if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
                    if (!productoExistente) {
                        modeloProductos.producto = parametros.producto;
                        modeloProductos.descripcion = parametros.descripcion;
                        modeloProductos.precio = parametros.precio;
                        modeloProductos.estado = 'Disponible';
                        modeloProductos.tipo = 'Cafeteria';
                        modeloProductos.save((err, productoGuardado) => {
                            if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
                            if (!productoGuardado) return res.status(500).send({ mensaje: 'Error al guardar el producto' });
                            return res.status(200).send({ producto: productoGuardado });
                        });
                    } else {
                        return res.status(500).send({ mensaje: 'El producto ya se encuentra en el sistema' });
                    }
                })
            } else {
                return res.status(500).send({ mensaje: 'Ingrese un precion razonable' });
            }
        } else {
            return res.status(500).send({ mensaje: 'Ingresse los parametros necesarios' });
        }
    } else if (req.user.rol == 'Admin_Secretaria') {
        if (parametros.producto && parametros.descripcion && parametros.precio && parametros.stock) {
            if (parametros.stock > 0) {
                if (parametros.precio >= 0) {
                    Producto.findOne({ producto: parametros.producto, tipo: 'Secretaria' }, (err, productoExistente) => {
                        if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
                        if (!productoExistente) {
                            modeloProductos.producto = parametros.producto;
                            modeloProductos.descripcion = parametros.descripcion;
                            modeloProductos.precio = parametros.precio;
                            modeloProductos.stock = parametros.stock;
                            modeloProductos.estado = 'Disponible';
                            modeloProductos.tipo = 'Secretaria';
                            modeloProductos.save((err, productoGuardado) => {
                                if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
                                if (!productoGuardado) return res.status(500).send({ mensaje: 'Error al guardar el producto' });
                                return res.status(200).send({ producto: productoGuardado });
                            });
                        } else {
                            return res.status(500).send({ mensaje: 'El producto ya se encuentra en el sistema' });
                        }
                    })
                } else {
                    return res.status(500).send({ mensaje: 'Ingrese un precion razonable' });
                }
            } else {
                return res.status(500).send({ mensaje: 'Ingrese una cantidad del producto ' })
            }
        } else {
            return res.status(500).send({ mensaje: 'Ingresse los parametros necesarios' });
        }
    } else {
        return res.status(404).send({ mensaje: 'No esta autorizado' })
    }
}

//Editar Productos
function editarProductos(req, res) {
    var idProducto = req.params.idProducto;
    var parametros = req.body;
    if (req.user.rol == 'Admin_Cafeteria') {
        if (parametros.precio >= 0) {
            Producto.findById(idProducto, (err, infoProducto) => {
                if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
                if (!infoProducto) return res.status(500).send({ mensaje: 'Error al encontrar el producto' });
                Producto.findOne({ producto: parametros.producto, tipo: 'Cafeteria' }, (err, productoEncontrado) => {
                    if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
                    if (!productoEncontrado || parametros.producto == infoProducto.producto) {
                        Producto.findByIdAndUpdate(idProducto, (err, productoActualizado) => {
                            if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
                            if (!productoActualizado) return res.status(500).send({ mensaje: 'Error al actualizar los datos' });
                            return res.status(200).send({ producto: productoActualizado });
                        })
                    } else {
                        return res.status(500).send({ mensaje: 'Este producto ya se encuentra en el sistema' });
                    }
                })
            })
        } else {
            return res.status(500).send({ mensaje: 'Ingrese un precio razonable' });
        }
    } else if (req.user.rol == 'Admin_Secretaria') {
        if(parametros.precio>=0){
            Producto.findById(idProducto, (err, infoProducto) => {
                if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
                if (!infoProducto) return res.status(500).send({ mensaje: 'Error al encontrar el producto' });
                Producto.findOne({ producto: parametros.producto, tipo: 'Secretaria' }, (err, productoEncontrado) => {
                    if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
                    if (!productoEncontrado || parametros.producto == infoProducto.producto) {
                        Producto.findByIdAndUpdate(idProducto, (err, productoActualizado) => {
                            if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
                            if (!productoActualizado) return res.status(500).send({ mensaje: 'Error al actualizar los datos' });
                            return res.status(200).send({ producto: productoActualizado });
                        })
                    } else {
                        return res.status(500).send({ mensaje: 'Este producto ya se encuentra en el sistema' });
                    }
                })
            })
        }else{
            return res.status(500).send({mensaje:'Ingrese un precio razonable'})
        }
    } else {
        return res.status(500).send({ mensaje: 'No esta autorizado para editar productos' });
    }
}

//Editar Stock
function editarStock(req, res) {
    var idProducto = req.params.idProducto;
    if (req.user.rol == 'Admin_Secretaria') {
        Producto.findById(idProducto,(err,infoProducto)=>{
            if(err) return res.status(404).send({mensaje:'Error en la peticion'});
            if(!infoProducto) return res.status(500).send({mensaje:'Error al encontrar el producto'});
            if(Number(parametros.stock)+Number(infoProducto.stock)>=0){
                
            }else{
                return res.status(500).send({mesnaeje:'La cantidad a modificar'})
            }
        })
    } else {
        return res.status(500).send({ mensaje: 'No esta autorizado' });
    }
}

//Eliminar Productos
//productos de
//busquedas