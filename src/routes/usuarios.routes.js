const express = require('express');
const usuariosController = require('../controllers/usuarios.controller');
const md_autenticacion = require('../middlewares/autenticacion');

var api= express.Router();

//Login
api.post('/login', usuariosController.Login)
//Agregar Usuarios
api.post('/agregarAlumno',md_autenticacion.Auth, usuariosController.agregarAlumno);
api.post('/agregarAdmin',md_autenticacion.Auth, usuariosController.AgregarAdmin);
//Editar Usuarios
api.put('/editarUsuario/:idUsuario',md_autenticacion.Auth, usuariosController.editarUsuario);
//Ingresar Fondos
api.put('/ingresarFondos/:idAlumno',md_autenticacion.Auth, usuariosController.ingresarFondos);
//Eliminar Usuarios
api.delete('/eliminarUsuario/:idUsuario',md_autenticacion.Auth, usuariosController.eliminarUsuario);
//Usuarios
api.get('/alumnos',md_autenticacion.Auth,md_autenticacion.Auth, usuariosController.alumnos);
api.get('/administradoresCafeteria',md_autenticacion.Auth,md_autenticacion.Auth, usuariosController.administradoresCafeteria);
api.get('/administradoresSecretaria',md_autenticacion.Auth,md_autenticacion.Auth, usuariosController.administradoresSecretaria);
api.get('/administradores',md_autenticacion.Auth,md_autenticacion.Auth, usuariosController.administradores);
//Busquedas
api.get('/usuarioPorId/:idUsuario',md_autenticacion.Auth,md_autenticacion.Auth, usuariosController.usuarioId);
api.get('/alumnosPorNombre/:nombre',md_autenticacion.Auth,md_autenticacion.Auth, usuariosController.alumnos);
api.get('/alumnosPorApellido/:apellido',md_autenticacion.Auth,md_autenticacion.Auth, usuariosController.alumnos);
api.get('/alumnosPorCarnet/:carnet',md_autenticacion.Auth,md_autenticacion.Auth, usuariosController.alumnos);
api.get('/alumnosPorCorreo/:correo',md_autenticacion.Auth,md_autenticacion.Auth, usuariosController.alumnos);

module.exports = api;