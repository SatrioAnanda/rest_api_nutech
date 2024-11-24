import express from "express";
import path from 'path';
import membershipController from "../controller/membership-controller.js";

const publicRouter = new express.Router();
publicRouter.post("/registration", membershipController.register);
publicRouter.post("/login", membershipController.login);
const imagePath = path.join(
  "C:",
  "Users",
  "Satrio Ananda S",
  "Downloads",
  "Test Kerja",
  "PT Nutech Integration",
  "Test Program",
  "Express_JS",
  "restful_api",
  "src",
  "images"
);
publicRouter.use("/images/", express.static(imagePath));

export { publicRouter };
