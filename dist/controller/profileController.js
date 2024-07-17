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
exports.getUserProfile = exports.deleteOne = exports.updateProfileAvatar = exports.updateProfile = exports.ViewAllProfiles = exports.viewUserProfile = void 0;
const userModel_1 = __importDefault(require("../model/userModel"));
const ProfileModel_1 = __importDefault(require("../model/ProfileModel"));
const MainAppError_1 = require("../Utils/MainAppError");
const AsyncHandler_1 = require("../MiddleWare/AsyncHandler");
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
const mongoose_1 = require("mongoose");
exports.viewUserProfile = (0, AsyncHandler_1.AsyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userID } = req.params;
        // Find the matching profile based on userID using the index
        const userProfile = yield ProfileModel_1.default.findOne({ user: userID });
        if (!userProfile) {
            return next(new MainAppError_1.MainAppError({
                message: "User profile not found",
                httpcode: MainAppError_1.HTTPCODES.NOT_FOUND,
            }));
        }
        return res.status(MainAppError_1.HTTPCODES.OK).json({
            message: "User profile",
            data: userProfile,
        });
    }
    catch (error) {
        console.error(error);
        return next(new MainAppError_1.MainAppError({
            message: "An error occurred while looking for user profile",
            httpcode: MainAppError_1.HTTPCODES.INTERNAL_SERVER_ERROR,
        }));
    }
}));
exports.ViewAllProfiles = (0, AsyncHandler_1.AsyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const profiled = yield ProfileModel_1.default.find();
        return res.status(MainAppError_1.HTTPCODES.OK).json({
            message: "All User Profiles",
            data: profiled,
        });
    }
    catch (error) {
        console.log(error);
        console.log(error.message);
        return next(new MainAppError_1.MainAppError({
            message: "All User Profiles not found.",
            httpcode: MainAppError_1.HTTPCODES.BAD_REQUEST,
        }));
    }
}));
exports.updateProfile = (0, AsyncHandler_1.AsyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { profileID } = req.params;
        const { password } = req.body;
        const profiled = yield ProfileModel_1.default.findByIdAndUpdate(profileID, { password }, { new: true });
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
exports.updateProfileAvatar = (0, AsyncHandler_1.AsyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userID, profileID } = req.params;
        // if (!name || !address || !phoneNumber) {
        //   throw new MainAppError({
        //     message: "Missing required fields in request body",
        //     httpcode: HTTPCODES.BAD_REQUEST,
        //   });
        // }
        // Upload the profile image using streamUpload
        const { secure_url } = yield cloudinary_1.default.uploader.upload(req.file.path);
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
        const profiled = yield ProfileModel_1.default.findByIdAndUpdate(profileID, {
            avatar: secure_url,
        }, { new: true });
        // Update user's profile reference (assuming a single profile per user)
        user.profile = profiled._id;
        yield (user === null || user === void 0 ? void 0 : user.save());
        res.status(MainAppError_1.HTTPCODES.OK).json({
            message: "Profile Updated successfully",
            data: profiled,
        });
    }
    catch (error) {
        // Handle errors more gracefully
        console.error("Error updating profile:", error);
        next(new MainAppError_1.MainAppError({
            message: "An error occurred while creating the profile",
            httpcode: MainAppError_1.HTTPCODES.INTERNAL_SERVER_ERROR,
            // errorDetails: error.message, // Consider including relevant error details for debugging
        }));
    }
}));
exports.deleteOne = (0, AsyncHandler_1.AsyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userID, profileID } = req.params;
        const user = yield userModel_1.default.findById(userID);
        if (user) {
            const profiled = yield ProfileModel_1.default.findByIdAndDelete(profileID);
            yield (user === null || user === void 0 ? void 0 : user.profile.pull(new mongoose_1.Types.ObjectId(profiled)));
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
