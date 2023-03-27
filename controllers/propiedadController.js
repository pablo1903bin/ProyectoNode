/**
 * Metodo Ruta de administrador
 * @param {Request} req
 * @param {Response} res
 */
const admin = (req, res) => {
  res.render("propiedades/admin", {
    post: {
      pagina: "Mis Propiedades",
    },
    pagina: "Mis Propiedades",
    barra: true,
  });
};

export { admin };
