import { ResponseError } from "../error/response-error.js";

const errorMiddleware = (error, request, response, next) => {
  if (!error) {
    next();
    return;
  }

  if (error instanceof ResponseError) {
    response
      .status(error.statusCode)
      .json({
        status: error.status,
        message: error.message,
        data: null,
      })
      .end();
  } else {
    response
      .status(500)
      .json({
        status: 500,
        message: error.message,
        data: null,
      })
      .end();
  }
};

export { errorMiddleware };
