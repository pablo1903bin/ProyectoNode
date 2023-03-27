import Usuario from "../models/Usuario.js";
import { generarId, generarJWT } from "../helpers/tokens.js";
import { emailRegistro, emailOlvidePassword } from "../helpers/emails.js";
import bcrypt from "bcrypt";

/**
 * GET Devuelve formuario de login ala vista
 * */
const formularioLogin = (req, res) => {
  res.render("auth/login", {
    csrfToken: req.csrfToken(),
    post: {
      pagina: "Inicia Sesion",
    },
  });
};

//POST Resibiendo data del formulario de login de la vista
const logeado = async (req, res) => {
  //Comnprobar si el usuario existe con su correo
  console.log(
    "Email del usuario:  " +
      req.body.email +
      "  Password del usuario:  " +
      req.body.password
  );

  const { email, password } = req.body; //destruccturing
  const usuario = await Usuario.findOne({ where: { email } }); //Buscar usuario con el email
  //Validar si el usuario no existe
  if (!usuario) {
    return res.render("auth/login", {
      //mandar a la misma ruta errores
      csrfToken: req.csrfToken(),
      errores: [{ msg: "ESTE USUARIO NO EXISTE" }],
      post: {
        pagina: "Inicia Sesion",
      },
    });
  }
  console.log("Usuario confirmado:  " + usuario.confirmado);
  //Cpmprobar si el usuario esta confirmado
  if (!usuario.confirmado) {
    return res.render("auth/login", {
      //mandar a la misma ruta errores
      csrfToken: req.csrfToken(),
      errores: [{ msg: "TU CUENTA NO HA SIDO CONFIRMADA" }],
      post: {
        pagina: "Inicia Sesion",
      },
    });
  }
  //Validar el password
  if (!usuario.verificarPassword(password)) {
    return res.render("auth/login", {
      //mandar a la misma ruta errores
      csrfToken: req.csrfToken(),
      errores: [{ msg: "CREDENCIALES INCORRECTAS" }],
      post: {
        pagina: "Inicia Sesion",
      },
    });
  }

  //Autenticar el usuario
  const token = generarJWT({ id: usuario.id, nombre: usuario.nombre });

  // El token se enviara al nevegador
  return res
    .cookie("_token", token, {
      httpOnly: true, //
      //secure:true//para conexiones seguras hhtps
    })
    .redirect("/mis-propiedades");
};

/**
 * @param {Request} req
 * @param {Response} res
 *GET Devuelve El formulario de registro a la vista
 */
const formularioRegistro = (req, res) => {
  res.render("auth/registro", {
    csrfToken: req.csrfToken(),
    post: {
      pagina: "Regístrate",
    },
    //  csrfToken: req.csrfToken(), //Enviar el token csrf// Lo que me envien en el formulario es seguro
  });
};

/**
 * Metodo que se invoca al enviar data al endpoint http://localhost:4000/api/v1/auth/registro por metodo POST, crea un registro de usuario, envia el
 * email
 *
 *Devuelve una vista a mensaje de Confirma tu cuenta en mailtrap
 */
const registrar = async (req, res) => {
  //Destructuring y creando nuevo registro en la db
  const { nombre, email, password } = req.body;
  //Persistimos y estos datos, Una ves guardados ahora los almaceno en mi const usuario
  const usuario = await Usuario.create({
    nombre,
    email,
    password,
    token: generarId(), //Invoco el metodo que crea mi tokenID unico para cada usuario claro
  });

  //Enviar email de confirmacion al que registró el usuario con metodo de Helpers emailRegistro
  emailRegistro({
    //invocar metodo emailRegistro pasarle tres argumentos al metodo, l metodo los resibe como data y los desestructurará
    nombre: usuario.nombre,
    email: usuario.email,
    token: usuario.token,
  });
  //Mostrar Vista mensaje.hbs para confirmar email

  res.render("templates/mensaje", {
    post: {
      pagina: "Confirma tu cuenta nueva 2023",
      mensaje:
        "Hemos enviado un Email de confirmación, presiona en el enlace que aparece dentro del correo",
      comments: [],
    },
  });
  //res.json({ ok: "Registro exitoso" });
};

/**
 * Metodo que confirma una cuenta al dar un clic en el link de confirmar dentro del email que se envio
 * */
const confirmar = async (req, res) => {
  const { token } = req.params; //aqui leo el valor del parametro pasado en la url

  //Verificar si el token es valido);
  const usuarioT = await Usuario.findOne({ where: { token } }); //Busca usuario por token

  //Evaluar si existe o no el token que me envian a confirmar YA QUE PUEDE SER ALTERADO EN LA URL
  if (usuarioT === null) {
    //Este token no existe y renderizo la pagina de error al confirmar mi token
    return res.render("templates/confirmar-cuenta", {
      post: {
        pagina: "CONFIRMA TU CUENTA",
        mensaje: `HUBO UN ERROR AL CONFIRMAR TU CUENTA`,
      },
      error: false,
    });
  } else {
    //Confirmar la cuenta
    usuarioT.token = null; //Elimino el token en memoria
    usuarioT.confirmado = true; //Cambio a true este valor para indicar k fue confirmado
    await usuarioT.save(); // envio eeste usuarioT que tengo ahora en memoria a la db
  }
  res.render("templates/confirmar-cuenta", {
    post: {
      pagina: "CONFIRMA TU CUENTA",
      mensaje: `TU CUENTA SE CONFIRMO CORRECTAMENTE`,
    },
    error: true,
  });
};

//GET Devolviendo el formulario de olvide password a la vista
const formularioOlvidePassword = (req, res) => {
  // console.log("Ruta Olvide-password GET");
  res.render("auth/olvide-password", {
    pagina: "Recuperar password",
    csrfToken: req.csrfToken(),
    post: {
      pagina: "Recuperar password",
      author: "Janith Kasun",
      comments: [],
    },
  });
};

//POST Resibiendo data del formulario de olvide_password
const olvidePassword = async (req, res) => {
  console.log("Ruta Olvide-password POST");
  //Buscar entre mis usuario
  const { email } = req.body; //Desestructurar el req que esta viajando k tiene mi objeto
  const UsuarioP = await Usuario.findOne({ where: { email } });

  if (!UsuarioP) {
    //si el usuario consultado con este email no existe
    console.log("El usuario con ese email  no existe");
    return res.render("auth/olvide-password", {
      csrfToken: req.csrfToken(),
      pagina: "Recuperar Contraseña",
      errores: [{ msg: "El email no pertenece a ningun usuario" }],
    });
  }

  //Generar un token y enviar el email
  UsuarioP.token = generarId(); //Creo un nuevo token y lo asigno en memoria nadamas antes de persistirlo
  await UsuarioP.save();
  console.log("Token generado nuevo");
  //Enviar un email
  emailOlvidePassword({
    email: UsuarioP.email,
    nombre: UsuarioP.nombre,
    token: UsuarioP.token,
  });
  //Mostrar mensaje de confirmacion
  res.render("templates/mensaje", {
    csrfToken: req.csrfToken(),
    post: {
      pagina: "Reestablece tu password",
      mensaje: "Hemos enviado un email con las instrucciones",
      comments: [],
    },
  });
  //Renderizar un mensaje en su correo para segir las instrucciones de como recuperar su cuenta
};

//Metodo que comprueba token si existe
const comprobarToken = async (req, res) => {
  const { token } = req.params;
  //console.log(token);
  //Buscar ese token k me pasan el la url como param si existe en la db.
  const usuario = await Usuario.findOne({ where: { token } });
  if (!usuario) {
    //sI EL USUARIO NO EXISTE XK ESTA MAL EL TOKEN renderizar esta vista con un error
    res.render("templates/error-validacion", {
      post: {
        pagina: "REESTABLECE TU PASSWORD",
        mensaje: `HUBO UN ERROR AL VALIDAR TU INFORMACION`,
      },
      error: true,
    });
  }
  //Si el token del usuario si existe mostrar pagina de formulario, /reset-password
  //Mostrar formulario para modificar el password

  res.render("auth/reset-password", {
    csrfToken: req.csrfToken(),
    post: {
      pagina: "REESTABLECE TU PASSWORD",
      mensaje: `HUBO UN ERROR AL VALIDAR TU INFORMACION`,
    },
    pagina: "Reestablece tu Password",
  });
};
/**
 *
 * @param {Peticion} req
 * @param {Respuesta} res
 */
const nuevoPassword = async (req, res) => {
  //Ya yego asta aqui despues de pasar la validacion en el midleware sobre la contraseña correcta
  //Identificar quien ase el cambio
  const { token } = req.params;
  console.log("El Token que viaja en el url como  prarametro es  " + token);

  const { password } = req.body;
  console.log("El password que viaja en el body es " + password);
  const usuario = await Usuario.findOne({ where: { token } });
  //Hashear el password
  const salt = await bcrypt.genSalt(10);
  usuario.password = await bcrypt.hash(password, salt);
  //Eliminar el token k vienen en la url como parametro
  usuario.token = null;

  await usuario.save();
  res.render("templates/confirmar-cuenta", {
    csrfToken: req.csrfToken(),
    error: true,
    post: {
      pagina: "PASSWORD REESTABLECIDO",
      mensaje: "PASSWORD REESTABLECIDO CON ÉXITO",
    },
  });
  console.log("Creando nuervo password...");
};

export {
  formularioLogin,
  logeado,
  formularioRegistro,
  registrar,
  confirmar,
  formularioOlvidePassword,
  olvidePassword,
  comprobarToken,
  nuevoPassword,
};
