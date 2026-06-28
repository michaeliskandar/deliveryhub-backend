import clientProfileService from "./client-profile.service.js";
import ApiResponse from "../../shared/utils/ApiResponse.js";

export const uploadProfilePicture = async (req, res, next) => {
  try {
    const user = await clientProfileService.uploadProfilePicture(req.user._id, req.file);
    return res.status(200).json(ApiResponse.success(user, "Profile picture updated successfully"));
  } catch (err) {
    next(err);
  }
};

export const removeProfilePicture = async (req, res, next) => {
  try {
    const user = await clientProfileService.removeProfilePicture(req.user._id);
    return res.status(200).json(ApiResponse.success(user, "Profile picture removed successfully"));
  } catch (err) {
    next(err);
  }
};
