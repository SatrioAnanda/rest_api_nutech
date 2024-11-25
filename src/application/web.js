import express from "express";
import { publicRouter } from "../route/public-api.js";
import { errorMiddleware } from "../middleware/error-middleware.js";
import { membershipRouter } from "../route/membership-api.js";
import { bannerRouter } from "../route/banner-api.js";
import { serviceRouter } from "../route/service-api.js";
import { transactionRouter } from "../route/transaction-api.js";
import cors from "cors";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

export const web = express();

web.use(express.json());
web.use(cors());

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Documentation",
      version: "1.0.0",
      description: "API documentation for the Express application",
    },
    servers: [
      {
        url: "https://restapinutech-production-7444.up.railway.app",
      },
      {
        url: "http://localhost:3001",
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: [
    "./src/service/membership-service.js",
    "./src/service/banner-service.js",
    "./src/service/service-service.js",
    "./src/service/transaction-service.js",
  ],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

web.get("/", (req, res) => {
  res.redirect("/api-docs");
});

web.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

web.use(publicRouter);
web.use(membershipRouter);
web.use(bannerRouter);
web.use(serviceRouter);
web.use(transactionRouter);
web.use(errorMiddleware);
