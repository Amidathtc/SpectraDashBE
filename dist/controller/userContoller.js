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
exports.verifyUsers = exports.updateUser = exports.deleteUser = exports.getUser = exports.logoutUser = exports.loginUser = exports.createUser = exports.ViewAllUsers = void 0;
const AsyncHandler_1 = require("../MiddleWare/AsyncHandler");
const MainAppError_1 = require("../Utils/MainAppError");
const userModel_1 = __importDefault(require("../model/userModel"));
const express_validator_1 = require("express-validator");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const email_1 = require("../Utils/email");
const envV_1 = require("../config/envV");
const interface_1 = require("../interface/interface");
const express_session_1 = __importDefault(require("express-session"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
exports.ViewAllUsers = (0, AsyncHandler_1.AsyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const { name, email, password } = req.body;
        // Validate input
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res
                .status(MainAppError_1.HTTPCODES.BAD_REQUEST)
                .json({ errors: errors.array() });
        }
        // Check if admin already exists
        const existingUser = yield userModel_1.default.findOne({ email });
        if (existingUser) {
            return next(new MainAppError_1.MainAppError({
                message: "User already exists",
                httpcode: MainAppError_1.HTTPCODES.BAD_REQUEST,
            }));
        }
        const salt = yield bcryptjs_1.default.genSalt(10);
        // Hash the password
        const hashedPassword = yield bcryptjs_1.default.hash(password, salt);
        // const value = crypto.randomBytes(10).toString("hex");
        // const token = jwt.sign(value, "justRand" )
        // Create new user
        const User = yield userModel_1.default.create({
            name,
            email,
            password: hashedPassword,
            // token
        });
        // const tokenID = jwt.sign({id: User.id}, "justRand")
        yield (0, email_1.sendMail)(User);
        return res.status(MainAppError_1.HTTPCODES.OK).json({
            message: `${User === null || User === void 0 ? void 0 : User.name} ~ your account has being created successfully`,
            data: User,
        });
    }
    catch (error) {
        return res.status(MainAppError_1.HTTPCODES.OK).json({
            errorMessage: `${error.message}`,
            errorStack: error,
        });
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
        // Configure express-session middleware
        req.app.use((0, express_session_1.default)({
            /* Configure session options here */
            secret: envV_1.EnvironmentVariables.Session_Secret,
            resave: false,
            saveUninitialized: true,
            store: interface_1.sessionStore,
            cookie: {
                // maxAge: 1000 * 60 * 24 * 60,
                sameSite: "lax",
                secure: false,
            },
        }));
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
        console.error(error); // Log the actual error
        console.error(error.message); // Log the actual error
        return res
            .status(MainAppError_1.HTTPCODES.INTERNAL_SERVER_ERROR)
            .json({ message: "An error occurred" });
    }
}));
// export const loginUser = AsyncHandler(
//   async (req: any, res: Response, next: NextFunction) => {
//     try {
//       const errors = validationResult(req);
//       if (!errors.isEmpty()) {
//         return next(
//           new MainAppError({
//             message: "Invalid input data",
//             httpcode: HTTPCODES.BAD_REQUEST,
//           })
//         );
//       }
//       const { email, password } = req.body;
//       const getUser = await UserModels.findOne({
//         email,
//       }).select("+password");
//       if (!getUser) {
//         return next(
//           new MainAppError({
//             message: "User not found for the provided email address.",
//             httpcode: HTTPCODES.BAD_REQUEST,
//           })
//         );
//       }
//       const isPasswordValid = await bcrypt.compare(password, getUser.password);
//       if (!isPasswordValid) {
//         if (getUser.verified) {
//           const encrypt = jwt.sign(
//             { id: getUser._id },
//             process.env.JWT_SECRET!,
//             {
//               expiresIn: "1d",
//             }
//           );
//           req.session.isAuth = true;
//           req.session.userID = getUser._id;
//           return res.status(HTTPCODES.OK).json({
//             message: "welcome back",
//             data: encrypt,
//           });
//         } else {
//           return next(
//             new MainAppError({
//               message: "Account has not been verified yet.",
//               httpcode: HTTPCODES.BAD_REQUEST,
//             })
//           );
//         }
//       }
//       // Set session data here
//       req.session.user = getUser._id;
//       return res.status(HTTPCODES.OK).json({
//         message: "Login Successful",
//         data: getUser._id,
//       });
//     } catch (error) {
//       return res.status(HTTPCODES.BAD_REQUEST).json({
//         message: "An Error Occured in loginUser",
//         error: error,
//       });
//     }
//   }
// );
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
exports.deleteUser = (0, AsyncHandler_1.AsyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userID } = req.params;
        const user = yield userModel_1.default.findByIdAndDelete(userID);
        return res.status(MainAppError_1.HTTPCODES.OK).json({
            message: `${user === null || user === void 0 ? void 0 : user.name} account has being deleted`,
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
        const { name, password, email } = req.body;
        const getUser = yield userModel_1.default.findById(userID);
        yield userModel_1.default.findByIdAndUpdate(getUser === null || getUser === void 0 ? void 0 : getUser._id, {
            name,
            email,
            password,
        });
        return res.status(MainAppError_1.HTTPCODES.OK).json({
            message: "Udated",
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
