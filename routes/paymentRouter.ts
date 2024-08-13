import { Router } from "express";
import {
  getAllPayments,
  payForOrder,
  verifyPaymentForOrder,
} from "../controller/paymentController";

const router: Router = Router();

router.route("/initialize/:orderId").post(payForOrder);
router.route("/verify/:reference").get(verifyPaymentForOrder);
router.route("/payments").get(getAllPayments);

export default router;
