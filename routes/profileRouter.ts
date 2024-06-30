// import upload from "../Utils/multer";
import { Router } from "express";
import {
  ViewAllProfiles,
  deleteOne,
  getUserProfile,
  updateProfile,
  updateProfileAvatar,
  viewUserProfile,
} from "../controller/profileController";
import { upload } from "../Utils/multer";

// const myUpload = multer().single("avatar");
const ProfileRouter = Router();

ProfileRouter.route("/:userID/:profileID/update-profile-avatar").patch(
  upload,
  updateProfileAvatar
);
ProfileRouter.route("/view-all-profiles").get(ViewAllProfiles);
ProfileRouter.route("/:userID/view-user-profile").get(viewUserProfile);
ProfileRouter.route("/:userID/:profileID/delete-one-profile").delete(deleteOne);
ProfileRouter.route("/:profileID/updateprofile").patch(updateProfile);
ProfileRouter.route("/:profileID/:userID/getuserprofile").get(getUserProfile);

export default ProfileRouter;
