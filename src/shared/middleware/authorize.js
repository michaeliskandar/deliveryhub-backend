import ApiError from "../utils/ApiError.js";

export const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return next(new ApiError(401, "Not authenticated"));
        }
        if (!allowedRoles.includes(req.user.role)) {
            return next(new ApiError(403, "You do not have permission to perform this action"));
        }
        return next();
    };
};
