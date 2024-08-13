"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const paymentController_1 = require("../controller/paymentController");
const router = (0, express_1.Router)();
router.route("/initialize/:orderId").post(paymentController_1.payForOrder);
router.route("/verify/:reference").get(paymentController_1.verifyPaymentForOrder);
router.route("/payments").get(paymentController_1.getAllPayments);
exports.default = router;
