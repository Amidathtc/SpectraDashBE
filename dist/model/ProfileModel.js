"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const profileSchema = new mongoose_1.Schema({
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
}, { timestamps: true });
// export default model<IUserProfileData>("profiles", profileModel);
const profileModel = (0, mongoose_1.model)("userprofiles", profileSchema);
exports.default = profileModel;
