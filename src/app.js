import express from "express";
import bodyParser from "body-parser";
import userRoutes from "./routes/userRoutes.js";
import swaggerSpec from "./api-docs.js";
import swaggerUi from "swagger-ui-express";
import "./config/bd.js";

import startConsumer from "./services/listenerRabbit.js";

const app = express();

app.use(bodyParser.json());

//Rutas
app.use("/api/users", userRoutes);

//Documentación Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

startConsumer();

export default app;

// Manejador de errores global -ign
app.use((err, req, res, next) => {
  console.error("Error en la API:", err);
  res.status(500).json({ message: "Ocurrió un error interno en el servidor" });
});

