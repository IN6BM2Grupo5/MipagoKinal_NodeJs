const Pedidos = require('../models/pedidos.models');
const Usuario = require("../models/usuarios.models");
const Producto = require("../models/productos.models");


//Pedidos
function pedido(req, res) {
    var idProducto = req.params.idProducto;
    var modeloPedido = new Pedidos();
    var parametros = req.body;
    const date = new Date();
    var precioProductos;
    const tiempoTranscurrido = date.getDate() + ':' + (date.getMonth() + 1) + ':' + date.getFullYear();
    const mesPronto = date.getDate() + ':' + (date.getMonth() + 2) + ':' + date.getFullYear();
    if (req.user.rol == 'Alumno') {
        Usuario.findById(req.user.sub, (err, infoAlumno) => {
            if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
            if (!infoAlumno) return res.status(500).send({ mensaje: 'Error al cargar los datos del alumno' });
            if (infoAlumno.strikes < 3) {
                Producto.findById(idProducto, (err, infoProducto) => {
                    if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
                    if (!infoProducto) return res.status(500).send({ mensaje: 'No se encontro el producto' });
                    if (infoProducto.estado == 'Disponible') {
                        if (parametros.cantidad && parametros.fechaPedido) {
                            if (parametros.cantidad <= 0) return res.status(500).send({ mensaje: 'Ingrese una cantidad del producto' })
                            var fhoy = new Date(tiempoTranscurrido).getTime();
                            var fomes = new Date(mesPronto).getTime();
                            var fPedido = new Date(parametros.fechaPedido).getTime();
                            var fechaPedido = new Date(parametros.fechaPedido);
                            var dPedido = fechaPedido.getDay();
                            if (fPedido >= fhoy) {
                                if (dPedido == 0 || dPedido == 6) return res.status(500).send({ mensaje: 'No se pueden realizar pedidos para los fines de semana' });
                                if (fPedido < fomes) return res.status(500).send({ mensaje: 'No se pueden hacer pedidos para mas de un mes' });
                                if (infoProducto.tipo == 'ConStock') {
                                    if (infoProducto.stock > parametros.cantidad) {
                                        precioProductos = Number(infoProducto.precio) * Number(parametros.cantidad);
                                        if (infoProducto.tipo == 'Cafeteria') {
                                            if (precioProductos <= infoAlumno.cuentaCafeteria) {
                                                Producto.findByIdAndUpdate(idProducto, { $inc: { stock: parametros.cantidad * -1 } }, { new: true }, (err, stockActualizado) => {
                                                    if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
                                                    if (!stockActualizado) return res.status(500).send({ mensaje: 'Error en la peticion' });
                                                    Usuario.findByIdAndUpdate(req.user.sub, { $inc: { cuentaCafeteria: precioProductos * -1 } }, { new: true }, (err, cuentaActualizada) => {
                                                        if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
                                                        if (!cuentaActualizada) return res.status(500).send({ mensaje: 'Error al actualizar la cuenta' });
                                                        Pedidos.findOne({ idProducto: idProducto, fechaPedido: parametros.fechaPedido }, (err, pedidoEncontrado) => {
                                                            if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
                                                            if (!pedidoEncontrado) {
                                                                modeloPedido.producto = infoProducto.producto;
                                                                modeloPedido.cantidad = parametros.cantidad;
                                                                modeloPedido.subTotal = precioProductos;
                                                                modeloPedido.alumno = infoAlumno.nombres + ' ' + infoAlumno.apellidos;
                                                                modeloPedido.carnet = infoAlumno.carnet;
                                                                modeloPedido.tipo = 'Cafeteria';
                                                                modeloPedido.fechaPedido = parametros.fechaPedido;
                                                                modeloPedido.idAlumno = req.user.sub;
                                                                modeloPedido.idProducto = idProducto;
                                                                modeloPedido.save((err, pedidoGuardado) => {
                                                                    if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
                                                                    if (!pedidoGuardado) return res.status(500).send({ mensaje: 'Error al guardar el pedido' });
                                                                    return res.status(200).send({})
                                                                })
                                                            } else {
                                                                Pedidos.findByIdAndUpdate(pedidoEncontrado._id, { $inc: { cantidad: parametros.cantidad }, $inc: { subTotal: precioProductos } }, { new: true }, (err, pedidoActualizado) => {
                                                                    if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
                                                                    if (!pedidoActualizado) return res.status(500).send({ mensaje: 'Error al actualziar un pedido' });
                                                                    return res.status(200).send({ pedido: pedidoActualizado });
                                                                })
                                                            }
                                                        })
                                                    })
                                                })
                                            } else {
                                                return res.status(500).send({ mensaje: 'No cuenta con el dinero necesario, puede ingresar mas en cafeteria' });
                                            }
                                        } else if (infoProducto.tipo == 'Secretaria') {
                                            if (precioProductos <= infoAlumno.cuentaAdmin) {
                                                Producto.findByIdAndUpdate(idProducto, { $inc: { stock: parametros.cantidad * -1 } }, { new: true }, (err, stockActualizado) => {
                                                    if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
                                                    if (!stockActualizado) return res.status(500).send({ mensaje: 'Error en la peticion' });
                                                    Usuario.findByIdAndUpdate(req.user.sub, { $inc: { cuentaAdmin: precioProductos * -1 } }, { new: true }, (err, cuentaActualizada) => {
                                                        if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
                                                        if (!cuentaActualizada) return res.status(500).send({ mensaje: 'Error al actualizar la cuenta' });
                                                        Pedidos.findOne({ idProducto: idProducto, fechaPedido: parametros.fechaPedido }, (err, pedidoEncontrado) => {
                                                            if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
                                                            if (!pedidoEncontrado) {
                                                                modeloPedido.producto = infoProducto.producto;
                                                                modeloPedido.cantidad = parametros.cantidad;
                                                                modeloPedido.subTotal = precioProductos;
                                                                modeloPedido.alumno = infoAlumno.nombres + ' ' + infoAlumno.apellidos;
                                                                modeloPedido.carnet = infoAlumno.carnet;
                                                                modeloPedido.tipo = 'Secretaria';
                                                                modeloPedido.fechaPedido = parametros.fechaPedido;
                                                                modeloPedido.idAlumno = req.user.sub;
                                                                modeloPedido.idProducto = idProducto;
                                                                modeloPedido.save((err, pedidoGuardado) => {
                                                                    if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
                                                                    if (!pedidoGuardado) return res.status(500).send({ mensaje: 'Error al guardar el pedido' });
                                                                    return res.status(200).send({})
                                                                })
                                                            } else {
                                                                Pedidos.findByIdAndUpdate(pedidoEncontrado._id, { $inc: { cantidad: parametros.cantidad }, $inc: { subTotal: precioProductos } }, { new: true }, (err, pedidoActualizado) => {
                                                                    if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
                                                                    if (!pedidoActualizado) return res.status(500).send({ mensaje: 'Error al actualziar un pedido' });
                                                                    return res.status(200).send({ pedido: pedidoActualizado });
                                                                })
                                                            }
                                                        })
                                                    })
                                                })
                                            } else {
                                                return res.status(500).send({ mensaje: 'No cuenta con el dinero necesario, puede ingresar mas en Administracion' });
                                            }
                                        }
                                    } else {
                                        return res.status(500).send({ mensaje: 'No contamos con el stock necesario' })
                                    }
                                } else if (infoProducto.tipo == 'SinStock') {
                                    precioProductos = Number(infoProducto.precio) * Number(parametros.cantidad);
                                    if (infoProducto.tipo == 'Cafeteria') {
                                        if (precioProductos <= infoAlumno.cuentaCafeteria) {
                                            Usuario.findByIdAndUpdate(req.user.sub, { $inc: { cuentaCafeteria: precioProductos * -1 } }, { new: true }, (err, cuentaActualizada) => {
                                                if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
                                                if (!cuentaActualizada) return res.status(500).send({ mensaje: 'Error al actualizar la cuenta' });
                                                Pedidos.findOne({ idProducto: idProducto, fechaPedido: parametros.fechaPedido }, (err, pedidoEncontrado) => {
                                                    if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
                                                    if (!pedidoEncontrado) {
                                                        modeloPedido.producto = infoProducto.producto;
                                                        modeloPedido.cantidad = parametros.cantidad;
                                                        modeloPedido.subTotal = precioProductos;
                                                        modeloPedido.alumno = infoAlumno.nombres + ' ' + infoAlumno.apellidos;
                                                        modeloPedido.carnet = infoAlumno.carnet;
                                                        modeloPedido.tipo = 'Cafeteria';
                                                        modeloPedido.fechaPedido = parametros.fechaPedido;
                                                        modeloPedido.idAlumno = req.user.sub;
                                                        modeloPedido.idProducto = idProducto;
                                                        modeloPedido.save((err, pedidoGuardado) => {
                                                            if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
                                                            if (!pedidoGuardado) return res.status(500).send({ mensaje: 'Error al guardar el pedido' });
                                                            return res.status(200).send({})
                                                        })
                                                    } else {
                                                        Pedidos.findByIdAndUpdate(pedidoEncontrado._id, { $inc: { cantidad: parametros.cantidad }, $inc: { subTotal: precioProductos } }, { new: true }, (err, pedidoActualizado) => {
                                                            if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
                                                            if (!pedidoActualizado) return res.status(500).send({ mensaje: 'Error al actualziar un pedido' });
                                                            return res.status(200).send({ pedido: pedidoActualizado });
                                                        })
                                                    }
                                                })
                                            })
                                        } else {
                                            return res.status(500).send({ mensaje: 'No cuenta con el dinero necesario, puede ingresar mas en cafeteria' });
                                        }
                                    } else if (infoProducto.tipo == 'Secretaria') {
                                        if (precioProductos <= infoAlumno.cuentaAdmin) {
                                            Usuario.findByIdAndUpdate(req.user.sub, { $inc: { cuentaAdmin: precioProductos * -1 } }, { new: true }, (err, cuentaActualizada) => {
                                                if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
                                                if (!cuentaActualizada) return res.status(500).send({ mensaje: 'Error al actualizar la cuenta' });
                                                Pedidos.findOne({ idProducto: idProducto, fechaPedido: parametros.fechaPedido }, (err, pedidoEncontrado) => {
                                                    if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
                                                    if (!pedidoEncontrado) {
                                                        modeloPedido.producto = infoProducto.producto;
                                                        modeloPedido.cantidad = parametros.cantidad;
                                                        modeloPedido.subTotal = precioProductos;
                                                        modeloPedido.alumno = infoAlumno.nombres + ' ' + infoAlumno.apellidos;
                                                        modeloPedido.carnet = infoAlumno.carnet;
                                                        modeloPedido.tipo = 'Secretaria';
                                                        modeloPedido.fechaPedido = parametros.fechaPedido;
                                                        modeloPedido.idAlumno = req.user.sub;
                                                        modeloPedido.idProducto = idProducto;
                                                        modeloPedido.save((err, pedidoGuardado) => {
                                                            if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
                                                            if (!pedidoGuardado) return res.status(500).send({ mensaje: 'Error al guardar el pedido' });
                                                            return res.status(200).send({})
                                                        })
                                                    } else {
                                                        Pedidos.findByIdAndUpdate(pedidoEncontrado._id, { $inc: { cantidad: parametros.cantidad }, $inc: { subTotal: precioProductos } }, { new: true }, (err, pedidoActualizado) => {
                                                            if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
                                                            if (!pedidoActualizado) return res.status(500).send({ mensaje: 'Error al actualziar un pedido' });
                                                            return res.status(200).send({ pedido: pedidoActualizado });
                                                        })
                                                    }
                                                })
                                            })
                                        } else {
                                            return res.status(500).send({ mensaje: 'No cuenta con el dinero necesario, puede ingresar mas en Administracion' });
                                        }
                                    }
                                }
                            } else {
                                return res.status(500).send({ mensaje: 'No dispones de una maquina del tiempo McFly' });
                            }
                        } else {
                            return res.status(500).send({ mensaje: 'Ingrese los campos necesarios' })
                        }
                    } else {
                        return res.status(500).send({ mensaje: 'El producto por el momento no esta disponible' });
                    }
                })
            } else {
                return res.status(500).send({ mensaje: 'Usteded esta baneado hasta el: ' + infoAlumno.fechaBaneo })
            }
        })
    } else {
        return res.status(500).send({ mensaje: 'No esta autorizado para hacer pedidos' })
    }
}

function pedirMarbete(req, res) {
    var modeloPedido = new Pedidos();
    var precio;
    if (req.user.rol == 'Alumno') {
        Usuario.findById(req.user.sub, (err, infoAlumno) => {
            if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
            if (!infoAlumno) return res.status(500).send({ mensaje: 'Error al traer los datos del alumno' });
            if (infoAlumno.strikes < 3) {
                if (infoAlumno.marbete[0].vehiculo != '') {
                    if (infoAlumno.marbete[0].vehiculo == "Moto") {
                        precio = 60;
                    } else if (infoAlumno.marbete[0].vehiculo == 'Carro') {
                        precio = 120;
                    }
                    if (infoAlumno.cuentaAdmin >= precio) {
                        modeloPedido.producto = 'Marbete';
                        modeloPedido.subTotal = precio;
                        modeloPedido.alumno = infoAlumno.nombres + ' ' + infoAlumno.apellidos;
                        modeloPedido.carnet = infoAlumno.carnet;
                        modeloPedido.tipo = 'Secretaria';
                        Usuario.findByIdAndUpdate(req.user.sub, { $inc: { cuentaAdmin: precio * -1 } }, { new: true }, (err, cuentaActualizada) => {
                            if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
                            if (!cuentaActualizada) return res.status(500).send({ mensaje: 'Error al actualizar la cuenta' });
                            modeloPedido.save((err, pedidoGuardado) => {
                                if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
                                if (!pedidoGuardado) return res.status(500).send({ mensaje: 'Error al guardar el pedido' });
                                return res.status(200).send({ pedido: pedidoGuardado });
                            })
                        })
                    } else {
                        return res.status(500).send({ mensaje: 'No cuenta con el dinero suficiente para pagar el marbete' })
                    }
                } else {
                    return res.status(500).send({ mensaje: 'Usted no ha ingresado los datos de su vehiculo' });
                }
            } else {
                return res.status(500).send({ mensaje: 'Su cuenta esta baneada' })
            }
        })
    } else {
        return res.status(500).send({ mensaje: 'No esta autorizado para pedir un marbete' })
    }
}

//Cancelar Pedidos
function cancelarPedido(req, res) {
    var idPedido = req.params.idPedido;
    const date = new Date();
    const tiempoTranscurrido = date.getDate() + ':' + (date.getMonth() + 1) + ':' + date.getFullYear();
    Pedidos.findById(idPedido, (err, infoPedido) => {
        if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
        if (!infoPedido) return res.status(500).send({ mensaje: 'Error al encontrar el pedido' });
        var fhoy = new Date(tiempoTranscurrido).getTime();
        var fped = new Date(infoPedido.fechaPedido).getTime();
        if (req.user.rol == 'Alumno') {
            if (fhoy >= fped) return res.status(500).send({ mensaje: 'El pedido ya no puede cancelarse, habla con un administrador para solucionar el problema' });
            if (infoPedido.tipo = 'Cafeteria') {
                Usuario.findByIdAndUpdate(req.user.sub, { $inc: { cuentaCafeteria: infoPedido.subTotal } }, { new: true }, (err, cuentaActualizada) => {
                    if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
                    if (!cuentaActualizada) return res.status(500).send({ mensaje: 'Error al actualizar la cuenta' });
                    Producto.findByIdAndUpdate(infoPedido.idProducto, { $inc: { stock: infoPedido.cantidad } }, { new: true }, (err, stockActualizado) => {
                        if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
                        if (!stockActualizado) return res.status(500).send({ mensaje: 'Error al actualizar el stock' });
                        Pedidos.findByIdAndDelete(idPedido, (err, pedidoEliminado) => {
                            if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
                            if (!pedidoEliminado) return res.status(500).send({ mensaje: 'Error al eliminar el pedido' });
                            return res.status(200).send({ pedido: pedidoEliminado });
                        });
                    });
                });
            } else if (infoPedido.tipo = 'Secretaria') {
                Usuario.findByIdAndUpdate(req.user.sub, { $inc: { cuentaAdmin: infoPedido.subTotal } }, { new: true }, (err, cuentaActualizada) => {
                    if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
                    if (!cuentaActualizada) return res.status(500).send({ mensaje: 'Error al actualizar la cuenta' });
                    Producto.findByIdAndUpdate(infoPedido.idProducto, { $inc: { stock: infoPedido.cantidad } }, { new: true }, (err, stockActualizado) => {
                        if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
                        if (!stockActualizado) return res.status(500).send({ mensaje: 'Error al actualizar el stock' });
                        Pedidos.findByIdAndDelete(idPedido, (err, pedidoEliminado) => {
                            if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
                            if (!pedidoEliminado) return res.status(500).send({ mensaje: 'Error al eliminar el pedido' });
                            return res.status(200).send({ pedido: pedidoEliminado });
                        });
                    });
                });
            }
        } else if (req.user.rol == "Admin_Cafeteria" || req.user.rol == 'Admin_Secretaria') {
            if (infoPedido.producto == 'Marbete' && req.user.rol == 'Admin_Secretaria') {
                Usuario.findByIdAndUpdate(infoPedido.idAlumno, { $inc: { cuentaAdmin: infoPedido.subTotal } }, { new: true }, (err, cuentaActualizada) => {
                    if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
                    if (!cuentaActualizada) return res.status(500).send({ mensaje: 'Error al actualizar la cuenta' });
                    Pedidos.findByIdAndDelete(idPedido, (err, pedidoEliminado) => {
                        if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
                        if (!pedidoEliminado) return res.status(500).send({ mensaje: 'Error al eliminar el pedido' });
                        return res.status(200).send({ pedido: pedidoEliminado });
                    });
                });
            } else {
                if (fhoy >= fped) {
                    Usuario.findByIdAndUpdate(infoPedido.idAlumno, { $inc: { strikes: 1 } }, { new: true }, (err, strikesActualizados) => {
                        if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
                        if (!strikesActualizados) return res.status(500).send({ mensaje: 'Error al actualizar los strikes' });
                        if (strikesActualizados.strikes = 3) {
                            var unasem = new Date();
                            unasem = Number(unasem);
                            unasem += 7 * 24 * 60 * 60 * 1000;
                            unasem = new Date(unasem);
                            unasem = unasem.getDate() + ':' + (unasem.getMonth() + 1) + ':' + unasem.getFullYear();
                            Usuario.findByIdAndUpdate(infoPedido.idAlumno, { fechaBaneo: unasem }, { new: true }, (err, usuarioBaneado) => {
                                if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
                                if (!usuarioBaneado) return res.status(500).send({ mensaje: 'Error al banear al usuario' });
                                if (infoPedido.tipo = 'Cafeteria') {
                                    Usuario.findByIdAndUpdate(infoPedido.idAlumno, { $inc: { cuentaCafeteria: infoPedido.subTotal } }, { new: true }, (err, cuentaActualizada) => {
                                        if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
                                        if (!cuentaActualizada) return res.status(500).send({ mensaje: 'Error al actualizar la cuenta' });
                                        Producto.findByIdAndUpdate(infoPedido.idProducto, { $inc: { stock: infoPedido.cantidad } }, { new: true }, (err, stockActualizado) => {
                                            if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
                                            if (!stockActualizado) return res.status(500).send({ mensaje: 'Error al actualizar el stock' });
                                            Pedidos.findByIdAndDelete(idPedido, (err, pedidoEliminado) => {
                                                if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
                                                if (!pedidoEliminado) return res.status(500).send({ mensaje: 'Error al eliminar el pedido' });
                                                return res.status(200).send({ pedido: pedidoEliminado });
                                            });
                                        });
                                    });
                                } else if (infoPedido.tipo = 'Secretaria') {
                                    Usuario.findByIdAndUpdate(infoPedido.idAlumno, { $inc: { cuentaAdmin: infoPedido.subTotal } }, { new: true }, (err, cuentaActualizada) => {
                                        if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
                                        if (!cuentaActualizada) return res.status(500).send({ mensaje: 'Error al actualizar la cuenta' });
                                        Producto.findByIdAndUpdate(infoPedido.idProducto, { $inc: { stock: infoPedido.cantidad } }, { new: true }, (err, stockActualizado) => {
                                            if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
                                            if (!stockActualizado) return res.status(500).send({ mensaje: 'Error al actualizar el stock' });
                                            Pedidos.findByIdAndDelete(idPedido, (err, pedidoEliminado) => {
                                                if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
                                                if (!pedidoEliminado) return res.status(500).send({ mensaje: 'Error al eliminar el pedido' });
                                                return res.status(200).send({ pedido: pedidoEliminado });
                                            });
                                        });
                                    });
                                }
                            })
                        } else if (strikesActualizados.strikes > 3) {
                            return res.status(500).send({ mensaje: 'Usted ya ha sido baneado' })
                        } else {
                            if (infoPedido.tipo = 'Cafeteria') {
                                Usuario.findByIdAndUpdate(infoPedido.idAlumno, { $inc: { cuentaCafeteria: infoPedido.subTotal } }, { new: true }, (err, cuentaActualizada) => {
                                    if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
                                    if (!cuentaActualizada) return res.status(500).send({ mensaje: 'Error al actualizar la cuenta' });
                                    Producto.findByIdAndUpdate(infoPedido.idProducto, { $inc: { stock: infoPedido.cantidad } }, { new: true }, (err, stockActualizado) => {
                                        if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
                                        if (!stockActualizado) return res.status(500).send({ mensaje: 'Error al actualizar el stock' });
                                        Pedidos.findByIdAndDelete(idPedido, (err, pedidoEliminado) => {
                                            if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
                                            if (!pedidoEliminado) return res.status(500).send({ mensaje: 'Error al eliminar el pedido' });
                                            return res.status(200).send({ pedido: pedidoEliminado });
                                        });
                                    });
                                });
                            } else if (infoPedido.tipo = 'Secretaria') {
                                Usuario.findByIdAndUpdate(infoPedido.idAlumno, { $inc: { cuentaAdmin: infoPedido.subTotal } }, { new: true }, (err, cuentaActualizada) => {
                                    if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
                                    if (!cuentaActualizada) return res.status(500).send({ mensaje: 'Error al actualizar la cuenta' });
                                    Producto.findByIdAndUpdate(infoPedido.idProducto, { $inc: { stock: infoPedido.cantidad } }, { new: true }, (err, stockActualizado) => {
                                        if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
                                        if (!stockActualizado) return res.status(500).send({ mensaje: 'Error al actualizar el stock' });
                                        Pedidos.findByIdAndDelete(idPedido, (err, pedidoEliminado) => {
                                            if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
                                            if (!pedidoEliminado) return res.status(500).send({ mensaje: 'Error al eliminar el pedido' });
                                            return res.status(200).send({ pedido: pedidoEliminado });
                                        });
                                    });
                                });
                            }
                        }
                    })
                } else {
                    if (infoPedido.tipo = 'Cafeteria') {
                        Usuario.findByIdAndUpdate(infoPedido.idAlumno, { $inc: { cuentaCafeteria: infoPedido.subTotal } }, { new: true }, (err, cuentaActualizada) => {
                            if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
                            if (!cuentaActualizada) return res.status(500).send({ mensaje: 'Error al actualizar la cuenta' });
                            Producto.findByIdAndUpdate(infoPedido.idProducto, { $inc: { stock: infoPedido.cantidad } }, { new: true }, (err, stockActualizado) => {
                                if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
                                if (!stockActualizado) return res.status(500).send({ mensaje: 'Error al actualizar el stock' });
                                Pedidos.findByIdAndDelete(idPedido, (err, pedidoEliminado) => {
                                    if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
                                    if (!pedidoEliminado) return res.status(500).send({ mensaje: 'Error al eliminar el pedido' });
                                    return res.status(200).send({ pedido: pedidoEliminado });
                                });
                            });
                        });
                    } else if (infoPedido.tipo = 'Secretaria') {
                        Usuario.findByIdAndUpdate(infoPedido.idAlumno, { $inc: { cuentaAdmin: infoPedido.subTotal } }, { new: true }, (err, cuentaActualizada) => {
                            if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
                            if (!cuentaActualizada) return res.status(500).send({ mensaje: 'Error al actualizar la cuenta' });
                            Producto.findByIdAndUpdate(infoPedido.idProducto, { $inc: { stock: infoPedido.cantidad } }, { new: true }, (err, stockActualizado) => {
                                if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
                                if (!stockActualizado) return res.status(500).send({ mensaje: 'Error al actualizar el stock' });
                                Pedidos.findByIdAndDelete(idPedido, (err, pedidoEliminado) => {
                                    if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
                                    if (!pedidoEliminado) return res.status(500).send({ mensaje: 'Error al eliminar el pedido' });
                                    return res.status(200).send({ pedido: pedidoEliminado });
                                });
                            });
                        });
                    }
                }
            }
        } else {
            return res.status(500).send({ mensaje: 'No esta autorizado para cancelar un pedido' });
        }
    })
}
//Confirmar Pedido
function confirmarEntrega(req, res) {
    var idPedido = req.params.idPedido;
    const date = new Date();
    const tiempoTranscurrido = date.getDate() + ':' + (date.getMonth() + 1) + ':' + date.getFullYear();
    if (req.user.rol == 'Admin_Secretaria' || req.user.rol == 'Admin_Cafeteria') {
        Pedidos.findById(idPedido, (err, infoPedido) => {
            if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
            if (!infoPedido) return res.status(500).send({ mensaje: 'Error al encontrar el pedido' });
            if (infoPedido.producto = 'Marbete') {
                var unMes = new Date();
                unMes = Number(unMes);
                unMes += 30 * 24 * 60 * 60 * 1000;
                unMes = new Date(unMes);
                unMes = unMes.getDate() + ':' + (unMes.getMonth() + 1) + ':' + unMes.getFullYear();
                Usuario.findById(idPedido.idUsuario, (err, infoAlumno) => {
                    if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
                    if (!infoAlumno) return res.status(500).send({ mensaje: 'Error al encontrar el usuario' });
                    Pedidos.findByIdAndDelete(idPedido, (err, pedidoEliminado) => {
                        if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
                        if (!pedidoEliminado) return res.status(500).send({ mensaje: 'Error al eliminar el pedido' });
                        Usuario.findOneAndUpdate({ marbete: { $elemMatch: { _id: infoAlumno.marbete[0]._id } } },
                            { 'marbete.$.fechaInicio': tiempoTranscurrido, 'marbete.$.fechaFin': unMes },
                            { new: true },
                            (err, usuarioEditado) => {
                                if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
                                if (!usuarioEditado) return res.status(500).send({ mensaje: 'Error al editar su vehiculo' });
                                return res.status(200).send({ pedido: pedidoEliminado });
                            })
                    });
                });
            } else {
                var fhoy = new Date(tiempoTranscurrido).getTime();
                var fped = new Date(infoPedido.fechaPedido).getTime();
                if (fhoy > fped) return res.status(500).send({ mensaje: 'El pedido ya caduco, cancele la entrega' });
                if (fhoy < fped) return res.status(500).send({ mensaje: 'Aun no es la fecha de entrega' });
                Pedidos.findByIdAndDelete(idPedido, (err, pedidoEliminado) => {
                    if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
                    if (!pedidoEliminado) return res.status(500).send({ mensaje: 'Error al eliminar el pedido' });
                    return res.status(200).send({ pedido: pedidoEliminado });
                })
            }
        })
    } else {
        return res.status(500).send({ mensaje: 'No esta autorizado para confirmar una Entrega' });
    }

}

//verPedidos
function verPedidos(req, res) {
    const date = new Date();
    const tiempoTranscurrido = date.getDate() + ':' + (date.getMonth() + 1) + ':' + date.getFullYear();
    if (req.user.rol == 'Admin_Secretaria') {
        Pedidos.find({ tipo: 'Secretaria' }, (err, pedidosEncontrados) => {
            if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
            if (!pedidosEncontrados) return res.status(500).send({ mensaje: 'Error en encontrar los pedidos' });
            return res.status(200).send({ pedidos: pedidosEncontrados });
        });
    } else if (req.user.rol == 'Admin_Cafeteria') {
        Pedidos.find({ tipo: 'Cafeteria' }, (err, pedidosEncontrados) => {
            if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
            if (!pedidosEncontrados) return res.status(500).send({ mensaje: 'Error en encontrar los pedidos' });
            return res.status(200).send({ pedidos: pedidosEncontrados });
        });
    } else if (req.user.rol == 'Alumno') {
        Usuario.findById(req.user.sub, (err, infoAlumno) => {
            if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
            if (!infoAlumno) return res.status(500).send({ mensaje: 'Error al encontrar la informacion' });
            if (infoAlumno.fechaBaneo != '') {
                var fhoy = new Date(tiempoTranscurrido).getTime();
                var fBan = new Date(infoAlumno.fechaBaneo).getTime();
                if (fhoy > fBan) {
                    Usuario.findByIdAndUpdate(req.user.sub, { fechaBaneo: '', strikes: 0 }, { new: true }, (err, desbaneo) => {
                        if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
                        if (!desbaneo) return res.status(500).send({ mensaje: 'Error al desbanear' })
                    })
                }
                Pedidos.find({ idUsuario: req.user.sub }, (err, pedidosEncontrados) => {
                    if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
                    if (!pedidosEncontrados) return res.status(500).send({ mensaje: 'Error en encontrar los pedidos' });
                    return res.status(200).send({ pedidos: pedidosEncontrados })
                })

            } else {
                Pedidos.find({ idUsuario: req.user.sub }, (err, pedidosEncontrados) => {
                    if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
                    if (!pedidosEncontrados) return res.status(500).send({ mensaje: 'Error en encontrar los pedidos' });
                    return res.status(200).send({ pedidos: pedidosEncontrados })
                })
            }
        })
    } else {
        return res.status(500).send({ mensaje: 'No esta autorizado para ver los pedidos' })
    }
}

function verPedidosAdminHoy(req, res) {
    const date = new Date();
    const tiempoTranscurrido = date.getDate() + ':' + (date.getMonth() + 1) + ':' + date.getFullYear();
    if (req.user.rol == 'Admin_Secretaria') {
        Pedidos.find({ tipo: 'Secretaria', fechaPedido: tiempoTranscurrido }, (err, pedidosEncontrados) => {
            if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
            if (!pedidosEncontrados) return res.status(500).send({ mensaje: 'Error en encontrar los pedidos' });
            return res.status(200).send({ pedidos: pedidosEncontrados });
        });
    } else if (req.user.rol == 'Admin_Cafeteria') {
        Pedidos.find({ tipo: 'Cafeteria', fechaPedido: tiempoTranscurrido }, (err, pedidosEncontrados) => {
            if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
            if (!pedidosEncontrados) return res.status(500).send({ mensaje: 'Error en encontrar los pedidos' });
            return res.status(200).send({ pedidos: pedidosEncontrados });
        });
    } else {
        return res.status(500).send({ mensaje: 'No esta autorizado para ver los pedidos' })
    }
}

//BuscarPedidos
function pedidosPorCarnet(req, res) {
    var carnet = req.params.carnet;
    if (req.user.rol == 'Admin_Secretaria') {
        Pedidos.find({ tipo: 'Secretaria', carnet: carnet }, (err, pedidosEncontrados) => {
            if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
            if (!pedidosEncontrados) return res.status(500).send({ mensaje: 'Error en encontrar los pedidos' });
            return res.status(200).send({ pedidos: pedidosEncontrados });
        });
    } else if (req.user.rol == 'Admin_Cafeteria') {
        Pedidos.find({ tipo: 'Cafeteria', carnet: carnet }, (err, pedidosEncontrados) => {
            if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
            if (!pedidosEncontrados) return res.status(500).send({ mensaje: 'Error en encontrar los pedidos' });
            return res.status(200).send({ pedidos: pedidosEncontrados });
        });
    } else {
        return res.status(500).send({ mensaje: 'No esta autorizado para ver los pedidos' })
    }
}

function pedidosPorNombre(req, res) {
    var nombre = req.params.nombre;
    if (req.user.rol == 'Admin_Secretaria') {
        Pedidos.find({ tipo: 'Secretaria', alumno: nombre }, (err, pedidosEncontrados) => {
            if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
            if (!pedidosEncontrados) return res.status(500).send({ mensaje: 'Error en encontrar los pedidos' });
            return res.status(200).send({ pedidos: pedidosEncontrados });
        });
    } else if (req.user.rol == 'Admin_Cafeteria') {
        Pedidos.find({ tipo: 'Cafeteria', alumno: nombre }, (err, pedidosEncontrados) => {
            if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
            if (!pedidosEncontrados) return res.status(500).send({ mensaje: 'Error en encontrar los pedidos' });
            return res.status(200).send({ pedidos: pedidosEncontrados });
        });
    } else {
        return res.status(500).send({ mensaje: 'No esta autorizado para ver los pedidos' })
    }
}

function pedidosPorFecha(req, res) {
    var fecha = req.params.fecha;
    if (req.user.rol == 'Admin_Secretaria') {
        Pedidos.find({ tipo: 'Secretaria', fechaPedido: fecha }, (err, pedidosEncontrados) => {
            if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
            if (!pedidosEncontrados) return res.status(500).send({ mensaje: 'Error en encontrar los pedidos' });
            return res.status(200).send({ pedidos: pedidosEncontrados });
        });
    } else if (req.user.rol == 'Admin_Cafeteria') {
        Pedidos.find({ tipo: 'Cafeteria', fechaPedido: fecha }, (err, pedidosEncontrados) => {
            if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
            if (!pedidosEncontrados) return res.status(500).send({ mensaje: 'Error en encontrar los pedidos' });
            return res.status(200).send({ pedidos: pedidosEncontrados });
        });
    } else {
        return res.status(500).send({ mensaje: 'No esta autorizado para ver los pedidos' })
    }
}

//Exports
module.exports = {
    cancelarPedido,
    confirmarEntrega,
    pedido,
    pedidosPorCarnet,
    pedidosPorFecha,
    pedidosPorNombre,
    pedirMarbete,
    verPedidos,
    verPedidosAdminHoy
}