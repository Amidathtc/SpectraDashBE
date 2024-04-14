import { Router } from "express";
import {
  ViewAllUsers,
  getUser,
  logoutUser,
  loginUser,
  updateUser,
  createUser,
  
} from "../controller/userContoller";

const userRoute = Router();

userRoute.route("/get-all-users").get(ViewAllUsers);
userRoute.route("/create-user").post(createUser);
userRoute.route("/login").post(loginUser);
userRoute.route("/logout").post(logoutUser);
userRoute.route("/get-user/:userID").get(getUser);
userRoute.route("/update-user-info/:userID").patch(updateUser);

export default userRoute;
