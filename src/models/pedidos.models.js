const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PedidosSchema = Schema({
    producto:String,
    cantidad:String,
    subTotal:Number,
    alumno:Number,
    idAlumno:{type: Schema.Types.ObjectId, ref: 'usuarios'},
    idProducto:{type: Schema.Types.ObjectId, ref: 'productos'},
});

module.exports = mongoose.model('pedidos', PedidosSchema);