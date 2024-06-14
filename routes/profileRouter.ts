import upload from "../Utils/multer";
import { Router } from "express";
import {
  ViewAll,
  createProfile,
  deleteOne,
  getUserProfile,
  updateProfile,
  viewUserProfile,
} from "../controller/profileController";

// const myUpload = multer().single("avatar");
const ProfileRouter = Router();

ProfileRouter.route("/:userID/create-profile").post(upload , createProfile);
ProfileRouter.route("/view-all").get(ViewAll);
ProfileRouter.route("/:userID/view-user-profile").get(viewUserProfile);
ProfileRouter.route("/:profileID/delete-one-profile").delete(deleteOne);
ProfileRouter.route("/:profileID/updateprofile").patch(updateProfile);
ProfileRouter.route("/:profileID/:userID/getuserprofile").get(getUserProfile);

export default ProfileRouter;
