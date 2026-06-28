import Driver from "../../database/models/Driver.js";
import cloudinaryService from "../../shared/services/cloudinary.service.js";
import { CLOUDINARY_FOLDERS } from "../../shared/constants/cloudinaryFolders.js";
import ApiError from "../../shared/utils/ApiError.js";

const FOLDER = CLOUDINARY_FOLDERS.CAPTAIN_PROFILE;

// Resolve the Driver document owned by the currently authenticated captain user.
const resolveDriver = async (userId) => {
  const driver = await Driver.findOne({ user: userId });
  if (!driver) throw ApiError.notFound("Captain profile not found");
  return driver;
};

const uploadProfilePicture = async (userId, file) => {
  if (!file) throw ApiError.badRequest("Please attach an image file under the 'image' field");

  const driver = await resolveDriver(userId);
  const previousPublicId = driver.profileImagePublicId;

  const uploaded = await cloudinaryService.uploadSingle(file, FOLDER);

  let updatedDriver;
  try {
    driver.profileImage = uploaded.url;
    driver.profileImagePublicId = uploaded.publicId;
    updatedDriver = await driver.save();
  } catch (err) {
    await cloudinaryService.deleteImage(uploaded.publicId);
    throw err;
  }

  if (previousPublicId) {
    await cloudinaryService.deleteImage(previousPublicId);
  }

  return updatedDriver;
};

const removeProfilePicture = async (userId) => {
  const driver = await resolveDriver(userId);
  if (!driver.profileImage) return driver;

  const previousPublicId = driver.profileImagePublicId;
  driver.profileImage = null;
  driver.profileImagePublicId = null;
  await driver.save();

  if (previousPublicId) {
    await cloudinaryService.deleteImage(previousPublicId);
  }

  return driver;
};

export default { uploadProfilePicture, removeProfilePicture };
