import express, { Application } from "express";
import { MainAppConfig } from "./app";
import { EnvironmentVariables } from "./config/envV";
import { DBCONNECTION } from "./config/database";
import env from "dotenv";
env.config();

// Preventing the server from crashing
process.on("uncaughtException", (error: Error) => {
  console.log("Server is Shutting down due to uncaughtException", error);
  process.exit(1);
});

// The port of our backend server
const port: number = EnvironmentVariables.PORT || 1200 ;

// Extantiating our server from express
const app: Application = express();

// Connecting main app configuration
MainAppConfig(app);

// Server is connected and listening to port
const server = app.listen(port || process.env.PORT, () => {
  console.clear();

  // Connecting DB to server
  DBCONNECTION();

  console.log(
    "Server is up and running 🚀🚀 \nListening to Server on port:",
    port
  );
});
process.on('unhandledRejection', (reason:any, promise:any) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Application specific logging, throwing an error, or other logic here
  server.close(() => {
    process.exit(1);
  });
});

// process.once("unhandledRejection", (reason: any) => {
//   console.log("Server is Shutting down due to unhandledRejection", reason);
//   server.close(() => {
//     process.exit(1);
//   });
// });
