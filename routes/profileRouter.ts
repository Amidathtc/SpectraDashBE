import { Router } from "express";
import {
  ViewAll,
  createProfile,
  deleteOne,
  getUserProfile,
  updateProfile,
  viewUserProfile,
} from "../controller/profileController";

const ProfileRouter = Router();

ProfileRouter.route("/create-profile").post(createProfile);
ProfileRouter.route("/view-all").get(ViewAll);
ProfileRouter.route("/:userid/view-user-profile").get(viewUserProfile);
ProfileRouter.route("/:profileid/delete-one-profile").delete(deleteOne);
ProfileRouter.route("/:profileid/updateprofile").patch(updateProfile);
ProfileRouter.route("/:profileid/userid/getuserprofile").get(getUserProfile);
