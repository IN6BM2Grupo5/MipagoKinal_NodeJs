const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PedidosSchema = Schema({
    producto:String,
    cantidad:Number,
    subTotal:Number,
    alumno:String,
    carnet:String,
    tipo:String,
    fechaPedido:String,
    idAlumno:{type: Schema.Types.ObjectId, ref: 'usuarios'},
    idProducto:{type: Schema.Types.ObjectId, ref: 'productos'},
});

module.exports = mongoose.model('pedidos', PedidosSchema);