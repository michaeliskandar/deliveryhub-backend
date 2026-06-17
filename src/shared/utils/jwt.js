// TODO: src/shared/utils/jwt.js — لسه فاضي، هنملاه مع بعض
import jwt from "jsonwebtoken";
import { config } from "../../config/env.js";

export const generateToken = (payload) => {
  return jwt.sign(payload, config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRES_IN || "7d",
  });
};

export const verifyToken = (token) => {
  return jwt.verify(token, config.JWT_SECRET);
};
