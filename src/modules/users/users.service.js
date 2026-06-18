import User from "../../database/models/User.model.js";
import ApiError from "../../shared/utils/ApiError.js";

const getProfile = async (userId) => {
    const user = await User.findById(userId);
    if (!user) throw new ApiError(404, "User not found");
    return user;
};

const updateProfile = async (userId, { name, phone, avatarUrl }) => {
    const user = await User.findById(userId);
    if (!user) throw new ApiError(404, "User not found");

    if (name !== undefined) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (avatarUrl !== undefined) user.avatarUrl = avatarUrl;

    await user.save();
    return user;
};

const registerPushToken = async (userId, token) => {
    await User.updateOne({ _id: userId }, { $addToSet: { pushTokens: token } });
};

const removePushToken = async (userId, token) => {
    await User.updateOne({ _id: userId }, { $pull: { pushTokens: token } });
};

/**
 * Shared helper — Tracking/Notifications/etc import this instead of
 * querying the User collection directly, so "what role does this user
 * have" stays in one place.
 */
const getUserRole = async (userId) => {
    const user = await User.findById(userId).select("role");
    if (!user) throw new ApiError(404, "User not found");
    return user.role;
};

export default {
    getProfile,
    updateProfile,
    registerPushToken,
    removePushToken,
    getUserRole,
};
