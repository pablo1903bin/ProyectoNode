import express from "express";
import { engine } from "express-handlebars";
import "dotenv/config";
//import bodyParser from "body-parser";
import path from "path";
import morgan from "morgan";
import { fileURLToPath } from "url";
import { dirname } from "path";
import routerUsuario from "./routes/usuarioLoginRoutes.js";
import propiedadesRoutes from "./routes/propiedadesRoutes.js";
import db from "./config/db.js";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import csrf from "csurf";

const app = express();
//Configuraciones para node
//app.set("port", process.env.PORT || 6000);

//Sirviendo archivos estaticos
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

//Configurando a express donde esta la carpeta views

//Habilitar Cookie-parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
//podra escribir en cookies del navegador
app.use(csrf({ cookie: true }));

//Conexion a la base de datos
try {
  await db.authenticate();
  db.sync();
  console.log("Conexion Exitosa a la Base de Datos");
} catch (error) {
  console.log(error);
}

//
app.use(morgan("dev"));

//Routing de primer nivel
app.use("/api/v1/auth", routerUsuario);
app.use("/", propiedadesRoutes);

//Configurando un motor de plantilla de handlelbars
app.engine(
  ".hbs",
  engine({
    layoutsDir: path.join(app.get("views"), "layout"),
    partialsDir: path.join(app.get("views"), "partials"),
    defaultLayout: "main",
    extname: ".hbs",
  })
);
app.set("view engine", ".hbs");
//Soportar datos desde un formulario
app.use(express.urlencoded({ extended: false }));

export default app;
