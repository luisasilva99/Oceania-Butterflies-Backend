import express from "express";
import butterflyRoutes from "./routes/butterflyRoutes.js";
import db_connection from "./database/db_connection.js";
import ButterflyModel from "./models/ButterflyModel.js";

export const app = express();

app.get("/", (req, res) => {
  res.send("Hello Api!");
});

app.use(express.json());
app.use('/books', butterflyRoutes);

//Autenticacion a la base de datos
try{
    await db_connection.authenticate()//autentica la conexion a la base de datos
    console.log('conected to database 🦋')
    await ButterflyModel.sync() //sincroniza el modelo con la base de datos
    db_connection.sync() //sincroniza los modelos con la base de datos
    console.log('models syncronized')
    }catch(error){
    console.log(`error:' ${error}`)
    }

export const server = app.listen(8000, () => {
  console.log("🚀server up in http://localhost:8000/");
});