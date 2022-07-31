const Usuario = require("../models/usuarios.models");
const Producto = require("../models/productos.models");
const Pedidos = require('../models/pedidos.models');
const bcrypt = require("bcrypt-nodejs");
const jwt = require("../services/jwt");
const req = require("express/lib/request");

//AgregarAdmin
function AdminApp() {
    Usuario.find(
        { rol: "Admin_APP", usuario: "MipagoKinalAdmin" },
        (err, usuarioEcontrado) => {
            if (usuarioEcontrado.length == 0) {
                bcrypt.hash("MipagoKinalAdmin", null, null, (err, passwordEncriptada) => {
                    Usuario.create({
                        correo: 'mipagokinaladmin@gmail.com',
                        password: passwordEncriptada,
                        rol: "Admin_APP",
                    });
                });
            }
        }
    );
}

//Login
function Login(req, res) {
    var parametros = req.body;
    Usuario.findOne({ correo: parametros.correo }, (err, usuarioEncontrado) => {
        if (err) return res.status(500).send({ mensaje: "Error en la peticion" });
        if (usuarioEncontrado) {
            bcrypt.compare(
                parametros.password,
                usuarioEncontrado.password,
                (err, verificacionPassword) => {
                    if (verificacionPassword) {
                        if (parametros.obtenerToken === "true") {
                            return res.status(200).send({ token: jwt.crearToken(usuarioEncontrado) });
                        } else {
                            usuarioEncontrado.password = undefined;
                            return res.status(200).send({ usuario: usuarioEncontrado });
                        }
                    } else {
                        return res.status(500).send({ mensaje: "Las contraseñas no coinciden" });
                    }
                }
            );
        } else {
            return res.status(500).send({ mensaje: "Error, el correo no se encuentra registrado." });
        }
    });
}

//Agregar
function agregarAlumno(req, res) {
    var usuarioModel = new Usuario();
    var parametros = req.body;
    if (req.user.rol == 'Admin_APP') {
        if (parametros.nombres && parametros.apellidos && parametros.correo && parametros.carnet && parametros.password) {
            Usuario.findOne({ carnet: parametros.carnet }, (err, carnetDisponible) => {
                if (err) return res.status(404).send({ mensaej: 'Error en la peticion' });
                if (!carnetDisponible) {
                    if (parametros.correo.endsWith('@kinal.edu.gt')) {
                        Usuario.findOne({ correo: parametros.correo }, (correoNoDisponible) => {
                            if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
                            if (!correoNoDisponible) {
                                bcrypt.hash(parametros.password, null, null, (err, passwordEncriptada) => {
                                    Usuario.findOne({ password: passwordEncriptada }, (err, passwordNoDisponible) => {
                                        if (err) return res.status(404).send({ mensaej: 'Error en la peticion' });
                                        if (!passwordNoDisponible) {
                                            usuarioModel.nombres = parametros.nombres;
                                            usuarioModel.apellidos = parametros.apellidos;
                                            usuarioModel.correo = parametros.correo.toLowerCase();
                                            usuarioModel.rol = 'Alumno';
                                            usuarioModel.carnet = parametros.carnet;
                                            usuarioModel.cuentaAdmin = 0;
                                            usuarioModel.cuentaCafeteria = 0;
                                            usuarioModel.marbete = [{
                                                vehiculo: '',
                                                placas: '',
                                                modelo: '',
                                                fechaInicio: '',
                                                fechaFin: ''
                                            }];
                                            usuarioModel.password = passwordEncriptada;
                                            usuarioModel.strikes = 0;
                                            usuarioModel.fechaBaneo = '';
                                            usuarioModel.save((err, usuarioGuardado) => {
                                                if (err) return res.status(500).send({ mensaje: "Error en la peticion" });
                                                if (!usuarioGuardado) return res.status(500).send({ mensaje: "Error al agregar el Usuario" });

                                                return res.status(200).send({ usuario: usuarioGuardado });
                                            });
                                        } else {
                                            return res.status(500).send({ menasje: 'Esta password ya se encuentra ingresada en el sistema' });
                                        }
                                    })
                                });
                            } else {
                                return res.status(500).send({ mensaje: 'El correo ya se encuentra en el sistema' });
                            }
                        })
                    } else {
                        return res.status(500).send({ mensaje: 'Escriba un correo valido' });
                    }
                } else {
                    return res.status(500).send({ mensaje: 'Este carnet no esta disponible' })
                }
            });
        } else {
            return res.status(500).send({ mensaje: 'Ingrese los campos necesarios' })
        }
    } else {
        return res.status(500).send({ mensaje: 'No esta autorizado para agregar un Alumno' })
    }
}

function AgregarAdmin(req, res) {
    var usuarioModel = new Usuario();
    var parametros = req.body;
    if (req.user.rol == 'Admin_APP') {
        if (parametros.nombres && parametros.rol && parametros.password && parametros.correo && parametros.apellidos) {
            if (parametros.correo.endsWith('@kinal.edu.gt') || parametros.correo.endsWith('@gmail.com') || parametros.correo.endsWith('@kinal.org.gt')) {
                Usuario.findOne({ correo: parametros.correo }, (err, correoNoDisponible) => {
                    if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
                    if (!correoNoDisponible) {
                        bcrypt.hash(parametros.password, null, null, (err, passwordEncriptada) => {
                            Usuario.findOne({ password: passwordEncriptada }, (err, passwordNoDisponible) => {
                                if (err) return res.status(404).send({ mensaej: 'Error en la peticion' });
                                if (!passwordNoDisponible) {
                                    usuarioModel.nombres = parametros.nombres;
                                    usuarioModel.apellidos = parametros.apellidos;
                                    usuarioModel.correo = parametros.correo.toLowerCase();
                                    usuarioModel.rol = parametros.rol;
                                    usuarioModel.password = passwordEncriptada;
                                    usuarioModel.save((err, usuarioGuardado) => {
                                        if (err) return res.status(500).send({ mensaje: "Error en la peticion" });
                                        if (!usuarioGuardado) return res.status(500).send({ mensaje: "Error al agregar el Usuario" });

                                        return res.status(200).send({ usuario: usuarioGuardado });
                                    });
                                } else {
                                    return res.status(500).send({ menasje: 'Esta password ya se encuentra ingresada en el sistema' });
                                }
                            })
                        });
                    } else {
                        return res.status(500).send({ mensaje: 'El correo ya se encuentra en el sistema' })
                    }
                });
            } else {
                return res.status(500).send({ mensaje: 'Ingrese una direccion de correo valida' });
            }
        } else {
            return res.status(500).send({ mensaje: 'Ingrese todos los parametros' });
        }
    } else {
        return res.status(500).send({ mensaej: 'No esta autorizado para agregar un Administrador' });
    }
}

//Editar
function editarUsuario(req, res) {
    var idUsuario = req.params.idUsuario;
    var parametros = req.body;
    if (req.user.rol == 'Admin_APP') {
        Usuario.findById(idUsuario, (err, infoUsuario) => {
            if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
            if (infoUsuario) {
                if (infoUsuario.rol == 'Alumno') {
                    Pedidos.findOne({ idUsuario: idUsuario }, (err, pedidoEncontrado) => {
                        if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
                        if (pedidoEncontrado) {
                            Pedidos.updateMany({ idUsuario: idUsuario }, { alumno: parametros.nombres + ' ' + parametros.apellidos, carnet: parametros.carnet }, (err, pedidoActualizado) => {
                                if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
                                if (!pedidoActualizado) return res.status(500).send({ mensaje: 'Error al editar los pedidos' });
                            })
                        }
                        Usuario.findOne({ carnet: parametros.carnet }, (err, canetUsado) => {
                            if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
                            if (!canetUsado || parametros.carnet == infoUsuario.carnet) {
                                if (parametros.correo.endsWith('@kinal.edu.gt')) {
                                    Usuario.findOne({ correo: parametros.correo }, (err, correoUsado) => {
                                        if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
                                        if (!correoUsado || parametros.correo == infoUsuario.correo) {
                                            Usuario.findByIdAndUpdate(idUsuario, parametros, { new: true }, (err, usuarioEditado) => {
                                                if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
                                                if (!usuarioEditado) return res.status(500).send({ mensaej: 'Error al editar el usuario' });

                                                return res.status(200).send({ usuario: usuarioEditado });
                                            })
                                        } else {
                                            return res.status(500).send({ mensaje: 'El correo ya se encuentra en el sistema' });
                                        }
                                    })
                                } else {
                                    return res.status(500).send({ mensaej: 'Ingrese una direccion de correo valida' })
                                }
                            } else {
                                return res.status(500).send({ mensaje: 'Este carnet no esta disponible' });
                            }
                        });
                    })
                } else if (infoUsuario.rol == 'Admin_Cafeteria' || infoUsuario.rol == 'Admin_Secretaria') {
                    if (parametros.correo.endsWith('@kinal.edu.gt') || parametros.correo.endsWith('@gmail.com') || parametros.correo.endsWith('@kinal.org.gt')) {
                        Usuario.findOne({ correo: parametros.correo }, (err, correoUsado) => {
                            if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
                            if (!correoUsado || parametros.correo == infoUsuario.correo) {
                                Usuario.findByIdAndUpdate(idUsuario, parametros, { new: true }, (err, usuarioEditado) => {
                                    if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
                                    if (!usuarioEditado) return res.status(500).send({ mensaej: 'Error al editar el usuario' });

                                    return res.status(200).send({ usuario: usuarioEditado });
                                })
                            } else {
                                return res.status(500).send({ mensaje: 'El correo ya se encuentra en el sistema' });
                            }
                        })
                    } else {
                        return res.status(500).send({ mensaej: 'Ingrese una direccion de correo valida' })
                    }
                }
            } else {
                return res.statu(500).send({ mensaje: 'No se encontro el alumno' })
            }
        })
    } else {
        return res.status(404).send({ mensaje: 'No esta autorizado para editar el usuario' });
    }
}

function ingresarVehiculo(req, res) {
    var parametros = req.body;
    if (req.user.rol == "Alumno") {
        if (parametros.marbete[0].vehiculo && parametros.marbete[0].placas && parametros.marbete[0].modelo) {
            Usuario.findById(req.user.sub, (err, infoAlumno) => {
                if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
                if (!infoAlumno) return res.status(500).send({ mensaje: 'No se encontro la informacion del alumno' });
                if (infoAlumno.marbete[0].fechaInicio != '') {
                    return res.status(500).send({ mensaje: 'usted ya cuenta con un marbete que caduca el ' + infoAlumno.marbete[0].fechaFin })
                } else if (infoAlumno.marbete[0].vehiculo != '') {
                    Usuario.findOneAndUpdate({ marbete: { $elemMatch: { _id: infoAlumno.marbete[0]._id } } },
                        { 'marbete.$.vehiculo': parametros.marbete[0].vehiculo, 'marbete.$.placas': parametros.marbete[0].placas, 'marbete.$.modelo': parametros.marbete[0].modelo },
                        { new: true },
                        (err, usuarioEditado) => {
                            if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
                            if (!usuarioEditado) return res.status(500).send({ mensaje: 'Error al editar su vehiculo' });
                            return res.status(200).send({ vehiculo: usuarioEditado.marbete[0] });
                        })
                } else {
                    Usuario.findOneAndUpdate({ marbete: { $elemMatch: { _id: infoAlumno.marbete[0]._id } } },
                        { 'marbete.$.vehiculo': parametros.marbete[0].vehiculo, 'marbete.$.placas': parametros.marbete[0].placas, 'marbete.$.modelo': parametros.marbete[0].modelo },
                        { new: true },
                        (err, usuarioEditado) => {
                            if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
                            if (!usuarioEditado) return res.status(500).send({ mensaje: 'Error al editar su vehiculo' });
                            return res.status(200).send({ vehiculo: usuarioEditado.marbete[0] });
                        })
                }
            })
        } else {
            return res.status(500).send({ mensaje: 'Rellene todos los campos' })
        }
    } else {
        return res.status(500).send({ mensaje: 'No esta autorizado para ingresar un vehiculo' });
    }
}

//ingresarFondosAlumno
function ingresarFondos(req, res) {
    var idAlumno = req.params.idAlumno;
    var parametros = req.body;
    if (req.user.rol == 'Admin_Cafeteria') {
        if (parametros.cantidad >= 10) {
            Usuario.findByIdAndUpdate(idAlumno, { $inc: { cuentaCafeteria: parametros.cantidad } }, { new: true }, (err, usuarioEditado) => {
                if (err) return res.status(404).send({ mensaje: 'Eror en la peticion del Usuario' });
                if (!usuarioEditado) return res.status(500).send({ mensaje: 'Error al ingresar dinero en la cuenta' });

                return res.status(200).send({ usuario: usuarioEditado })
            })
        } else {
            return res.status(500).send({ mensaje: 'Deposite una cantidad de minimo Q10.00' })
        }
    } else if (req.user.rol == 'Admin_Secretaria') {
        if (parametros.cantidad >= 10) {
            Usuario.findByIdAndUpdate(idAlumno, { $inc: { cuentaAdmin: parametros.cantidad } }, { new: true }, (err, usuarioEditado) => {
                if (err) return res.status(404).send({ mensaje: 'Eror en la peticion del Usuario' });
                if (!usuarioEditado) return res.status(500).send({ mensaje: 'Error al ingresar dinero en la cuenta' });

                return res.status(200).send({ usuario: usuarioEditado })
            })
        } else {
            return res.status(500).send({ mensaje: 'Deposite una cantidad de minimo Q10.00' })
        }
    } else {
        return res.status(500).send({ mensaje: 'No esta autorizado para ingresar fondo' })
    }
}

//Eliminar
function eliminarUsuario(req, res) {
    var idUsuario = req.params.idUsuario;
    if (req.user.rol == 'Admin_APP') {
        Pedidos.find({ idUsuario: idUsuario }, (err, pedidoEncontrado) => {
            if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
            if (pedidoEncontrado != 0) {
                for (let i = 0; i < pedidoEncontrado.length; i++) {
                    Producto.findByIdAndUpdate(pedidoEncontrado[i].idProducto, { $inc: { stock: pedidoEncontrado[i].cantidad } }, { new: true }, (err, productosActualizados) => {
                        if (err) return res.status(404).send({ mensaje: 'Error en la peticionS' });
                        if (!productosActualizados) return res.status(500).send({ mensaje: 'Error al actualizar el producto' });
                    })
                }
                Pedidos.deleteMany({ idUsuario: idUsuario }, (err, pedidosEliminados) => {
                    if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
                    if (!pedidosEliminados) return res.status(500).send({ mensaje: 'Error al eliminar los productos' });
                })
            }
            Usuario.findByIdAndDelete(idUsuario, (err, usuarioEliminado) => {
                if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
                if (!usuarioEliminado) return res.status(500).send({ mensaje: 'Error al eliminar el usuario' });
                return res.status(200).send({ usuario: usuarioEliminado });
            })
        });
    } else {
        return res.status(500).send({ mensaje: 'No esta autorizado para eliminar un usuario' });
    }
}

//Usuarios
function alumnos(req, res) {
    if (req.user.rol != 'Alumno') {
        Usuario.find({ rol: 'Alumno' }, (err, alumnosEncontrados) => {
            if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
            if (!alumnosEncontrados) return res.status(500).send({ mensaje: 'No se encontraron alumnos' });

            return res.status(200).send({ usuarios: alumnosEncontrados });
        })
    } else {
        return res.status(500).send({ mensaje: 'No esta autorizado' });
    }
}

function administradoresSecretaria(req, res) {
    if (req.user.rol == 'Admin_APP') {
        Usuario.find({ rol: 'Admin_Secretaria' }, (err, adminsEncontrados) => {
            if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
            if (!adminsEncontrados) return res.status(500).send({ mensaje: 'No se encontraron alumnos' });

            return res.status(200).send({ usuarios: adminsEncontrados });
        })
    } else {
        return res.status(500).send({ mensaje: 'No esta autorizado' });
    }
}

function administradoresCafeteria(req, res) {
    if (req.user.rol == 'Admin_APP') {
        Usuario.find({ rol: 'Admin_Cafeteria' }, (err, adminsEncontrados) => {
            if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
            if (!adminsEncontrados) return res.status(500).send({ mensaje: 'No se encontraron alumnos' });

            return res.status(200).send({ usuarios: adminsEncontrados });
        })
    } else {
        return res.status(500).send({ mensaje: 'No esta autorizado' });
    }
}

function administradores(req, res) {
    if (req.user.rol == 'Admin_APP') {
        Usuario.find({ rol: ['Admin_Secretaria', 'Admin_Cafeteria'] }, (err, adminsEncontrados) => {
            if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
            if (!adminsEncontrados) return res.status(500).send({ mensaje: 'No se encontraron alumnos' });

            return res.status(200).send({ usuarios: adminsEncontrados });
        })
    } else {
        return res.status(500).send({ mensaje: 'No esta autorizado' });
    }
}

function verMarbete(req, res) {
    if (req.user.rol == 'Alumno') {
        Usuario.findById(req.user.sub, (err, infoAlumno) => {
            if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
            if (!infoAlumno) return res.status(500).send({ mensaje: 'Error al cargar los datos del usuario' });
            if (infoAlumno.marbete[0].fechaInicio != '') {
                return res.status(200).send({ marbete: infoAlumno.marbete[0] })
            } else {
                return res.status(500).send({ mensaje: 'Usted no ha tramitado su marbete' })
            }
        })
    } else {
        return res.status(500).send({ mensaje: 'Solo los alumnos pueden ver su marbete' });
    }
}

//Busquedas
function usuarioId(req, res) {
    var idUsuario = req.params.idUsuario;
    const date = new Date();
    var year = date.getFullYear();
    var month = (date.getMonth() + 1)
    var month2 = (date.getMonth() + 2)
    if (month <= 9) {
        month = '0' + (date.getMonth() + 1)
    }
    if (month2 <= 9) {
        month2 = '0' + (date.getMonth() + 2)
    }
    var day = date.getDate();
    if (day <= 9) {
        day = '0' + date.getDate();
    }
    const tiempoTranscurrido = year + '-' + month + '-' + day;
    const mesPronto = year + '-' + month2 + '-' + day;
    Usuario.findById(idUsuario, (err, usuarioEncontrado) => {
        if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
        if (!usuarioEncontrado) return res.status(500).send({ mensaje: 'Error al encontrar usuarios' });
        var fhoy = new Date(tiempoTranscurrido).getTime();
        var fBan = new Date(usuarioEncontrado.fechaBaneo).getTime();
        var fFin = new Date(usuarioEncontrado.marbete[0].fechaFin).getTime();
        if (req.user.rol == 'Alumno') {
            if (usuarioEncontrado.fechaBaneo != '') {
                if (fhoy > fBan) {
                    Usuario.findByIdAndUpdate(req.user.sub, { fechaBaneo: '', strikes: 0 }, { new: true }, (err, desbaneo) => {
                        if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
                        if (!desbaneo) return res.status(500).send({ mensaje: 'Error al desbanear' })
                    })
                }
            }
            if (usuarioEncontrado.marbete[0].fechaInicio != '') {
                if (fhoy > fFin) {
                    Usuario.findOneAndUpdate({ marbete: { $elemMatch: { _id: usuarioEncontrado.marbete[0]._id } } },
                        { 'marbete.$.fechaInicio': '', 'marbete.$.fechaFin': '' },
                        { new: true },
                        (err, usuarioEditado) => {
                            if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
                            if (!usuarioEditado) return res.status(500).send({ mensaje: 'Error al editar su vehiculo' })
                        })
                }
            }
            Usuario.findById(idUsuario, (err, usuarioEncontrado) => {
                if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
                if (!usuarioEncontrado) return res.status(500).send({ mensaje: 'Error al encontrar el usuario' })
                return res.status(200).send({ usuario: usuarioEncontrado });
            })
        } else {
            return res.status(200).send({ usuario: usuarioEncontrado });
        }
    })
}

function alumnosPorNombres(req, res) {
    var nombre = req.params.nombre;
    if (req.user.rol != 'Alumno') {
        Usuario.find({ nombres: { $regex: nombre, $options: 'i' }, rol: 'Alumno' }, (err, usuariosEncontrados) => {
            if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
            if (!usuariosEncontrados) return res.status(500).send({ mensaje: 'No se encontraron alumnos' })
            return res.status(200).send({ usuarios: usuariosEncontrados });
        })
    } else {
        return res.status(500).send({ mensaje: 'No esta autorizado' })
    }
}

function alumnosPorApellidos(req, res) {
    var apellido = req.params.apellido;
    if (req.user.rol != 'Alumno') {
        Usuario.find({ apellidos: { $regex: apellido, $options: 'i' }, rol: 'Alumno' }, (err, usuariosEncontrados) => {
            if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
            if (!usuariosEncontrados) return res.status(500).send({ mensaje: 'No se encontraron alumnos' })
            return res.status(200).send({ usuarios: usuariosEncontrados });
        })
    } else {
        return res.status(500).send({ mensaje: 'No esta autorizado' })
    }
}

function alumnosPorCarnet(req, res) {
    var carnet = req.params.carnet;
    if (req.user.rol != 'Alumno') {
        Usuario.find({ carnet: { $regex: carnet, $options: 'i' }, rol: 'Alumno' }, (err, usuariosEncontrados) => {
            if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
            if (!usuariosEncontrados) return res.status(500).send({ mensaje: 'No se encontraron alumnos' })
            return res.status(200).send({ usuarios: usuariosEncontrados });
        })
    } else {
        return res.status(500).send({ mensaje: 'No esta autorizado' })
    }
}

function alumnosPorCorreo(req, res) {
    var correo = req.params.correo;
    if (req.user.rol != 'Alumno') {
        Usuario.find({ correo: { $regex: correo, $options: 'i' }, rol: 'Alumno' }, (err, usuariosEncontrados) => {
            if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
            if (!usuariosEncontrados) return res.status(500).send({ mensaje: 'No se encontraron alumnos' })
            return res.status(200).send({ usuarios: usuariosEncontrados });
        })
    } else {
        return res.status(500).send({ mensaje: 'No esta autorizado' })
    }
}

module.exports = {
    AdminApp,
    AgregarAdmin,
    Login,
    administradoresCafeteria,
    administradoresSecretaria,
    agregarAlumno,
    alumnos,
    alumnosPorApellidos,
    alumnosPorCarnet,
    alumnosPorCorreo,
    alumnosPorNombres,
    editarUsuario,
    eliminarUsuario,
    ingresarFondos,
    usuarioId,
    administradores,
    ingresarVehiculo,
    verMarbete
}