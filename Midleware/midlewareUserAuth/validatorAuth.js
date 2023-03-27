import { body, validationResult } from "express-validator";
import Usuario from "../../models/Usuario.js";

/**
 * Metodo que valida hay un usuario con el mismo email, retorna el error y lo envia a la vista del mismo
 * formulario donde se esta capturando la info de un nuevo registro
 */
const validationResultExpress = async (req, res, next) => {
  const resultado = validationResult(req); //

  //Si no esta vacio entonces si hay errores  y mandamos algo al front mostrando lo k pasa
  if (!resultado.isEmpty()) {
    return res.render("auth/registro", {
      pagina: "Crear cuenta",
      errores: resultado.array(),
      usuario: {
        nombre: req.body.nombre,
        email: req.body.email,
      },
    });
    // return res.status(400).json({ errors: errors.array() });
  } else {
    console.log(
      "no hay errores en la validacion, el usuario sera creado: " +
        req.body.nombre
    );
  }
  //Validamos si el usuario ya existe en db.
  const { nombre, email, password } = req.body;
  const existeUsuario = await Usuario.findOne({
    where: { email }, //valido si existe usuario por su email
  });
  // console.log(existeUsuario);
  if (existeUsuario) {
    return res.render("auth/registro", {
      //csrfToken: req.csrfToken(),

      pagina: "Crear cuenta",
      errores: [{ msg: "El usuario ya esta registrado no mms" }],
      usuario: {
        nombre: req.body.nombre,
        email: req.body.email,
      },
    });
  }
  next(); //Si todo salio bien y el usuario en bien nuevo, pasamos al siguiente codigo
};

/**
 * Este metodo valida el email que envio que este bien escrito
 */
const validationResultOlvPassExpress = async (req, res, next) => {
  const resultado = validationResult(req); //
  //Si no esta vacio entonces si hay errores  y mandamos algo al front mostrando lo k pasa
  if (!resultado.isEmpty()) {
    return res.render("auth/olvide-password", {
      csrfToken: req.csrfToken(),
      pagina: "Recuperar Contraseña",
      errores: resultado.array(),
      usuario: {
        nombre: req.body.nombre,
        email: req.body.email,
      },
    });
    // return res.status(400).json({ errors: errors.array() });
  } else {
    console.log("si existe el usuario contnua a crear nuevo paswword");
  }

  next();
};
/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const validationResultReesNewPassExpress = async (req, res, next) => {
  const resultado = validationResult(req); //
  //Si no esta vacio entonces si hay errores  y mandamos algo al front mostrando lo k pasa
  if (!resultado.isEmpty()) {
    return res.render("auth/reset-password", {
      csrfToken: req.csrfToken(),
      post: {
        pagina: "REESTABLECE TU PASSWORD",
        mensaje: `Reestablece tu password a la verg`,
        usuario: {
          nombre: req.body.nombre,
          email: req.body.email,
        },
      },
      pagina: "Iniciar Sesion",
      errores: resultado.array(),
    });
    // return res.status(400).json({ errors: errors.array() });
  } else {
    console.log(
      "no hay errores en la validacion, el usuario iniciara sesion: " +
        req.body.nombre
    );
  }
  next();
};
const validationResultLoginExpress = async (req, res, next) => {
  const resultado = validationResult(req); //
  //Si no esta vacio, entonces si hay errores  y mando algo al front mostrando lo k pasa
  if (!resultado.isEmpty()) {
    return res.render("auth/login", {
      csrfToken: req.csrfToken(),
      post: {
        pagina: "Inicia Sesion",
        mensaje: `un mensaje`,
        usuario: {
          nombre: req.body.nombre,
          email: req.body.email,
        },
      },
      pagina: "Iniciar Sesion",
      errores: resultado.array(),
    });
    // return res.status(400).json({ errors: errors.array() });
  } else {
    console.log(
      "no hay errores en la validacion, el usuario iniciara sesion: " +
        req.body.nombre
    );
  }
  console.log("Midleware pasado con exitoy continua...a la siguiente funcion");

  next();
};
/**
 * Este Midleware valida la data del formulario de login
 * */
const bodyLoginValidator = [
  body("email", "Formato de email incorrecto")
    .trim()
    .isEmail()
    .normalizeEmail(),
  body("password", "Mínimo 6 carácteres").trim().isLength({ min: 6 }),
  //Crear su propio validation
  validationResultLoginExpress,
];

/**
 * Este Midleware valida la data del formulario de registro, las constraseñas iguales tambien
 * */
const bodyRegisterValidator = [
  body("email", "Formato de email incorrecto")
    .trim()
    .isEmail()
    .normalizeEmail(),
  body("password", "Mínimo 6 carácteres").trim().isLength({ min: 6 }),
  body("password", "Formato de password incorrecta").custom(
    (value, { req, res }) => {
      //Aqui veo que me manda el formulario de registro;
      /*       console.log(req.body);
      console.log(value); */
      if (value !== req.body.repetir_password) {
        throw new Error("No coinciden las contraseñas");
      }
      return value;
    }
  ),
  validationResultExpress,
];
const bodyReqPassValidator = [
  body("email", "Formato de email incorrecto")
    .trim()
    .isEmail()
    .normalizeEmail(),
  validationResultOlvPassExpress,
];

const bodyReqRessNewPassValidator = [
  body("password", "Mínimo 6 carácteres").trim().isLength({ min: 6 }),
  validationResultReesNewPassExpress,
];

export {
  bodyLoginValidator,
  bodyRegisterValidator,
  bodyReqPassValidator,
  bodyReqRessNewPassValidator,
};
