const mongoose = require('mongoose');
const app = require('./app');
const usuarioController = require('./src/controllers/usuarios.controller');

mongoose.Promise = global.Promise;
const url = 'mongodb://localhost:27017/MipagoKinal'

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log("Se encuentra conectado a la base de datos.");

    app.listen(3000, function () {
        console.log("Mipago Kinal, esta ejecutandose!");
    })

}).catch(error => console.log(error));

usuarioController.AdminApp();