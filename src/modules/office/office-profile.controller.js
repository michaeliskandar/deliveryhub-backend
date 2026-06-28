import officeProfileService from "./office-profile.service.js";
import ApiResponse from "../../shared/utils/ApiResponse.js";

export const uploadProfilePicture = async (req, res, next) => {
  try {
    const office = await officeProfileService.uploadProfilePicture(req.user._id, req.file);
    return res.status(200).json(ApiResponse.success(office, "Office logo updated successfully"));
  } catch (err) {
    next(err);
  }
};

export const removeProfilePicture = async (req, res, next) => {
  try {
    const office = await officeProfileService.removeProfilePicture(req.user._id);
    return res.status(200).json(ApiResponse.success(office, "Office logo removed successfully"));
  } catch (err) {
    next(err);
  }
};
