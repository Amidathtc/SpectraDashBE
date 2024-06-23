import mongoose from "mongoose";
import { EnvironmentVariables } from "./envV";

const MONGODB_URL: string | undefined =
  EnvironmentVariables.DB_LIVEURl!;

export const DBCONNECTION = async () => {
  try {
    await mongoose.connect(MONGODB_URL);
    console.log("");
    if (mongoose.connection.host === "0.0.0.0") {
      console.log("You're Connected to Local Host Server"); // if connected to local database
    } else {
      console.log("You're Connected To Live Server"); // if connected to cloud database
    }
  } catch (error:any) {
    console.log(error);
    console.log(`Database connection error. Couldn't connect because , ${error.message}`);
  }
};
