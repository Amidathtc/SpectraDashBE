"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.verifyUsers = exports.updateUser = exports.deleteAUser = exports.deleteUser = exports.getUser = exports.logoutUser = exports.lginUser = exports.loginUser = exports.createUser = exports.viewAllUsers = void 0;
const express_1 = __importDefault(require("express"));
const AsyncHandler_1 = require("../MiddleWare/AsyncHandler");
const MainAppError_1 = require("../Utils/MainAppError");
const userModel_1 = __importStar(require("../model/userModel"));
const express_validator_1 = require("express-validator");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const email_1 = require("../Utils/email");
const envV_1 = require("../config/envV");
const interface_1 = require("../interface/interface");
const express_session_1 = __importDefault(require("express-session"));
const dotenv_1 = require("dotenv");
const mongoose_1 = require("mongoose");
const ProfileModel_1 = __importDefault(require("../model/ProfileModel"));
(0, dotenv_1.config)();
const app = (0, express_1.default)();
// Configure session middleware globally
app.use((0, express_session_1.default)({
    secret: envV_1.EnvironmentVariables.Session_Secret,
    resave: false,
    saveUninitialized: true,
    store: interface_1.sessionStore,
    cookie: {
        // Configure maxAge (in milliseconds) for session expiration (optional)
        maxAge: 1000 * 60 * 60 * 24, // One day
        sameSite: "lax",
        secure: false,
    },
}));
exports.viewAllUsers = (0, AsyncHandler_1.AsyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const users = await clientModels.find().populate("ShipmentHistory");
        const users = yield userModel_1.default.find();
        return res.status(MainAppError_1.HTTPCODES.OK).json({
            length: users === null || users === void 0 ? void 0 : users.length,
            message: (users === null || users === void 0 ? void 0 : users.length) === 0
                ? "No Available Users yet"
                : "All Users successfully gotten",
            data: users,
        });
    }
    catch (error) {
        return res.status(MainAppError_1.HTTPCODES.BAD_REQUEST).json({
            message: "An Error Occured View All Users",
            error: error,
        });
    }
}));
exports.createUser = (0, AsyncHandler_1.AsyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firstName, lastName, email, password } = req.body; // Validate input
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res
                .status(MainAppError_1.HTTPCODES.BAD_REQUEST)
                .json({ errors: errors.array() });
        }
        const existingUser = yield userModel_1.default.findOne({ email });
        if (existingUser) {
            return next(new MainAppError_1.MainAppError({
                message: "User already exists",
                httpcode: MainAppError_1.HTTPCODES.BAD_REQUEST,
            }));
        }
        let tfirstName = firstName.trim();
        let tlastName = lastName.trim();
        let temail = email.trim();
        let tpassword = password.trim();
        const salt = yield bcryptjs_1.default.genSalt(10); // Hash the password
        const hashedPassword = yield bcryptjs_1.default.hash(tpassword, salt);
        const initialAvatar = firstName.charAt() + lastName.charAt(); // Create new user avatar initials
        const user = yield userModel_1.default.create({
            firstName: tfirstName,
            lastName: tlastName,
            email: temail,
            password: hashedPassword,
            avatar: initialAvatar,
        });
        const profile = yield ProfileModel_1.default.create({
            firstName: user === null || user === void 0 ? void 0 : user.firstName,
            lastName: user === null || user === void 0 ? void 0 : user.lastName,
            profileAvatar: user === null || user === void 0 ? void 0 : user.avatar,
            user: user === null || user === void 0 ? void 0 : user._id,
        });
        yield user.profile.push(new mongoose_1.Types.ObjectId(user === null || user === void 0 ? void 0 : user._id));
        yield (user === null || user === void 0 ? void 0 : user.save());
        yield (profile === null || profile === void 0 ? void 0 : profile.save());
        yield (0, email_1.sendMail)(user);
        return res.status(MainAppError_1.HTTPCODES.OK).json({
            message: `${user === null || user === void 0 ? void 0 : user.firstName} ~ your account has being created successfully`,
            data: user,
            edata: profile,
        });
    }
    catch (error) {
        console.log(error);
        console.log(error.message);
        return next(new MainAppError_1.MainAppError({
            message: "An error occurred in while creating user",
            httpcode: MainAppError_1.HTTPCODES.INTERNAL_SERVER_ERROR,
        }));
    }
}));
exports.loginUser = (0, AsyncHandler_1.AsyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return next(new MainAppError_1.MainAppError({
                message: "Invalid input data",
                httpcode: MainAppError_1.HTTPCODES.BAD_REQUEST,
            }));
        }
        const { email, password } = req.body;
        const user = yield userModel_1.default.findOne({ email }).select("+password");
        if (!user) {
            return next(new MainAppError_1.MainAppError({
                message: "User not found",
                httpcode: MainAppError_1.HTTPCODES.BAD_REQUEST,
            }));
        }
        const isPasswordValid = yield bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            if (!user.verified) {
                return next(new MainAppError_1.MainAppError({
                    message: "Account not verified",
                    httpcode: MainAppError_1.HTTPCODES.UNAUTHORIZED,
                }));
            }
            else {
                return next(new MainAppError_1.MainAppError({
                    message: "Invalid credentials",
                    httpcode: MainAppError_1.HTTPCODES.UNAUTHORIZED,
                }));
            }
        }
        req.session.userId = user._id; // Store only user ID in session
        const token = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "1d",
        });
        return res.status(MainAppError_1.HTTPCODES.OK).json({
            message: "Login successful",
            data: { token }, // Return only the JWT token
        });
    }
    catch (error) {
        console.error("Error during login:", error); // Log the actual error
        return res
            .status(MainAppError_1.HTTPCODES.INTERNAL_SERVER_ERROR)
            .json({ message: "An error occurred" });
    }
}));
exports.lginUser = (0, AsyncHandler_1.AsyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Validate input data
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return next(new MainAppError_1.MainAppError({
                message: "Invalid input data",
                httpcode: MainAppError_1.HTTPCODES.BAD_REQUEST,
            }));
        }
        const { email, password } = req.body;
        // Find user with email and include password field for comparison
        const user = yield userModel_1.default.findOne({ email }).select("+password");
        if (!user) {
            return next(new MainAppError_1.MainAppError({
                message: "User not found",
                httpcode: MainAppError_1.HTTPCODES.BAD_REQUEST,
            }));
        }
        // Compare password hashes securely using bcrypt
        const isPasswordValid = yield bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            if (!user.verified) {
                return next(new MainAppError_1.MainAppError({
                    message: "Account not verified",
                    httpcode: MainAppError_1.HTTPCODES.UNAUTHORIZED,
                }));
            }
            else {
                return next(new MainAppError_1.MainAppError({
                    message: "Invalid credentials",
                    httpcode: MainAppError_1.HTTPCODES.UNAUTHORIZED,
                }));
            }
        }
        // Configure session (replace with your actual session store configuration)
        const session = req.app.locals.session; // Assuming session middleware is configured elsewhere
        if (!session) {
            throw new Error("Session middleware not configured!"); // Handle missing session middleware
        }
        req.session.userId = user._id; // Store only user ID in session for security
        // Generate JWT token with appropriate expiration time
        const token = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "1d",
        });
        return res.status(MainAppError_1.HTTPCODES.OK).json({
            message: "Login successful",
            data: { token }, // Return only the JWT token
        });
    }
    catch (error) {
        console.error(error); // Log the actual error
        return res
            .status(MainAppError_1.HTTPCODES.INTERNAL_SERVER_ERROR)
            .json({ message: "An error occurred" });
    }
}));
exports.logoutUser = (0, AsyncHandler_1.AsyncHandler)((req, res, next) => {
    try {
        req.session.destroy();
        res.status(MainAppError_1.HTTPCODES.OK).json({
            message: "Logout Successful",
        });
    }
    catch (error) {
        return res.status(MainAppError_1.HTTPCODES.BAD_REQUEST).json({
            message: "An Error Occured in logoutUser",
            error: error,
        });
    }
});
exports.getUser = (0, AsyncHandler_1.AsyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userID } = req.params;
        const user = yield userModel_1.default.findById(userID);
        return res.status(MainAppError_1.HTTPCODES.OK).json({
            data: user,
        });
    }
    catch (error) {
        if (error.path === "_id") {
            return res.status(MainAppError_1.HTTPCODES.NOT_FOUND).json({
                message: "An Error Occured in getAdmin(id)",
            });
        }
        return res.status(MainAppError_1.HTTPCODES.INTERNAL_SERVER_ERROR).json({
            message: "An Error Occured in getAdmin",
            error: error === null || error === void 0 ? void 0 : error.message,
        });
    }
}));
// User Schema (assuming 'UserSchema' is already defined)
userModel_1.UserSchema.pre("deleteOne", { document: true }, function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = this; // refers to the user document being deleted
        try {
            yield ProfileModel_1.default.findByIdAndDelete(user._id); // Delete associated profile
            next();
        }
        catch (error) {
            console.error("Error deleting associated profile:", error);
            next(error); // Pass the error to the main error handler
        }
    });
});
exports.deleteUser = (0, AsyncHandler_1.AsyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userID } = req.params;
        console.log("Deleting user with ID:", userID);
        // Delete user (cascading delete will handle profile)
        const user = yield userModel_1.default.findByIdAndDelete(userID);
        if (!user) {
            return next(new MainAppError_1.MainAppError({
                message: "User not found",
                httpcode: MainAppError_1.HTTPCODES.NOT_FOUND,
            }));
        }
        return res.status(MainAppError_1.HTTPCODES.OK).json({
            message: `${user.firstName} account has been deleted`,
        });
    }
    catch (error) {
        console.error(error);
        return next(new MainAppError_1.MainAppError({
            message: "An error occurred while deleting user",
            httpcode: MainAppError_1.HTTPCODES.INTERNAL_SERVER_ERROR,
        }));
    }
}));
exports.deleteAUser = (0, AsyncHandler_1.AsyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userID } = req.params;
        const user = yield userModel_1.default.findByIdAndDelete(userID);
        //     const userProfile: any = await ProfileModel.findByIdAndDelete();
        //     await user.profile.pull(new Types.ObjectId(userID));
        //     await User.save();
        //     await userProfile.save();
        return res.status(MainAppError_1.HTTPCODES.OK).json({
            message: `${user === null || user === void 0 ? void 0 : user.firstName} account has being deleted`,
        });
    }
    catch (error) {
        if (error.path === "_id") {
            return res.status(MainAppError_1.HTTPCODES.NOT_FOUND).json({
                message: "An Error Occured in getAdmin(id)",
            });
        }
        return res.status(MainAppError_1.HTTPCODES.INTERNAL_SERVER_ERROR).json({
            message: "An Error Occured in getAdmin",
            error: error === null || error === void 0 ? void 0 : error.message,
        });
    }
}));
exports.updateUser = (0, AsyncHandler_1.AsyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userID } = req.params;
        const { firstName, lastName, password, email } = req.body;
        const getUser = yield userModel_1.default.findById(userID);
        const updates = yield userModel_1.default.findByIdAndUpdate(getUser === null || getUser === void 0 ? void 0 : getUser._id, {
            firstName,
            lastName,
            email,
            password,
        }, { new: true });
        return res.status(MainAppError_1.HTTPCODES.OK).json({
            message: "Updated",
            data: updates,
        });
    }
    catch (error) {
        if (error.path === "_id") {
            return res.status(MainAppError_1.HTTPCODES.NOT_FOUND).json({
                message: "An Error Occured in getAdmin(id)",
            });
        }
        return res.status(MainAppError_1.HTTPCODES.INTERNAL_SERVER_ERROR).json({
            message: "An Error Occured in upateAdmin",
            error: error === null || error === void 0 ? void 0 : error.message,
        });
    }
}));
const verifyUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userID } = req.params;
        yield userModel_1.default.findByIdAndUpdate(userID, {
            verified: true,
        }, { new: true });
        return res.status(MainAppError_1.HTTPCODES.OK).json({
            message: "user has been verified",
            status: 201,
        });
    }
    catch (error) {
        return res.status(MainAppError_1.HTTPCODES.NOT_FOUND).json({
            message: "Error",
            status: 404,
        });
    }
});
exports.verifyUsers = verifyUsers;
