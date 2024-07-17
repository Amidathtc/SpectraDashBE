"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const profileSchema = new mongoose_1.Schema({
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
        type: mongoose_1.Types.ObjectId,
        ref: "users",
    },
}, { timestamps: true });
// Create a compound index on 'user'  field
profileSchema.index({ user: 1 });
// export default model<IUserProfileData>("profiles", profileModel);
const profileModel = (0, mongoose_1.model)("userprofiles", profileSchema);
exports.default = profileModel;
