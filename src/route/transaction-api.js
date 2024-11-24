import express from "express";
import transactionController from "../controller/transaction-controller.js";
import { authMiddleware } from "../middleware/auth-middleware.js";

const transactionRouter = new express.Router();
transactionRouter.use(authMiddleware);
transactionRouter.get("/balance", transactionController.balance);
transactionRouter.post("/topup", transactionController.topUp);
transactionRouter.post("/transaction", transactionController.purchase);
transactionRouter.get("/transaction/history", transactionController.purchaseHistory);

export { transactionRouter };
