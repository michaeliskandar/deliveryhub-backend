import captainProfileService from "./captain-profile.service.js";
import ApiResponse from "../../shared/utils/ApiResponse.js";

export const uploadProfilePicture = async (req, res, next) => {
  try {
    const driver = await captainProfileService.uploadProfilePicture(req.user._id, req.file);
    return res.status(200).json(ApiResponse.success(driver, "Profile picture updated successfully"));
  } catch (err) {
    next(err);
  }
};

export const removeProfilePicture = async (req, res, next) => {
  try {
    const driver = await captainProfileService.removeProfilePicture(req.user._id);
    return res.status(200).json(ApiResponse.success(driver, "Profile picture removed successfully"));
  } catch (err) {
    next(err);
  }
};
