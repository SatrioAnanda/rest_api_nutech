import express from "express";
import bannerController from "../controller/banner-controller.js";
import { authMiddleware } from "../middleware/auth-middleware.js";

const bannerRouter = new express.Router();
bannerRouter.use(authMiddleware);
bannerRouter.get("/banner", bannerController.bannerList);

export { bannerRouter };
