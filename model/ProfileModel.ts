import { Types, model, Schema } from "mongoose";
import { IUserProfileData } from "../interface/interface";

const profileSchema = new Schema<IUserProfileData>(
  {
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
    // userID: {
    //   type: String,
    // },
    user: {
      type: Types.ObjectId,
      ref: "users",
    },
  },
  { timestamps: true }
);
// Create a compound index on 'user'  field
profileSchema.index({ user: 1 });

// export default model<IUserProfileData>("profiles", profileModel);
const profileModel = model<IUserProfileData>("userprofiles", profileSchema);

export default profileModel;
