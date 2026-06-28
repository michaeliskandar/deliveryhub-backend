import Joi from "joi";
import { VERIFICATION_STATUS } from "../../database/models/Verification.model.js";

// Client verification documents: typically the customer's national ID.
export const CLIENT_DOCUMENT_TYPES = ["national_id"];

export const uploadDocumentSchema = Joi.object({
  documentType: Joi.string()
    .valid(...CLIENT_DOCUMENT_TYPES)
    .required(),
});

// Used when uploading several documents in one request — documentTypes is sent
// as a JSON-stringified array in the multipart form, one entry per file in order.
export const uploadDocumentsSchema = Joi.object({
  documentTypes: Joi.string().required(), // JSON array string, parsed in the controller
});

export const reviewVerificationSchema = Joi.object({
  userId: Joi.string().hex().length(24).required(),
  status: Joi.string()
    .valid(...Object.values(VERIFICATION_STATUS))
    .required(),
  reviewNote: Joi.string().trim().max(500).optional(),
});
