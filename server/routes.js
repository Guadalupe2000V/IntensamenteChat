// Routes.js - Módulo de rutas
var express = require('express');
var router = express.Router();
const push = require('./push');

const mensajes=[
{
  _id: 'xxxx',
  user:'Alegria',
  mensaje:'Soy alegria'
},
{
  _id: 'xxxx',
  user:'Desagrado',
  mensaje:'Soy desagrado'
},
{
  _id: 'xxxx',
  user:'Furia',
  mensaje:'Soy furia'
}
// ,
// {
//   _id: 'xxxx',
//   user:'Temor',
//   mensaje:'Soy temor'
// },
// {
//   _id: 'xxxx',
//   user:'Tristeza',
//   mensaje:'Soy tristeza'
// }

];


// Get mensajes
router.get('/', function (req, res) {
  //res.json('Obteniendo mensajes');
  res.json(mensajes);
});

// Post mensajes
router.post('/', function (req, res) {

  const mensaje={
    mensaje:req.body.mensaje,
    user: req.body.user
  };
  mensajes.push(mensaje);

  console.log(mensajes);

  res.json({
    ok:true,
    mensaje
  });

});

//Almacenar la suscripcion (nombre,mac, nombre dispositivo)
router.post('/suscribe',(req, res)=>{
  const suscripcion = req.body;
  push.addSuscription ( suscripcion );
  res.json('suscribe')
});

//obtener la key usuario (respuesta)
router.get('/key',(req, res)=>{
  const key = push.getKey();
  res.send(key);
  // res.json(key)
});

//Nosotros - Enviar la notificacion a los usuarios activos
//REST
router.post('/push',(req, res)=>{

  const post = {
    titulo: req.body.titulo,
    cuerpo: req.body.cuerpo,
    usuario: req.body.usuario
  };
  push.sendPush(post);
  res.json(post);
});


module.exports = router;