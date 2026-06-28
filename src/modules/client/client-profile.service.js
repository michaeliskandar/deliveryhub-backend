import User from "../../database/models/User.model.js";
import cloudinaryService from "../../shared/services/cloudinary.service.js";
import { CLOUDINARY_FOLDERS } from "../../shared/constants/cloudinaryFolders.js";
import ApiError from "../../shared/utils/ApiError.js";

/**
 * Client (customer) profile picture lives on the User model itself —
 * a Client has no separate schema, the User document IS the client record.
 */

const uploadProfilePicture = async (userId, file) => {
  if (!file) throw ApiError.badRequest("Please attach an image file under the 'image' field");

  const user = await User.findById(userId);
  if (!user) throw ApiError.notFound("Client account not found");

  const previousPublicId = user.profileImagePublicId;

  // 1. Upload the new image first.
  const uploaded = await cloudinaryService.uploadSingle(file, CLOUDINARY_FOLDERS.CLIENT_PROFILE);

  // 2. Persist to the DB. If this fails, roll back the freshly uploaded asset
  //    so we never end up with an orphaned Cloudinary file and no DB reference.
  let updatedUser;
  try {
    updatedUser = await User.findByIdAndUpdate(
      userId,
      { profileImage: uploaded.url, profileImagePublicId: uploaded.publicId },
      { new: true, runValidators: true },
    );
    if (!updatedUser) throw ApiError.notFound("Client account not found");
  } catch (err) {
    await cloudinaryService.deleteImage(uploaded.publicId);
    throw err;
  }

  // 3. Only now that the DB write succeeded, clean up the previous image (if any).
  if (previousPublicId) {
    await cloudinaryService.deleteImage(previousPublicId);
  }

  return updatedUser;
};

const removeProfilePicture = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw ApiError.notFound("Client account not found");

  if (!user.profileImage) return user;

  const previousPublicId = user.profileImagePublicId;

  user.profileImage = null;
  user.profileImagePublicId = null;
  await user.save();

  if (previousPublicId) {
    await cloudinaryService.deleteImage(previousPublicId);
  }

  return user;
};

export default { uploadProfilePicture, removeProfilePicture };
