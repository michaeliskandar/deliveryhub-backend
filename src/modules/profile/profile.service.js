import User from "../../database/models/User.model.js";
import ApiError from "../../shared/utils/ApiError.js";
import { uploadToCloudinary } from "../../shared/utils/cloudinary.js";

const getProfile = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw ApiError.notFound("User not found");
  }

  return user;
};

const updateProfile = async (userId, updateData) => {
  const allowedFields = ["fullName", "phone", "profileImage"];

  const filteredData = {};
  for (const field of allowedFields) {
    if (updateData[field] !== undefined) {
      filteredData[field] = updateData[field];
    }
  }

  if (filteredData.profileImage && filteredData.profileImage.startsWith("data:image")) {
    try {
      filteredData.profileImage = await uploadToCloudinary(filteredData.profileImage);
    } catch (err) {
      throw ApiError.badRequest("Failed to upload profile image to cloud");
    }
  }

  const updatedUser = await User.findByIdAndUpdate(userId, filteredData, {
    new: true,
    runValidators: true,
  });

  if (!updatedUser) {
    throw ApiError.notFound("User not found");
  }

  return updatedUser;
};

const changePassword = async (userId, currentPassword, newPassword) => {
  const user = await User.findById(userId).select("+password");
  if (!user) throw ApiError.notFound("User not found");

  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) throw ApiError.badRequest("Current password is incorrect");

  user.password = newPassword;
  await user.save();

  return { message: "Password updated successfully" };
};

const updateAvatar = async (userId, profileImage) => {
  if (!profileImage) throw ApiError.badRequest("profileImage is required");

  let imageUrl = profileImage;
  if (profileImage.startsWith("data:image")) {
    try {
      imageUrl = await uploadToCloudinary(profileImage);
    } catch (err) {
      throw ApiError.badRequest("Failed to upload avatar to cloud");
    }
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { profileImage: imageUrl },
    { new: true, runValidators: true },
  );

  if (!updatedUser) throw ApiError.notFound("User not found");

  return updatedUser;
};

export { getProfile, updateProfile, changePassword, updateAvatar };

