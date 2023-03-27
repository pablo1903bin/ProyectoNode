import app from "./app.js";

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});
