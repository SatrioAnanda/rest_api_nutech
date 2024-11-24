import jwt from "jsonwebtoken";

const authMiddleware = (request, response, next) => {
  const token = request.get("Authorization") || request.get("authorization");
  if (!token) {
    response
      .status(401)
      .json({
        status: 108,
        message: "Token tidak tidak valid atau kadaluwarsa 1",
        data: null,
      })
      .end();
  }

  try {
    const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);

    request.user = decoded;
    next();
  } catch (err) {
    response
      .status(401)
      .json({
        status: 108,
        message: "Token tidak tidak valid atau kadaluwarsa 2",
        data: null,
      })
      .end();
  }
};

export { authMiddleware };
