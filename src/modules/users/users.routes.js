import { Router } from "express";
import { authenticate } from "../../shared/middleware/authenticate.js";
import { validate } from "../../shared/middleware/validate.js";
import { updateProfileSchema, pushTokenSchema } from "./users.validation.js";
import { getMe, updateMe, addPushToken, removePushToken } from "./users.controller.js";

const router = Router();

router.use(authenticate);

router.get("/me", getMe);
router.patch("/me", validate(updateProfileSchema), updateMe);
router.post("/push-token", validate(pushTokenSchema), addPushToken);
router.delete("/push-token", validate(pushTokenSchema), removePushToken);

export default router;
