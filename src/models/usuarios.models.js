const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UsuariosSchema = Schema({
    nombres: String,
    apellidos: String,
    carnet:String,
    usuario: String,
    password: String,
    correo:String,
    rol: String,
    cuentaAdmin:Number,
    cuentaCafeteria:Number,
    carritoAdmin: [{
        descripcion: String,
        precio:Number,
        cantidad:Number,
        fechaEntrega:Date,
        subtotal:Number
    }],
    carritoCafeteria: [{
        descripcion: String,
        precio:Number,
        cantidad:Number,
        fechaEntrega:Date,
        subTotal:Number
    }],
    marbete:[{
        vehiculo:String,
        placas:String,
        modelo:String,
        fechaInicio:String,
        fechaFin:String,
    }],
    totalAdministracion:Number,
    totalCafeteria:Number
});

module.exports = mongoose.model('usuarios', UsuariosSchema);