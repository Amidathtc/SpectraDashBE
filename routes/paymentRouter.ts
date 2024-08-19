import { Router } from "express";
import {
  getAllPayments,
  payForOrder,
  verifyPaymentForOrder,
} from "../controller/paymentController";

const router: Router = Router();

router.route("/initialize/:orderId").post(payForOrder);
router.route("/payments").get(getAllPayments);
router.route("/verify/:reference").get(verifyPaymentForOrder);

export default router;
