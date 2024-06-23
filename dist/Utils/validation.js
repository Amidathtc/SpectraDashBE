"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validActionPass = exports.validActionReset = exports.validActionSign = exports.validActionRegister = void 0;
const joi_1 = __importDefault(require("joi"));
let regex = /^(?!.*\s).{6,20}$/;
exports.validActionRegister = joi_1.default.object({
    email: joi_1.default.string().email().trim().lowercase().required(),
    password: joi_1.default.string().pattern(new RegExp(regex)).required(),
    confirm: joi_1.default.ref("password")
});
exports.validActionSign = joi_1.default.object({
    email: joi_1.default.string().email().trim().lowercase().required(),
    password: joi_1.default.string().pattern(new RegExp(regex)).required(),
});
exports.validActionReset = joi_1.default.object({
    email: joi_1.default.string().email().trim().lowercase().required(),
});
exports.validActionPass = joi_1.default.object({
    password: joi_1.default.string().pattern(new RegExp(regex)).required(),
});
