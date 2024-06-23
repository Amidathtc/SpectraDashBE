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
exports.verifyAgent = exports.updateAgent = exports.deleteAgent = exports.getAgent = exports.logoutAgent = exports.createAgent = exports.loginAgent = exports.ViewAllAgent = void 0;
const AsyncHandler_1 = require("../MiddleWare/AsyncHandler");
const MainAppError_1 = require("../Utils/MainAppError");
const AgentModel_1 = __importDefault(require("../model/AgentModel"));
const express_validator_1 = require("express-validator");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const email_1 = require("../Utils/email");
exports.ViewAllAgent = (0, AsyncHandler_1.AsyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const users = await clientModels.find().populate("ShipmentHistory");
        const agents = yield AgentModel_1.default.find();
        return res.status(MainAppError_1.HTTPCODES.OK).json({
            length: agents === null || agents === void 0 ? void 0 : agents.length,
            message: (agents === null || agents === void 0 ? void 0 : agents.length) === 0
                ? "No Available Agent yet"
                : "All Agents successfully gotten",
            data: agents,
        });
    }
    catch (error) {
        return res.status(MainAppError_1.HTTPCODES.BAD_REQUEST).json({
            message: "An Error Occured View All Users",
            error: error,
        });
    }
}));
exports.loginAgent = (0, AsyncHandler_1.AsyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return next(new MainAppError_1.MainAppError({
                message: 'Invalid input data',
                httpcode: MainAppError_1.HTTPCODES.BAD_REQUEST,
            }));
        }
        const { AgentEmail, password } = req.body;
        const getAgent = yield AgentModel_1.default.findOne({
            AgentEmail,
        }).select('+password');
        if (!getAgent) {
            return next(new MainAppError_1.MainAppError({
                message: 'Agent not found for the provided email address.',
                httpcode: MainAppError_1.HTTPCODES.BAD_REQUEST,
            }));
        }
        const isPasswordValid = yield bcryptjs_1.default.compare(password, getAgent.password);
        if (!isPasswordValid) {
            if (getAgent.verified) {
                const encrypt = jsonwebtoken_1.default.sign({ id: getAgent._id }, process.env.JWT_SECRET, {
                    expiresIn: '1d',
                });
                req.session.isAuth = true;
                req.session.userID = getAgent._id;
                return res.status(MainAppError_1.HTTPCODES.OK).json({
                    message: 'welcome back',
                    data: encrypt,
                });
            }
            else {
                return next(new MainAppError_1.MainAppError({
                    message: 'Account has not been verified yet.',
                    httpcode: MainAppError_1.HTTPCODES.BAD_REQUEST,
                }));
            }
        }
        // Set session data here
        req.session.user = getAgent._id;
        return res.status(MainAppError_1.HTTPCODES.OK).json({
            message: 'Login Successful',
            data: getAgent._id,
        });
    }
    catch (error) {
        return res.status(MainAppError_1.HTTPCODES.BAD_REQUEST).json({
            message: 'An Error Occured in loginAgent/',
            error: error,
        });
    }
}));
exports.createAgent = (0, AsyncHandler_1.AsyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { AgentEmail, password, AgentCompanyname } = req.body;
        // Validate input
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(MainAppError_1.HTTPCODES.BAD_REQUEST).json({ errors: errors.array() });
        }
        // Check if admin already exists
        const existingAgent = yield AgentModel_1.default.findOne({ AgentEmail });
        if (existingAgent) {
            return next(new MainAppError_1.MainAppError({
                message: 'Agent already exists',
                httpcode: MainAppError_1.HTTPCODES.BAD_REQUEST,
            }));
        }
        const salt = yield bcryptjs_1.default.genSalt(10);
        // Hash the password
        const hashedPassword = yield bcryptjs_1.default.hash(password, salt);
        // const value = crypto.randomBytes(10).toString("hex");
        // const token = jwt.sign(value, "justRand" )
        // Create new admin
        const Agent = yield AgentModel_1.default.create({
            AgentCompanyname,
            AgentEmail,
            password: hashedPassword,
            // token
        });
        // const tokenID = jwt.sign({id: User.id}, "justRand")
        (0, email_1.sendMail)(Agent);
        return res.status(MainAppError_1.HTTPCODES.OK).json({
            message: `${Agent === null || Agent === void 0 ? void 0 : Agent.AgentCompanyname} ~ your account has being created successfully`,
            data: Agent,
        });
    }
    catch (error) {
        return next(new MainAppError_1.MainAppError({
            message: 'An error occurred in while creating Agent',
            httpcode: MainAppError_1.HTTPCODES.INTERNAL_SERVER_ERROR,
        }));
    }
}));
exports.logoutAgent = (0, AsyncHandler_1.AsyncHandler)((req, res, next) => {
    try {
        req.session.destroy();
        res.status(MainAppError_1.HTTPCODES.OK).json({
            message: 'Logout Successful',
        });
    }
    catch (error) {
        return res.status(MainAppError_1.HTTPCODES.BAD_REQUEST).json({
            message: 'An Error Occured in logoutAgent',
            error: error,
        });
    }
});
exports.getAgent = (0, AsyncHandler_1.AsyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { AgentID } = req.params;
        const Agent = yield AgentModel_1.default.findById(AgentID);
        return res.status(MainAppError_1.HTTPCODES.OK).json({
            data: Agent,
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
exports.deleteAgent = (0, AsyncHandler_1.AsyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { AgentID } = req.params;
        const agent = yield AgentModel_1.default.findByIdAndDelete(AgentID);
        return res.status(MainAppError_1.HTTPCODES.OK).json({
            message: `${agent === null || agent === void 0 ? void 0 : agent.AgentCompanyname} account has being deleted`,
        });
    }
    catch (error) {
        if (error.path === "_id") {
            return res.status(MainAppError_1.HTTPCODES.NOT_FOUND).json({
                message: "An Error Occured in getAgent(id)",
            });
        }
        return res.status(MainAppError_1.HTTPCODES.INTERNAL_SERVER_ERROR).json({
            message: "An Error Occured in getAgent",
            error: error === null || error === void 0 ? void 0 : error.message,
        });
    }
}));
exports.updateAgent = (0, AsyncHandler_1.AsyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { AgentID } = req.params;
        const { AgentCompanyname, password, AgentEmail } = req.body;
        const getAgent = yield AgentModel_1.default.findById(AgentID);
        yield AgentModel_1.default.findByIdAndUpdate(getAgent === null || getAgent === void 0 ? void 0 : getAgent._id, {
            AgentCompanyname,
            AgentEmail,
            password,
        });
        return res.status(MainAppError_1.HTTPCODES.OK).json({
            message: "Udated",
        });
    }
    catch (error) {
        if (error.path === "_id") {
            return res.status(MainAppError_1.HTTPCODES.NOT_FOUND).json({
                message: "An Error Occured in getAgent(id)",
            });
        }
        return res.status(MainAppError_1.HTTPCODES.INTERNAL_SERVER_ERROR).json({
            message: "An Error Occured in upateAgent",
            error: error === null || error === void 0 ? void 0 : error.message,
        });
    }
}));
const verifyAgent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { AgentID } = req.params;
        yield AgentModel_1.default.findByIdAndUpdate(AgentID, {
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
exports.verifyAgent = verifyAgent;
