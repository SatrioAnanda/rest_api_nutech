import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const hashPassword = async (password) => {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
};

const comparePassword = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};

const generateToken = (user) => {
  return jwt.sign({ email: user.email }, process.env.JWT_SECRET, {
    expiresIn: "12h",
  });
};

const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

const getBaseURL = () => {
  return process.env.BASE_URL || "http://localhost:3002"; 
};

export {
  hashPassword,
  comparePassword,
  generateToken,
  verifyToken,
  getBaseURL,
};
