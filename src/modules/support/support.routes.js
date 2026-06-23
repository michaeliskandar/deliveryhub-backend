import { Router } from "express";
import {
    createTicket,
    getMyTickets,
    getTicketById,
} from "./support.controller.js";
import { validate } from "../../shared/middleware/validate.js";
import { createTicketSchema } from "./support.validation.js";
import { authenticate } from "../../shared/middleware/authenticate.js";
import { authorize } from "../../shared/middleware/authorize.js";
import { ROLES } from "../../shared/constants/roles.js";
const router = Router();

router.use(authenticate);
router.use(authorize(ROLES.CUSTOMER));

router.post("/", validate(createTicketSchema), createTicket);
router.get("/", getMyTickets);
router.get("/:id", getTicketById);

export default router;
