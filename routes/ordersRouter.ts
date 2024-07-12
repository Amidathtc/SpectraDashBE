import { Router } from "express";
import {
  deleteOrder,
  deleteOrderE,
  makeOrder,
  viewOrder,
} from "../controller/orderController";

const router: Router = Router();

router.route("/:userID/:agentID/make-order").post(makeOrder);
router.route("/all-shipments").get(viewOrder);
router.route("/:userID/:agentID/:shipmentID/delete-order").delete(deleteOrderE);
router.route("/:userID/:shipmentID/delete-orders").delete(deleteOrder);

export default router;
