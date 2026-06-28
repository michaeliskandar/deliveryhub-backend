import Joi from "joi";
import { VERIFICATION_STATUS } from "../../database/models/Verification.model.js";

// Office verification documents: business/commercial papers.
export const OFFICE_DOCUMENT_TYPES = ["national_id", "commercial_register"];

export const uploadDocumentSchema = Joi.object({
  documentType: Joi.string()
    .valid(...OFFICE_DOCUMENT_TYPES)
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
