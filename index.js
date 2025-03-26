import app from "./src/app.js";

// const PORT = 3000;

const PORT = process.env.NODE_DOCKER_PORT;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});


//solución - ign
process.on("uncaughtException", (err) => {
  console.error("Error no capturado:", err);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Promesa rechazada sin capturar:", reason);
});

app.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`Eel puerto ${process.env.NODE_DOCKER_PORT || 3000} ya está en uso.`);
    process.exit(1); //Detener app
  } else {
    console.error("Error inesperado:", err);
  }
});