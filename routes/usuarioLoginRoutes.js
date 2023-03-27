import { body, validationResult } from "express-validator";
import { Router } from "express";
//Controladores de Auth
import {
  formularioLogin,
  logeado,
  formularioRegistro,
  registrar,
  confirmar,
  formularioOlvidePassword,
  olvidePassword,
  comprobarToken,
  nuevoPassword,
} from "../controllers/userController.js";
//Midlewares Auth
import {
  bodyRegisterValidator,
  bodyLoginValidator,
  bodyReqPassValidator,
  bodyReqRessNewPassValidator,
} from "../Midleware/midlewareUserAuth/validatorAuth.js";

const router = Router();

/** http://localhost:4000/api/v1/auth/login  Method GET
 * Ruta de la vista de login retorna el formulario de login
 * */
router.get("/login", formularioLogin);

/**http://localhost:4000/api/v1/auth/login  Method POST
 * Esta ruta manda data del formulario de login,El Midleware bodyLoginValidator validara los campos que esten correctamente elaborados el email,y password
 * */
router.post("/login", bodyLoginValidator, logeado);

//Ruta de la vista de Registros de nuevos usuarios
router.get("/registro", formularioRegistro);

/**
 * En esta url con el metodo post Resibo data del formulario de registro, El Midleware bodyRegisterValidator valida si ya existe un usuario
 * registrado con ese mismo email, si no existe entonces procede a registrarlom, llamando a la funcion registrar y me devuelve una pagina de Mensaje de confirmacion por email
 * */
router.post("/registro", bodyRegisterValidator, registrar);

/**
 * Ruta para confirmar cuenta que se envia al correo, resibe parametros esta ruta
 * */
router.get("/confirmar/:token", confirmar); //como leer el valor de la url, valor por url

//Ruta de Vista de olvide password
router.get("/olvide-password", formularioOlvidePassword);

//Captura data del formulario de olvide password
router.post("/olvide-password", bodyReqPassValidator, olvidePassword);

//Almacena el nuevo password
router.get("/olvide-password/:token", comprobarToken);
router.post(
  "/olvide-password/:token",
  bodyReqRessNewPassValidator,
  nuevoPassword
);

export default router;
