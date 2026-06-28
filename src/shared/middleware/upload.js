import multer from "multer";
import ApiError from "../utils/ApiError.js";

/**
 * upload.js
 * ---------
 * Generic, reusable multer configuration shared by every dashboard module.
 * Files are kept in memory (not written to disk) so they can be streamed
 * straight to Cloudinary by cloudinary.service.js.
 *
 * Two allowed-type presets are exported:
 *  - IMAGE_TYPES      -> profile pictures (jpeg/png/webp only)
 *  - DOCUMENT_TYPES    -> verification documents (jpeg/png/webp + pdf scans)
 */

export const IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
export const DOCUMENT_TYPES = [...IMAGE_TYPES, "application/pdf"];

const DEFAULT_MAX_FILE_SIZE_MB = 5;

const buildFileFilter = (allowedTypes) => (req, file, cb) => {
  if (!allowedTypes.includes(file.mimetype)) {
    return cb(
      ApiError.badRequest(
        `Unsupported file type "${file.mimetype}". Allowed formats: ${allowedTypes
          .map((t) => t.split("/")[1])
          .join(", ")}.`,
      ),
    );
  }
  return cb(null, true);
};

const buildUploader = ({ allowedTypes = IMAGE_TYPES, maxSizeMB = DEFAULT_MAX_FILE_SIZE_MB } = {}) =>
  multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: maxSizeMB * 1024 * 1024 },
    fileFilter: buildFileFilter(allowedTypes),
  });

/**
 * Wraps a multer middleware so that MulterError / fileFilter errors are
 * converted into our ApiError shape and forwarded to the global error
 * handler instead of crashing the request or leaking multer's raw error.
 */
const withErrorHandling = (multerMiddleware) => (req, res, next) => {
  multerMiddleware(req, res, (err) => {
    if (!err) return next();

    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return next(ApiError.badRequest("File is too large. Maximum allowed size is 5MB."));
      }
      if (err.code === "LIMIT_UNEXPECTED_FILE") {
        return next(ApiError.badRequest(`Unexpected file field "${err.field}".`));
      }
      if (err.code === "LIMIT_FILE_COUNT") {
        return next(ApiError.badRequest("Too many files uploaded in a single request."));
      }
      return next(ApiError.badRequest(err.message));
    }

    // Errors thrown from fileFilter (ApiError instances) or anything else.
    return next(err);
  });
};

/** Single image upload, e.g. a profile picture. */
export const uploadSingleImage = (fieldName, options = {}) =>
  withErrorHandling(buildUploader({ allowedTypes: IMAGE_TYPES, ...options }).single(fieldName));

/** Multiple image upload (array of files under the same field name). */
export const uploadMultipleImages = (fieldName, maxCount = 5, options = {}) =>
  withErrorHandling(
    buildUploader({ allowedTypes: IMAGE_TYPES, ...options }).array(fieldName, maxCount),
  );

/** Single verification document upload (image or PDF scan). */
export const uploadSingleDocument = (fieldName, options = {}) =>
  withErrorHandling(buildUploader({ allowedTypes: DOCUMENT_TYPES, ...options }).single(fieldName));

/** Multiple verification documents upload in one request (image or PDF scans). */
export const uploadMultipleDocuments = (fieldName, maxCount = 5, options = {}) =>
  withErrorHandling(
    buildUploader({ allowedTypes: DOCUMENT_TYPES, ...options }).array(fieldName, maxCount),
  );

export default {
  IMAGE_TYPES,
  DOCUMENT_TYPES,
  uploadSingleImage,
  uploadMultipleImages,
  uploadSingleDocument,
  uploadMultipleDocuments,
};
