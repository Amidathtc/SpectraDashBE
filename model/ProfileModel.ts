import { model, Schema } from "mongoose";
import { IUserProfileData } from "../interface/interface";

const profileModel = new Schema<IUserProfileData>(
  {
    password: {
      type: String,
      required: [true, "Your password is required"],
    },
    firstName: {
      type: String,
      required: [true, "Your First Name is required"],
    },
    lastName: {
      type: String,
      required: [true, "Your Last Name is required"],
    },
    profileAvatar: {
      type: String,
    },
    userID: {
      type: String,
    },
    // user: {
    //   type: Types.ObjectId,
    //   ref: "users",
    // },
  },
  { timestamps: true }
);

// export default model<IUserProfileData>("profiles", profileModel);
export default model<IUserProfileData>("userprofiles", profileModel);
