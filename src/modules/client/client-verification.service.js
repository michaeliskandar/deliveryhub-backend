import Verification, { VERIFICATION_STATUS } from "../../database/models/Verification.model.js";
import cloudinaryService from "../../shared/services/cloudinary.service.js";
import { CLOUDINARY_FOLDERS } from "../../shared/constants/cloudinaryFolders.js";
import ApiError from "../../shared/utils/ApiError.js";

const FOLDER = CLOUDINARY_FOLDERS.CLIENT_VERIFICATION;

const getOrCreateVerification = async (userId) => {
  let verification = await Verification.findOne({ user: userId });
  if (!verification) {
    verification = await Verification.create({ user: userId, documents: [] });
  }
  return verification;
};

// Replaces (or inserts) a single documentType entry on the array, returning
// the publicId of whatever was previously stored there (if any), so the
// caller can clean it up from Cloudinary after the DB write succeeds.
const upsertDocumentEntry = (verification, { documentType, documentUrl, documentPublicId }) => {
  const existingIndex = verification.documents.findIndex((d) => d.documentType === documentType);
  const previousPublicId =
    existingIndex >= 0 ? verification.documents[existingIndex].documentPublicId : null;

  const entry = { documentType, documentUrl, documentPublicId, uploadedAt: new Date() };

  if (existingIndex >= 0) {
    verification.documents[existingIndex] = entry;
  } else {
    verification.documents.push(entry);
  }

  // Re-uploading resets a previously rejected verification back to pending.
  if (verification.status === VERIFICATION_STATUS.REJECTED) {
    verification.status = VERIFICATION_STATUS.PENDING;
    verification.reviewNote = null;
  }

  return previousPublicId;
};

/** Single-document upload: one file + one documentType per call. */
const uploadDocument = async (userId, file, documentType) => {
  if (!file) throw ApiError.badRequest("Please attach a file under the 'document' field");

  const uploaded = await cloudinaryService.uploadSingle(file, FOLDER);

  const verification = await getOrCreateVerification(userId);
  let previousPublicId;
  try {
    previousPublicId = upsertDocumentEntry(verification, {
      documentType,
      documentUrl: uploaded.url,
      documentPublicId: uploaded.publicId,
    });
    await verification.save();
  } catch (err) {
    await cloudinaryService.deleteImage(uploaded.publicId);
    throw err;
  }

  if (previousPublicId) {
    await cloudinaryService.deleteImage(previousPublicId);
  }

  return verification;
};

/** Multi-document upload: several files + a matching array of documentTypes. */
const uploadDocuments = async (userId, files, documentTypes) => {
  if (!Array.isArray(files) || files.length === 0) {
    throw ApiError.badRequest("Please attach at least one file under the 'documents' field");
  }
  if (!Array.isArray(documentTypes) || documentTypes.length !== files.length) {
    throw ApiError.badRequest("documentTypes must be a JSON array matching the number of files uploaded");
  }

  const { succeeded, failed } = await cloudinaryService.uploadMultiple(files, FOLDER);

  const verification = await getOrCreateVerification(userId);
  const previousPublicIds = [];

  try {
    succeeded.forEach((uploaded, i) => {
      const previousPublicId = upsertDocumentEntry(verification, {
        documentType: documentTypes[i],
        documentUrl: uploaded.url,
        documentPublicId: uploaded.publicId,
      });
      if (previousPublicId) previousPublicIds.push(previousPublicId);
    });
    await verification.save();
  } catch (err) {
    await cloudinaryService.deleteMultiple(succeeded.map((u) => u.publicId));
    throw err;
  }

  if (previousPublicIds.length) {
    await cloudinaryService.deleteMultiple(previousPublicIds);
  }

  return { verification, failedUploads: failed };
};

const getStatus = async (userId) => {
  const verification = await Verification.findOne({ user: userId });
  if (!verification) {
    return { status: VERIFICATION_STATUS.PENDING, documents: [], reviewNote: null };
  }
  return verification;
};

const reviewVerification = async (reviewerId, userId, { status, reviewNote }) => {
  if (!Object.values(VERIFICATION_STATUS).includes(status)) {
    throw ApiError.badRequest("Invalid verification status");
  }

  const verification = await Verification.findOne({ user: userId });
  if (!verification) throw ApiError.notFound("No verification submission found for this client");

  verification.status = status;
  verification.reviewNote = reviewNote ?? null;
  verification.reviewedBy = reviewerId;
  verification.reviewedAt = new Date();
  await verification.save();

  return verification;
};

export default { uploadDocument, uploadDocuments, getStatus, reviewVerification };
