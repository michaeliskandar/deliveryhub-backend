import { Router } from "express";
import {
    getWallet,
    topup,
    withdraw,
    getTransactions,
} from "./wallet.controller.js";
import { authenticate } from "../../shared/middleware/authenticate.js";
import { authorize } from "../../shared/middleware/authorize.js";
import { validate } from "../../shared/middleware/validate.js";
import { topupSchema, withdrawSchema } from "./wallet.validation.js";
import { ROLES } from "../../shared/constants/roles.js";

const router = Router();

router.use(authenticate);
router.use(authorize(ROLES.CUSTOMER));

router.get("/", getWallet);
router.post("/topup", validate(topupSchema), topup);
router.post("/withdraw", validate(withdrawSchema), withdraw);
router.get("/transactions", getTransactions);

export default router;
