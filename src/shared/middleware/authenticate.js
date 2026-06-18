import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";
import { ENV } from "../../config/env.js";
import User from "../../database/models/User.model.js";

export const authenticate = async (req, res, next) => {
    try {
        const header = req.headers.authorization;

        if (!header || !header.startsWith("Bearer ")) {
            throw new ApiError(401, "No token provided");
        }

        const token = header.split(" ")[1];

        let decoded;
        try {
            decoded = jwt.verify(token, ENV.JWT_SECRET);
        } catch {
            throw new ApiError(401, "Invalid or expired token");
        }

        // decoded is expected to carry { id } at minimum (set at login time)
        const user = await User.findById(decoded.id).select("-passwordHash");
        if (!user) {
            throw new ApiError(401, "User no longer exists");
        }

        req.user = user;
        return next();
    } catch (err) {
        return next(err);
    }
};
