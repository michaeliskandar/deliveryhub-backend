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
} from "./captain-verification.validation.js";
import {
  uploadDocument,
  uploadDocuments,
  getStatus,
  reviewVerification,
} from "./captain-verification.controller.js";

const router = Router();

router.post(
  "/document",
  authenticate,
  authorize(ROLES.CAPTAIN),
  uploadSingleDocument("document"),
  validate(uploadDocumentSchema),
  uploadDocument,
);

router.post(
  "/documents",
  authenticate,
  authorize(ROLES.CAPTAIN),
  uploadMultipleDocuments("documents", 5),
  validate(uploadDocumentsSchema),
  uploadDocuments,
);

router.get("/status", authenticate, authorize(ROLES.CAPTAIN), getStatus);

// Admin-only review of a captain's verification submission. No image upload
// happens here — the Admin dashboard only reads/reviews, per requirements.
router.patch(
  "/review",
  authenticate,
  authorize(ROLES.ADMIN),
  validate(reviewVerificationSchema),
  reviewVerification,
);

export default router;
