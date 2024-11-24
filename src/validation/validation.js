import { ResponseError } from "../error/response-error.js";

const validate = (schema, request) => {
  const result = schema.validate(request, {
    abortEarly: false,
    allowUnknown: false,
  });

  if (result.error) {
    console.log(result.error.message);
    throw new ResponseError(400, 102, result.error.message);
  } else {
    return result.value;
  }
};

export { validate };
