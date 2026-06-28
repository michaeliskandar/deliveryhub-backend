import { Router } from "express";
import { authenticate } from "../../shared/middleware/authenticate.js";
import { authorize } from "../../shared/middleware/authorize.js";
import { uploadSingleImage } from "../../shared/middleware/upload.js";
import { ROLES } from "../../shared/constants/roles.js";
import { uploadProfilePicture, removeProfilePicture } from "./client-profile.controller.js";

const router = Router();

// Every route here is scoped to the Client (customer) dashboard only.
router.use(authenticate, authorize(ROLES.CUSTOMER));

router.post("/picture", uploadSingleImage("image"), uploadProfilePicture);
router.delete("/picture", removeProfilePicture);

export default router;
