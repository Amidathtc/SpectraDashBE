import express, { Application} from "express";
import { MainAppConfig } from "./app";
import { EnvironmentVariables } from "./config/envV";
import { DBCONNECTION } from "./config/database";
import env from "dotenv"
env.config()


// Preventing the server from crashing
process.on("uncaughtException", (error: Error) => {
  console.log("Server is Shutting down due to uncaughtException", error);
  process.exit(1);
});

// The port of our backend server
const port: number = EnvironmentVariables.PORT;

// Extantiating our server from express
const app: Application = express();

// Connecting main app configuration
MainAppConfig(app);

// Server is connected and listening to port
const server = app.listen(port || process.env.PORT, () => {
  
  // Connecting DB to server:
  DBCONNECTION()

  console.log(
    "Server is up and running 🚀🚀 \n Listening to port on port ",
    port
  );
});

process.once("unhandledRejection", (reason: any) => {
  console.log("Server is Shutting down due to unhandledRejection", reason);
  server.close(() => {
    process.exit(1);
  });
});