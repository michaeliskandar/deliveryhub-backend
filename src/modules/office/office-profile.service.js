import Office from "../../database/models/Office.js";
import cloudinaryService from "../../shared/services/cloudinary.service.js";
import { CLOUDINARY_FOLDERS } from "../../shared/constants/cloudinaryFolders.js";
import ApiError from "../../shared/utils/ApiError.js";

const FOLDER = CLOUDINARY_FOLDERS.OFFICE_PROFILE;

// Resolve the Office document owned by the currently authenticated office user.
const resolveOffice = async (userId) => {
  const office = await Office.findOne({ user: userId });
  if (!office) throw ApiError.notFound("Office profile not found");
  return office;
};

const uploadProfilePicture = async (userId, file) => {
  if (!file) throw ApiError.badRequest("Please attach an image file under the 'image' field");

  const office = await resolveOffice(userId);
  const previousPublicId = office.profileImagePublicId;

  const uploaded = await cloudinaryService.uploadSingle(file, FOLDER);

  let updatedOffice;
  try {
    office.profileImage = uploaded.url;
    office.profileImagePublicId = uploaded.publicId;
    updatedOffice = await office.save();
  } catch (err) {
    await cloudinaryService.deleteImage(uploaded.publicId);
    throw err;
  }

  if (previousPublicId) {
    await cloudinaryService.deleteImage(previousPublicId);
  }

  return updatedOffice;
};

const removeProfilePicture = async (userId) => {
  const office = await resolveOffice(userId);
  if (!office.profileImage) return office;

  const previousPublicId = office.profileImagePublicId;
  office.profileImage = null;
  office.profileImagePublicId = null;
  await office.save();

  if (previousPublicId) {
    await cloudinaryService.deleteImage(previousPublicId);
  }

  return office;
};

export default { uploadProfilePicture, removeProfilePicture };
