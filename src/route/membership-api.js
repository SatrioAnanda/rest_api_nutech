import express from "express";
import membershipController from "../controller/membership-controller.js";
import { authMiddleware } from "../middleware/auth-middleware.js";
import { uploadFileMiddleware } from "../middleware/upload-file-middleware.js";

const membershipRouter = new express.Router();
membershipRouter.use(authMiddleware);
membershipRouter.get("/registration", membershipController.registerList);
membershipRouter.get("/profile", membershipController.profile);
membershipRouter.put("/profile/update", membershipController.update);
membershipRouter.put(
  "/profile/image",
  uploadFileMiddleware.single("file"),
  membershipController.uploadProfile
);

export { membershipRouter };
