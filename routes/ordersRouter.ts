import { Router } from "express";
import {
  deleteOrder,
  deleteOrderE,
  getAllOrders,
  getOrderInfo,
  getUserOrders,
  makeOrder,
  viewOrder,
  getUserCurrentOrder,
} from "../controller/orderController";

const router: Router = Router();

router.route("/:userID/:agentID/make-order").post(makeOrder);
router.route("/all-orders").get(viewOrder);
router.route("/orders").get(getAllOrders);
router.route("/order-info/:orderID").get(getOrderInfo);
router.route("/user-orders/:userID").get(getUserOrders);
router.route("/user-current-order/:userID").get(getUserCurrentOrder);
router.route("/:userID/:agentID/:shipmentID/delete-order").delete(deleteOrderE);
router.route("/:userID/:shipmentID/delete-orders").delete(deleteOrder);

export default router;
