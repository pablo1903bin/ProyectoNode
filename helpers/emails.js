import nodemailer from "nodemailer";

/**
 * Metodo que envia un correo
 * llamado para enviar correo en el controlador
 */
const emailRegistro = async (datos) => {
  //Aqui se conecta a nodemailer con las credenciales
  const transport = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "7d32def15840c0",
      pass: "5c11adf0cf1031",
    },
  });

  const { nombre, email, token } = datos; //Desestructuro el objeto que me envian al invocar la funcion de emailRegistro

  //Enviar el email al registrado
  await transport.sendMail({
    from: "Inmobiliaria.com",
    to: email,
    subject: "Confirma tu cuenta en La Pagina Pro",
    text: "Confirma tu cuenta en Inmobiliaria",
    html: `
    <h2>
    Hola ${nombre}, comprueba tu cuenta en PaginPro.com
    </h2>
    <p>Tu cuenta ya esta lista, solo debes confirmarla en el siguiente enlace:</p>
    <a href="${process.env.BACKEND_URL}:${
      process.env.PORT ?? 5000
    }/api/v1/auth/confirmar/${token}">Confirmar Cuenta</a>

    <p>Si tu no creaste esta cuenta, puedes ignorar el mensaje</p>
    `,
  });
};
const emailOlvidePassword = async (datos) => {
  //Aqui se conecta a nodemailer con las credenciales
  const transport = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "7d32def15840c0",
      pass: "5c11adf0cf1031",
    },
  });

  const { nombre, email, token } = datos; //Desestructuro el objeto que me envian al invocar la funcion de emailRegistro

  //Enviar el email al registrado
  await transport.sendMail({
    from: "Inmobiliaria.com",
    to: email,
    subject: "Restablece tu password en La Pagina Pro",
    text: "Restablece tu password en Inmobiliaria",
    html: `
    <h2>
    Hola ${nombre}, has solicitado reestablecer tu password en PaginPro.com
    </h2>
    <p>Sigue el siguiente enlace para generar un password nuevo</p>
    <a href="${process.env.BACKEND_URL}:${
      process.env.PORT ?? 5000
    }/api/v1/auth/olvide-password/${token}">Reestablecer Password</a>

    <p>Si tu no solicitaste el cambio de password, puedes ignorar el mensaje</p>
    `,
  });
};

export { emailRegistro, emailOlvidePassword };
