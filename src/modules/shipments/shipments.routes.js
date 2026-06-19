// // src/modules/shipments/shipments.routes.js

// import { Router } from "express";
// import {
//     createShipment,
//     getMyShipments,
//     getShipmentById,
//     cancelShipment,
//     getAllShipments,
// } from "./shipments.controller.js";
// import { authenticate } from "../../shared/middleware/authenticate.js";
// import { authorize } from "../../shared/middleware/authorize.js";
// import { validate } from "../../shared/middleware/validate.js";
// import { createShipmentSchema } from "./shipments.validation.js";
// import { ROLES } from "../../shared/constants/roles.js";

// const router = Router();

// // ── Customer ─────────────────────────────────────────────────
// router.use(authenticate);

// router.post(
//     "/",
//     authorize(ROLES.CUSTOMER),
//     validate(createShipmentSchema),
//     createShipment,
// );
// router.get("/", authorize(ROLES.CUSTOMER), getMyShipments);
// router.get("/:id", authorize(ROLES.CUSTOMER), getShipmentById);
// router.patch("/:id/cancel", authorize(ROLES.CUSTOMER), cancelShipment);

// // ── Admin ─────────────────────────────────────────────────────
// router.get("/admin/all", authorize(ROLES.ADMIN), getAllShipments);

// export default router;

// src/modules/shipments/shipments.routes.js

import { Router } from "express";
import {
    createShipment,
    getMyShipments,
    getShipmentById,
    cancelShipment,
    getAllShipments,
} from "./shipments.controller.js";
import { authenticate } from "../../shared/middleware/authenticate.js";
import { authorize } from "../../shared/middleware/authorize.js";
import { validate } from "../../shared/middleware/validate.js";
import { createShipmentSchema } from "./shipments.validation.js";
import { ROLES } from "../../shared/constants/roles.js";

const router = Router();

router.use(authenticate);

router.get("/admin/all", authorize(ROLES.ADMIN), getAllShipments);

router.post(
    "/",
    authorize(ROLES.CUSTOMER),
    validate(createShipmentSchema),
    createShipment,
);
router.get("/", authorize(ROLES.CUSTOMER), getMyShipments);
router.get("/:id", authorize(ROLES.CUSTOMER), getShipmentById);
router.patch("/:id/cancel", authorize(ROLES.CUSTOMER), cancelShipment);

export default router;
