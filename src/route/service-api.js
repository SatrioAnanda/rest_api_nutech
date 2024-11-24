import express from "express";
import serviceController from "../controller/service-controller.js";
import { authMiddleware } from "../middleware/auth-middleware.js";

const serviceRouter = new express.Router();
serviceRouter.use(authMiddleware);
serviceRouter.get("/services", serviceController.serviceList);

export { serviceRouter };
