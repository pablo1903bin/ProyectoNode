import Sequelize from "sequelize";
import dotenv from "dotenv";
dotenv.config({ path: ".env" });

const db = new Sequelize(
  process.env.BD_NOMBRE, //Nombre de la base de datos
  process.env.BD_USER, //Nombre de usuario de la db
  process.env.BD_PASS, //Contraseña del usuario
  {
    host: "localhost",
    port: "3306",
    dialect: "mysql",
    define: { timestamps: true },
    pool: { max: 5, min: 0, acquire: 30000, idle: 10000 },
    operatorAliases: false,
  }
);

export default db;
