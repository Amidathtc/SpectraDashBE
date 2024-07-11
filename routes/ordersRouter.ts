import { Router } from "express";
import { makeOrder } from "../controller/orderController";

const router: Router = Router();

router.route("/:userID/:agentID/make-order").post(makeOrder);

export default router;
