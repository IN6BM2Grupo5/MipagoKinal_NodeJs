const jwt_simple = require('jwt-simple');
const moment = require('moment');
const secret = 'MipagoKinalSecurityPass'

exports.crearToken = function(usuarios){
    let payload = {
        sub: usuarios._id,
        nombre: usuarios.nombre,
        correo:usuarios.correo,
        carnet:usuarios.carnet,
        rol: usuarios.rol,
        iat: moment().unix(),
        exp: moment().day(7, 'days').unix(),
        }

        return jwt_simple.encode(payload, secret);
}