const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductosSchema = Schema({
    producto:String,
    descripcion:String,
    precio:Number,
    stock:Number,
    estado:String,
    tipo:String,
    subTipo:String
});

module.exports = mongoose.model('productos', ProductosSchema);