import { Router } from "express";
import {
  getAllPayments,
  payForOrder,
  verifyPaymentForOrder,
} from "../controller/paymentController";

const router: Router = Router();

router.route("/initialize").post(payForOrder);
router.route("/payments").get(getAllPayments);
router.route("/verify/:reference").get(verifyPaymentForOrder);

export default router;
