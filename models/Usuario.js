//Definir los tipos de datos de mis modelos
import { DataTypes } from "sequelize";
import bcrypt from "bcrypt";

//
import db from "../config/db.js";
//const sequelize = new Sequelize();

//Definir un nuevo modelo
const Usuario = db.define(
  "usuarios",
  {
    //Creando columna Nombre
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    //Creando columna email
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    //Creando columna password
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    token: DataTypes.STRING,
    confirmado: DataTypes.BOOLEAN,
  },
  //Aqui vamos a hashear el password
  {
    hooks: {
      beforeCreate: async function (usuario) {
        const salt = await bcrypt.genSalt(10);
        usuario.password = await bcrypt.hash(usuario.password, salt);
      },
    },
  }
);
//Metodos Personalizados
Usuario.prototype.verificarPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};
export default Usuario;
