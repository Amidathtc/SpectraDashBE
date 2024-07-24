import { Router } from "express";
import {
  payForOrder,
  verifyPaymentForOrder,
} from "../controller/paymentController";

const router: Router = Router();

router.route("/initialize").post(payForOrder);
router.route("/verify/:reference").get(verifyPaymentForOrder);

export default router;
