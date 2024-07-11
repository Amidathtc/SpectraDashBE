"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const orderController_1 = require("../controller/orderController");
const router = (0, express_1.Router)();
router.route("/:userID/:agentID/make-order").post(orderController_1.makeOrder);
exports.default = router;
