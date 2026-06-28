import { Router } from "express";
import { authenticate } from "../../shared/middleware/authenticate.js";
import { authorize } from "../../shared/middleware/authorize.js";
import { validate } from "../../shared/middleware/validate.js";
import { uploadSingleDocument, uploadMultipleDocuments } from "../../shared/middleware/upload.js";
import { ROLES } from "../../shared/constants/roles.js";
import {
  uploadDocumentSchema,
  uploadDocumentsSchema,
  reviewVerificationSchema,
} from "./client-verification.validation.js";
import {
  uploadDocument,
  uploadDocuments,
  getStatus,
  reviewVerification,
} from "./client-verification.controller.js";

const router = Router();

router.post(
  "/document",
  authenticate,
  authorize(ROLES.CUSTOMER),
  uploadSingleDocument("document"),
  validate(uploadDocumentSchema),
  uploadDocument,
);

router.post(
  "/documents",
  authenticate,
  authorize(ROLES.CUSTOMER),
  uploadMultipleDocuments("documents", 5),
  validate(uploadDocumentsSchema),
  uploadDocuments,
);

router.get("/status", authenticate, authorize(ROLES.CUSTOMER), getStatus);

// Admin-only review of a client's verification submission. No image upload
// happens here — the Admin dashboard only reads/reviews, per requirements.
router.patch(
  "/review",
  authenticate,
  authorize(ROLES.ADMIN),
  validate(reviewVerificationSchema),
  reviewVerification,
);

export default router;
