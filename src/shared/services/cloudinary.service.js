import { Readable } from "stream";
import cloudinary from "../../config/cloudinary.js";
import ApiError from "../utils/ApiError.js";

/**
 * cloudinary.service.js
 * ---------------------
 * Generic, reusable Cloudinary helper shared by every dashboard module
 * (client / office / captain). It knows nothing about Users, Offices,
 * Drivers or Verification documents — it only knows how to push a buffer
 * to Cloudinary and how to remove an asset by public_id.
 *
 * Each dashboard's own service file (e.g. client-profile.service.js) is
 * responsible for wiring this generic helper to its own Mongoose model.
 */

const bufferToStream = (buffer) => Readable.from(buffer);

/**
 * Uploads a single in-memory file (from multer's memoryStorage) to Cloudinary.
 *
 * @param {Buffer} buffer - raw file buffer
 * @param {Object} options
 * @param {string} options.folder - Cloudinary folder, e.g. "deliveryhub/clients/profile"
 * @param {string} [options.resourceType="image"] - "image" | "raw" (raw is used for PDFs)
 * @returns {Promise<{url:string, publicId:string, format:string, bytes:number}>}
 */
const uploadBuffer = (buffer, { folder, resourceType = "image" } = {}) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: resourceType,
        overwrite: false,
      },
      (error, result) => {
        if (error) {
          return reject(ApiError.badRequest(`Image upload to Cloudinary failed: ${error.message}`));
        }
        return resolve({
          url: result.secure_url,
          publicId: result.public_id,
          format: result.format,
          width: result.width,
          height: result.height,
          bytes: result.bytes,
          resourceType: result.resource_type,
        });
      },
    );

    bufferToStream(buffer).pipe(uploadStream);
  });
};

/**
 * Uploads a single multer file object.
 * @param {Express.Multer.File} file
 * @param {string} folder
 */
const uploadSingle = async (file, folder) => {
  if (!file || !file.buffer) {
    throw ApiError.badRequest("No file was provided for upload");
  }

  // PDFs (verification documents) must be uploaded as "raw", images as "image".
  const resourceType = file.mimetype === "application/pdf" ? "raw" : "image";

  return uploadBuffer(file.buffer, { folder, resourceType });
};

/**
 * Uploads several multer file objects in parallel.
 * @param {Express.Multer.File[]} files
 * @param {string} folder
 */
const uploadMultiple = async (files, folder) => {
  if (!Array.isArray(files) || files.length === 0) {
    throw ApiError.badRequest("No files were provided for upload");
  }

  // Promise.allSettled so one bad file doesn't silently abort the others —
  // the caller decides what to do with partial failures.
  const results = await Promise.allSettled(files.map((file) => uploadSingle(file, folder)));

  const succeeded = [];
  const failed = [];

  results.forEach((result, index) => {
    if (result.status === "fulfilled") {
      succeeded.push(result.value);
    } else {
      failed.push({ index, message: result.reason?.message || "Upload failed" });
    }
  });

  if (succeeded.length === 0) {
    throw ApiError.badRequest("All file uploads failed");
  }

  return { succeeded, failed };
};

/**
 * Deletes a single asset from Cloudinary by public_id.
 * Never throws — a failed cleanup of an orphaned/old asset should not crash
 * the main request flow. The failure is logged instead.
 */
const deleteImage = async (publicId, resourceType = "image") => {
  if (!publicId) return null;
  try {
    return await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  } catch (error) {
    console.error(`[cloudinary] Failed to delete asset "${publicId}": ${error.message}`);
    return null;
  }
};

/**
 * Deletes several assets from Cloudinary by public_id.
 */
const deleteMultiple = async (publicIds = [], resourceType = "image") => {
  const ids = publicIds.filter(Boolean);
  if (ids.length === 0) return [];
  return Promise.all(ids.map((id) => deleteImage(id, resourceType)));
};

export default {
  uploadSingle,
  uploadMultiple,
  deleteImage,
  deleteMultiple,
};
