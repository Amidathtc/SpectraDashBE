"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserProfile = exports.updateProfile = exports.deleteOne = exports.ViewAll = exports.viewUserProfile = exports.createProfile = void 0;
// import { streamUpload } from "../Utils/streamUpload";
const userModel_1 = __importDefault(require("../model/userModel"));
const ProfileModel_1 = __importDefault(require("../model/ProfileModel"));
const MainAppError_1 = require("../Utils/MainAppError");
const AsyncHandler_1 = require("../MiddleWare/AsyncHandler");
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
const mongoose_1 = require("mongoose");
exports.createProfile = (0, AsyncHandler_1.AsyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userID } = req.params;
        // Validate required body fields (assuming validation is not already handled elsewhere)
        const { name, address, phoneNumber } = req.body;
        // if (!name || !address || !phoneNumber) {
        //   throw new MainAppError({
        //     message: "Missing required fields in request body",
        //     httpcode: HTTPCODES.BAD_REQUEST,
        //   });
        // }
        // Upload the profile image using streamUpload
        const { secure_url, public_id } = yield cloudinary_1.default.uploader.upload(req.file.path);
        // Find the user by ID
        const user = yield userModel_1.default.findById(userID);
        // Check if user exists and is verified
        if (!user || !user.verified) {
            throw new MainAppError_1.MainAppError({
                message: "User not found or account not verified",
                httpcode: MainAppError_1.HTTPCODES.BAD_REQUEST,
            });
        }
        // Create the profile
        const profiled = yield ProfileModel_1.default.create({
            name,
            address,
            phoneNumber,
            userID,
            profileAvatar: secure_url,
            profileAvatarID: public_id,
        });
        // Update user's profile reference (assuming a single profile per user)
        user.profile = profiled._id;
        yield (user === null || user === void 0 ? void 0 : user.save());
        res.status(MainAppError_1.HTTPCODES.OK).json({
            message: "Profile created successfully",
            data: profiled,
        });
    }
    catch (error) {
        // Handle errors more gracefully
        console.error("Error creating profile:", error);
        next(new MainAppError_1.MainAppError({
            message: "An error occurred while creating the profile",
            httpcode: MainAppError_1.HTTPCODES.INTERNAL_SERVER_ERROR,
            // errorDetails: error.message, // Consider including relevant error details for debugging
        }));
    }
}));
// export const createProfile = AsyncHandler(
//   async (req: Request, res: Response, next: NextFunction) => {
//     //order is going out soon
//     try {
//       const { userID } = req.params;
//       const { name, address, phoneNumber } = req.body;
//       const { secure_url, public_id }: any = await streamUpload(req);
//       console.log("img",secure_url)
//       console.log("img",public_id)
//       const user: any = await UserModel.findById(userID);
//       if (user?.verified) {
//         const profiled = await ProfileModel.create({
//           name,
//           address,
//           phoneNumber,
//           userID,
//           avatar: secure_url,
//           avatarID: public_id,
//         });
//         user?.profile.push(new mongoose.Types.ObjectId(user?._id!));
//         user?.save();
//         return res.status(HTTPCODES.OK).json({
//           message: "profile created",
//           data: profiled,
//         });
//       } else {
//         return next(
//           new MainAppError({
//             message: "Account has not been verified yet.",
//             httpcode: HTTPCODES.BAD_REQUEST,
//           })
//         );
//       }
//     } catch (error: any) {
//       return res.status(HTTPCODES.BAD_REQUEST).json({
//         errorMessage: `${error.message}`,
//         erroStack: error,
//         erroStacks: error.stack
//       });
//       // return next(
//       //   new MainAppError({
//       //     message: "An error occurred in while creating Profile ",
//       //     httpcode: HTTPCODES.INTERNAL_SERVER_ERROR,
//       //   })
//       // );
//     }
//   }
// );
exports.viewUserProfile = (0, AsyncHandler_1.AsyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userID } = req.params;
        // Define the populate path and optional options
        const populateOptions = {
            path: "profile", // Path to the related model (assuming 'profile')
            select: "-password", // Exclude password field from the populated data (optional)
        };
        const user = yield userModel_1.default.findById(userID).populate(populateOptions);
        if (user) {
            return res.status(MainAppError_1.HTTPCODES.OK).json({
                message: "User found",
                data: user === null || user === void 0 ? void 0 : user.profile,
            });
        }
        else {
            return next(new MainAppError_1.MainAppError({
                message: "user not found.",
                httpcode: MainAppError_1.HTTPCODES.BAD_REQUEST,
            }));
        }
    }
    catch (error) {
        return next(new MainAppError_1.MainAppError({
            message: "An error occurred while looking for user Profile ",
            httpcode: MainAppError_1.HTTPCODES.INTERNAL_SERVER_ERROR,
        }));
    }
}));
exports.ViewAll = (0, AsyncHandler_1.AsyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const profiled = yield ProfileModel_1.default.find();
        return res.status(MainAppError_1.HTTPCODES.OK).json({
            message: "User found",
            data: profiled,
        });
    }
    catch (error) {
        return next(new MainAppError_1.MainAppError({
            message: "users not found.",
            httpcode: MainAppError_1.HTTPCODES.BAD_REQUEST,
        }));
    }
}));
exports.deleteOne = (0, AsyncHandler_1.AsyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userID, profileID } = req.params;
        const user = yield userModel_1.default.findById(userID);
        if (user) {
            const profiled = yield ProfileModel_1.default.findByIdAndDelete(profileID);
            yield (user === null || user === void 0 ? void 0 : user.profile.pull(new mongoose_1.Types.ObjectId(profiled === null || profiled === void 0 ? void 0 : profiled._id)));
            yield (user === null || user === void 0 ? void 0 : user.save());
            return res.status(MainAppError_1.HTTPCODES.OK).json({
                message: "Profile deleted",
            });
        }
        else {
            return res.status(MainAppError_1.HTTPCODES.OK).json({
                message: "Profile deleted",
            });
        }
    }
    catch (error) {
        return next(new MainAppError_1.MainAppError({
            message: "Profile not deleted.",
            httpcode: MainAppError_1.HTTPCODES.BAD_REQUEST,
        }));
    }
}));
exports.updateProfile = (0, AsyncHandler_1.AsyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { profileID } = req.params;
        const { phoneNumber, address } = req.body;
        const profiled = yield ProfileModel_1.default.findByIdAndUpdate(profileID, { phoneNumber, address }, { new: true });
        return res.status(MainAppError_1.HTTPCODES.OK).json({
            message: "Profile Updated",
            data: profiled,
        });
    }
    catch (error) {
        return next(new MainAppError_1.MainAppError({
            message: "Profile not upated.",
            httpcode: MainAppError_1.HTTPCODES.BAD_REQUEST,
        }));
    }
}));
exports.getUserProfile = (0, AsyncHandler_1.AsyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { profileID, userID } = req.params;
        const user = yield userModel_1.default.findById(userID);
        const profile = yield ProfileModel_1.default.findById(profileID);
        if ((user === null || user === void 0 ? void 0 : user._id) === (profile === null || profile === void 0 ? void 0 : profile.userID)) {
            const profiled = yield ProfileModel_1.default.find();
            return res.status(MainAppError_1.HTTPCODES.OK).json({
                message: "Profile Found",
                data: profiled,
            });
        }
        else {
            return next(new MainAppError_1.MainAppError({
                message: "User profile not found.",
                httpcode: MainAppError_1.HTTPCODES.BAD_REQUEST,
            }));
        }
    }
    catch (error) {
        return next(new MainAppError_1.MainAppError({
            message: "Profile not found.",
            httpcode: MainAppError_1.HTTPCODES.BAD_REQUEST,
        }));
    }
}));
