import captainVerificationService from "./captain-verification.service.js";
import ApiResponse from "../../shared/utils/ApiResponse.js";
import ApiError from "../../shared/utils/ApiError.js";

export const uploadDocument = async (req, res, next) => {
  try {
    const verification = await captainVerificationService.uploadDocument(
      req.user._id,
      req.file,
      req.body.documentType,
    );
    return res.status(200).json(ApiResponse.success(verification, "Document uploaded successfully"));
  } catch (err) {
    next(err);
  }
};

export const uploadDocuments = async (req, res, next) => {
  try {
    let documentTypes;
    try {
      documentTypes = JSON.parse(req.body.documentTypes);
    } catch {
      throw ApiError.badRequest(
        "documentTypes must be a valid JSON array, e.g. [\"national_id\",\"driving_license\"]",
      );
    }

    const result = await captainVerificationService.uploadDocuments(req.user._id, req.files, documentTypes);
    return res.status(200).json(
      ApiResponse.success(result.verification, "Documents uploaded successfully"),
    );
  } catch (err) {
    next(err);
  }
};

export const getStatus = async (req, res, next) => {
  try {
    const status = await captainVerificationService.getStatus(req.user._id);
    return res.status(200).json(ApiResponse.success(status));
  } catch (err) {
    next(err);
  }
};

export const reviewVerification = async (req, res, next) => {
  try {
    const { userId, status, reviewNote } = req.body;
    const verification = await captainVerificationService.reviewVerification(req.user._id, userId, {
      status,
      reviewNote,
    });
    return res.status(200).json(ApiResponse.success(verification, "Verification reviewed"));
  } catch (err) {
    next(err);
  }
};
