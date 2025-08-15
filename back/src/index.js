const express= require('express');
const morgan = require('morgan');
const database= require('./database');
const cors = require('cors');
const productosRoutes = require('../routes/productos');


//Configuracion inicial
/*creo instancia de express*/
const app = express();
/*le doy un puerto a express y hago que escuche*/
app.set("port", 4000);

//Middlewares
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.listen(app.get("port"));
console.log("Escuchando con el puerto"+ app.get("port"));

app.use(express.json());
app.use(morgan('dev'));


//Rutas
app.use('/productos', productosRoutes);
