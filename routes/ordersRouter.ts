import { Router } from "express";
import {
  deleteOrder,
  deleteOrderE,
  getAllOrders,
  getOrder,
  getUserOrders,
  makeOrder,
  viewOrder,
  getUserCurrentOrder,
} from "../controller/orderController";

const router: Router = Router();

router.route("/:userID/:agentID/make-order").post(makeOrder);
router.route("/all-shipments").get(viewOrder);
router.route("/orders").get(getAllOrders);
router.route("/orders/:id").get(getOrder);
router.route("/order/:userID").get(getUserCurrentOrder);
router.route("/:userID/orders").get(getUserOrders);
router.route("/:userID/:agentID/:shipmentID/delete-order").delete(deleteOrderE);
router.route("/:userID/:shipmentID/delete-orders").delete(deleteOrder);

export default router;
