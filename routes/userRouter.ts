import { Router } from "express";
import {
  ViewAllUsers,
  getUser,
  logoutUser,
  loginUser,
  updateUser,
  createUser,
  verifyUsers,
  deleteUser
} from "../controller/userContoller";

const userRouter = Router();

userRouter.route("/get-all-users").get(ViewAllUsers);
userRouter.route("/create-user").post(createUser);
userRouter.route("/login").post(loginUser);
userRouter.route("/logout").post(logoutUser);
userRouter.route("/get-user/:userID").get(getUser);
userRouter.route("/delete-user/:userID").delete(deleteUser);
userRouter.route("/update-user-info/:userID").patch(updateUser);
userRouter.route("/verify/:userID").get(verifyUsers)
export default userRouter;
