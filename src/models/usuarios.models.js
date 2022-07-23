const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UsuariosSchema = Schema({
    nombres: String,
    apellidos: String,
    carnet:String,
    password: String,
    correo:String,
    rol: String,
    cuentaAdmin:Number,
    cuentaCafeteria:Number,
    strikes:Number,
    fechaBaneo:String,
    marbete:[{
        vehiculo:String,
        placas:String,
        modelo:String,
        fechaInicio:String,
        fechaFin:String
    }]
});

module.exports = mongoose.model('usuarios', UsuariosSchema);