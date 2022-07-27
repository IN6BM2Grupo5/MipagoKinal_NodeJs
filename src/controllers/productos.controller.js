const Producto = require("../models/productos.models");
const Pedidos = require('../models/pedidos.models');

//Agregar Productos
function agregarProductosConStock(req, res) {
    var modeloProductos = new Producto();
    var parametros = req.body;
    if(req.user.rol == 'Admin_Cafeteria' || req.user.rol=='Admin_Secretaria'){
        if(parametros.subTipo=='Si'){
            if (req.user.rol == 'Admin_Cafeteria') {
                if (parametros.producto && parametros.descripcion && parametros.precio && parametros.stock) {
                    if (parametros.stock > 0) {
                        if (parametros.precio >= 0) {
                            Producto.findOne({ producto: parametros.producto, tipo: 'Cafeteria' }, (err, productoExistente) => {
                                if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
                                if (!productoExistente) {
                                    modeloProductos.producto = parametros.producto;
                                    modeloProductos.descripcion = parametros.descripcion;
                                    modeloProductos.precio = parametros.precio;
                                    modeloProductos.stock = parametros.stock;
                                    modeloProductos.estado = 'Disponible';
                                    modeloProductos.tipo = 'Cafeteria';
                                    modeloProductos.subTipo = "ConStock";
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
                                    modeloProductos.subTipo = "ConStock";
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
            }
        }else if(parametros.subTipo='No'){
            if (req.user.rol == 'Admin_Cafeteria') {
                if (parametros.producto && parametros.descripcion && parametros.precio) {
                    if (parametros.precio >= 0) {
                        Producto.findOne({ producto: parametros.producto, tipo: 'Cafeteria' }, (err, productoExistente) => {
                            if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
                            if (!productoExistente) {
                                modeloProductos.producto = parametros.producto;
                                modeloProductos.descripcion = parametros.descripcion;
                                modeloProductos.precio = parametros.precio;
                                modeloProductos.stock = 0;
                                modeloProductos.estado = 'Disponible';
                                modeloProductos.tipo = 'Cafeteria';
                                modeloProductos.subTipo = "SinStock";
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
                if (parametros.producto && parametros.descripcion && parametros.precio) {
                    if (parametros.precio >= 0) {
                        Producto.findOne({ producto: parametros.producto, tipo: 'Secretaria' }, (err, productoExistente) => {
                            if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
                            if (!productoExistente) {
                                modeloProductos.producto = parametros.producto;
                                modeloProductos.descripcion = parametros.descripcion;
                                modeloProductos.precio = parametros.precio;
                                modeloProductos.stock = 0;
                                modeloProductos.estado = 'Disponible';
                                modeloProductos.tipo = 'Secretaria';
                                modeloProductos.subTipo = "SinStock";
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
            }
        }else{
            return res.status(500).send({mensaje:'Hay campos incompletos'})
        }
    }else{
        return res.status(500).send({mensaje:'No esta autorizado para agregar Productos'})
    }
}

//Editar Productos
function editarProductos(req, res) {
    var idProducto = req.params.idProducto;
    var parametros = req.body;
    Pedidos.findOne({ idProducto: idProducto }, (err, pedidoEncontrado) => {
        if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
        if (!pedidoEncontrado) {
            Producto.findById(idProducto, (err, infoProducto) => {
                if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
                if (!infoProducto) return res.status(500).send({ mensaje: 'No se encontro el producto' });
                if (req.user.rol == 'Admin_Cafeteria' && infoProducto.tipo == 'Cafeteria') {
                    if (parametros.precio >= 0) {
                        Producto.findOne({ producto: parametros.producto, tipo: 'Cafeteria' }, (err, productoEncontrado) => {
                            if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
                            if (!productoEncontrado || parametros.producto == infoProducto.producto) {
                                if (parametros.subTipo == 'No') {
                                    parametros.stock = 0
                                    parametros.subTipo= "SinStock"
                                }else if(parametros.subTipo == 'Si'){
                                    parametros.subTipo='ConStock'
                                }
                                Producto.findByIdAndUpdate(idProducto,{producto:parametros.producto,precio:parametros.precio,estado:parametros.estado,subTipo:parametros.subTipo} ,{new:true}, (err, productoActualizado) => {
                                    if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
                                    if (!productoActualizado) return res.status(500).send({ mensaje: 'Error al actualizar los datos' });
                                    Producto.findByIdAndUpdate(idProducto, { $inc: { stock: parametros.stock } }, { new: true },
                                        (err, productoActualizado) => {
                                            if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
                                            if (!productoActualizado) return res.status(404).send({ mensaje: 'Error al Editar el Producto' })
                                            return res.status(200).send({ producto: productoActualizado });
                                        })
                                    return res.status(200).send({ producto: productoActualizado });
                                })
                            } else {
                                return res.status(500).send({ mensaje: 'Este producto ya se encuentra en el sistema' });
                            }
                        })
                    } else {
                        return res.status(500).send({ mensaje: 'Ingrese un precio razonable' });
                    }
                } else if (req.user.rol == 'Admin_Secretaria') {
                    if (parametros.precio >= 0) {
                        Producto.findOne({ producto: parametros.producto, tipo: 'Secretaria' }, (err, productoEncontrado) => {
                            if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
                            if (!productoEncontrado || parametros.producto == infoProducto.producto) {
                                
                                if (parametros.subTipo == 'No') {
                                    parametros.stock = 0
                                    parametros.subTipo= "SinStock"
                                }else if(parametros.subTipo == 'Si'){
                                    parametros.subTipo='ConStock'
                                }
                                Producto.findByIdAndUpdate(idProducto,{producto:parametros.producto,precio:parametros.precio,estado:parametros.estado,subTipo:parametros.subTipo} ,{new:true}, (err, productoActualizado) => {
                                    if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
                                    if (!productoActualizado) return res.status(500).send({ mensaje: 'Error al actualizar los datos' });
                                    Producto.findByIdAndUpdate(idProducto, { $inc: { stock: parametros.stock } }, { new: true },
                                        (err, productoActualizado) => {
                                            if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
                                            if (!productoActualizado) return res.status(404).send({ mensaje: 'Error al Editar el Producto' })
                                            return res.status(200).send({ producto: productoActualizado });
                                        })
                                    return res.status(200).send({ producto: productoActualizado });
                                })
                            } else {
                                return res.status(500).send({ mensaje: 'Este producto ya se encuentra en el sistema' });
                            }
                        })
                    } else {
                        return res.status(500).send({ mensaje: 'Ingrese un precio razonable' })
                    }
                } else {
                    return res.status(500).send({ mensaje: 'No esta autorizado para editar productos' });
                }
            })
        } else {
            return res.status(500).send({ mensaje: 'El producto esta en pedidos, si desea hacer algun cambio cancele los pedidos o completelos' });
        }
    })
}

//Editar Stock
function editarStock(req, res) {
    var idProducto = req.params.idProducto;
    Producto.findById(idProducto, (err, infoProducto) => {
        if (err) return res.status(404).send({ mensaje: "Error en la peticion" });
        if (!infoProducto) return res.status(500).send({ mensaje: "No se encontro su producto" });
        if (infoProducto.subTipo == 'ConStock') {
            if (req.user.rol == 'Admin_Secretaria' && infoProducto.tipo == "Secretaria" && infoProducto.subTipo == "ConStock") {
                if (Number(parametros.stock) + Number(infoProducto.stock) >= 0) {
                    Producto.findByIdAndUpdate(idProducto, { $inc: { stock: parametros.stock } }, { new: true },
                        (err, productoActualizado) => {
                            if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
                            if (!productoActualizado) return res.status(404).send({ mensaje: 'Error al Editar el Producto' })
                            return res.status(200).send({ producto: productoActualizado });
                        })
                } else {
                    return res.status(500).send({ mesnaeje: 'La cantidad a modificar' })
                }
            } else if (req.user.rol == "Admin_Cafeteria" && infoProducto.tipo == "Cafeteria" && infoProducto.subTipo == "ConStock") {
                if (Number(parametros.stock) + Number(infoProducto.stock) >= 0) {
                    Producto.findByIdAndUpdate(idProducto, { $inc: { stock: parametros.stock } }, { new: true },
                        (err, productoActualizado) => {
                            if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
                            if (!productoActualizado) return res.status(404).send({ mensaje: 'Error al Editar el Producto' })
                            return res.status(200).send({ producto: productoActualizado });
                        })
                } else {
                    return res.status(500).send({ mesnaeje: 'La cantidad a modificar' })
                }
            } else {
                return res.status(500).send({ mensaje: 'No esta autorizado' });
            }
        } else {
            return res.status(500).send({ mensaje: 'El producto se ha configurado como sin Stock' })
        }
    })
}

//Eliminar Productos
function eliminarProducto(req, res) {
    var idProducto = req.params.idProducto;

    Pedidos.findOne({ idProducto: idProducto }, (err, productoPedido) => {
        if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
        if (!productoPedido) {
            Producto.findById(idProducto, (err, infoProducto) => {
                if (err) return res.status(404).send({ mensaje: 'Error en la peticion' })
                if (req.user.rol == 'Admin_Cafeteria' && infoProducto.tipo == 'Cafeteria') {
                    Producto.findByIdAndDelete(idProducto, (err, productoEliminado) => {
                        if (err) return res.status(404).send({ mensaje: 'Error en la peticion' })
                        if (!productoEliminado) return res.status(500).send({ mensaje: 'Error al eliminar el producto' });
                        return res.status(200).send({ producto: productoEliminado })
                    });
                } else if (req.user.rol == 'Admin_Secretaria' && infoProducto.tipo == 'Secretaria') {
                    Producto.findByIdAndDelete(idProducto, (err, productoEliminado) => {
                        if (err) return res.status(404).send({ mensaje: 'Error en la peticion' })
                        if (!productoEliminado) return res.status(500).send({ mensaje: 'Error al eliminar el producto' });
                        return res.status(200).send({ producto: productoEliminado })
                    });
                } else {
                    return res.status(500).send({ mensaje: 'No esta autorizado para eliminar el producto' });
                }
            })
        } else {
            return res.status(500).send({ mensaje: 'Este producto se encuentra en pedidos, complete el pedido y cambie el estado para que no sea pedido de nuevo' });
        }
    })
}

//productos
function productosCafeteria(req, res) {
    if (req.user.rol == "Admin_Cafeteria"|| req.user.rol =='Alumno') {
        Producto.find({ tipo: "Cafeteria" }, (err, productosCafeteria) => {
            if (err) return res.status(404).send({ mensaje: "Error en la peticion" });
            if (!productosCafeteria) return res.status(500).send({ mensaje: "No se encontraron productos" });
            return res.status(200).send({ productos: productosCafeteria });
        })
    } else {
        return res.status(500).send({ mensaje: "No esta autorizado" })
    }
}

function productosSecretaria(req, res) {
    if (req.user.rol == "Admin_Secretaria"|| req.user.rol =='Alumno') {
        Producto.find({ tipo: "Secretaria" }, (err, productosCafeteria) => {
            if (err) return res.status(404).send({ mensaje: "Error en la peticion" });
            if (!productosCafeteria) return res.status(500).send({ mensaje: "No se encontraron productos" });
            return res.status(200).send({ productos: productosCafeteria });
        })
    } else {
        return res.status(500).send({ mensaje: "No esta autorizado" })
    }
}

//busquedas
function productoPorId(req, res) {
    var idProducto = req.params.idProducto;
    Producto.findById(idProducto, (err, infoProducto) => {
        if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
        if (!infoProducto) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if (req.user.rol == 'Admin_Cafeteria' || infoProducto.tipo == 'Cafeteria') {
            return res.status(200).send({ producto: infoProducto });
        } else if (req.user.rol == 'Admin_Secretaria' || infoProducto.tipo == 'Secretaria') {
            return res.status(200).send({ producto: infoProducto });
        } else {
            return res.status(500).send({ mensaje: 'No esta autorizados' });
        }
    })
}

function productosCafeteriaPorNombre(req, res) {
    var producto = req.params.producto;
    if (req.user.rol == "Admin_Cafeteria"||req.user.rol =='Alumno') {
        Producto.find({ tipo: "Cafeteria", producto: { $regex: producto, $options: 'i' } }, (err, productosCafeteria) => {
            if (err) return res.status(404).send({ mensaje: "Error en la peticion" });
            if (!productosCafeteria) return res.status(500).send({ mensaje: "No se encontraron productos" });
            return res.status(200).send({ productos: productosCafeteria });
        })
    } else {
        return res.status(500).send({ mensaje: "No esta autorizado" })
    }
}

function productosSecretariaPorNombre(req, res) {
    var producto = req.params.producto;
    if (req.user.rol == "Admin_Secretaria"||req.user.rol =='Alumno') {
        Producto.find({ tipo: "Secretaria", producto: { $regex: producto, $options: 'i' } }, (err, productosCafeteria) => {
            if (err) return res.status(404).send({ mensaje: "Error en la peticion" });
            if (!productosCafeteria) return res.status(500).send({ mensaje: "No se encontraron productos" });
            return res.status(200).send({ productos: productosCafeteria });
        })
    } else {
        return res.status(500).send({ mensaje: "No esta autorizado" })
    }
}

//Exports
module.exports = {
    agregarProductosConStock,
    editarProductos,
    editarStock,
    eliminarProducto,
    productosCafeteria,
    productosCafeteriaPorNombre,
    productosSecretaria,
    productosSecretariaPorNombre,
    productoPorId
}