import { Router } from "express";
import {
  viewAllUsers,
  getUser,
  logoutUser,
  loginUser,
  updateUser,
  createUser,
  verifyUsers,
  deleteUser,
  lginUser,
  deleteAUser,
} from "../controller/userController";

const userRouter = Router();

userRouter.route("/get-all-users").get(viewAllUsers);
userRouter.route("/create-user").post(createUser);
userRouter.route("/login").post(loginUser);
userRouter.route("/signin").post(lginUser);
userRouter.route("/logout").post(logoutUser);
userRouter.route("/get-user/:userID").get(getUser);
userRouter.route("/delete-user/:userID").delete(deleteUser);
userRouter.route("/delete-a-user/:userID").delete(deleteAUser);
userRouter.route("/update-user-info/:userID").patch(updateUser);
userRouter.route("/verify/:userID").get(verifyUsers);
export default userRouter;
