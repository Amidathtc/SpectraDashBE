"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRegistrationInput = exports.validateLoginInput = void 0;
const express_validator_1 = require("express-validator");
exports.validateLoginInput = [
    (0, express_validator_1.body)('username').notEmpty().withMessage('Username is required'),
    (0, express_validator_1.body)('password').notEmpty().withMessage('Password is required'),
    (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty())
            return res.status(400).json({ errors: errors.array() });
        next();
    }
];
exports.validateRegistrationInput = [
    (0, express_validator_1.body)('name').notEmpty().withMessage('Name is required'),
    (0, express_validator_1.body)('email').isEmail().withMessage('Invalid email address'),
    (0, express_validator_1.body)('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long'),
    (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty())
            return res.status(400).json({ errors: errors.array() });
        next();
    }
];
