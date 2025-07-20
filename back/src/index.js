const express= require('express');
const morgan = require('morgan');
const database= require('./database');
const cors = require('cors');

//Configuracion inicial
/*creo instancia de express*/
const app = express();
/*le doy un puerto a express y hago que escuche*/
app.set("port", 4000);

app.listen(app.get("port"));
console.log("Escuchando con el puerto"+ app.get("port"));

//Middlewares
app.use(cors({
    origin: ["http://127.0.0.1:5500"]
}));
app.use(morgan('dev'));


//Rutas
app.get("/productos", async (req, res)=>{
    //res.json()
      const connection = await database.getConnection();
      const result = await connection.query("SELECT * FROM productos");
      res.json(result);
      
    
})