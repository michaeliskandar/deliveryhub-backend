import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary using process.env
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload a file/base64 string to Cloudinary.
 * @param {string} fileString - Base64 string or file URL
 * @param {string} folder - Destination folder on Cloudinary
 * @returns {Promise<string>} The secure URL of the uploaded image
 */
export const uploadToCloudinary = async (fileString, folder = "deliveryhub_avatars") => {
  try {
    const res = await cloudinary.uploader.upload(fileString, {
      folder,
      resource_type: "auto",
    });
    return res.secure_url;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw error;
  }
};

export default cloudinary;
