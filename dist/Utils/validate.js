"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MainAppError_1 = require("../Utils/MainAppError");
exports.default = (Schema) => {
    return (req, res, next) => {
        const { error } = Schema.validate(req.body);
        if (error) {
            return res.status(MainAppError_1.HTTPCODES.BAD_REQUEST).json({
                message: "Validation Error",
                data: error.message,
            });
        }
        else {
            next();
        }
    };
};
