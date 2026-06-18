import shipmentService from "./shipments.service.js";
import ApiResponse from "../../shared/utils/ApiResponse.js";
import ApiError from "../../shared/utils/ApiError.js";

// POST /api/shipments
export const createShipment = async (req, res, next) => {
    try {
        const customerId = req.user._id;
        const shipment = await shipmentService.createShipment(
            customerId,
            req.body,
        );

        return res
            .status(201)
            .json(
                ApiResponse.success(shipment, "Shipment created successfully"),
            );
    } catch (err) {
        next(err);
    }
};

// GET /api/shipments  (my shipments - customer)
export const getMyShipments = async (req, res, next) => {
    try {
        const customerId = req.user._id;
        const { status, page, limit } = req.query;

        const statusFilter = status ? status.split(",") : null;

        const result = await shipmentService.getShipmentsByCustomer(
            customerId,
            statusFilter,
            { page, limit },
        );

        return res.status(200).json(ApiResponse.success(result));
    } catch (err) {
        next(err);
    }
};

// GET /api/shipments/:id
export const getShipmentById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const customerId = req.user._id;

        const shipment = await shipmentService.getShipmentById(id, customerId);

        if (!shipment) throw new ApiError(404, "Shipment not found");

        return res.status(200).json(ApiResponse.success(shipment));
    } catch (err) {
        next(err);
    }
};

// PATCH /api/shipments/:id/cancel
export const cancelShipment = async (req, res, next) => {
    try {
        const { id } = req.params;
        const customerId = req.user._id;

        const shipment = await shipmentService.cancelShipment(id, customerId);

        return res
            .status(200)
            .json(ApiResponse.success(shipment, "Shipment cancelled"));
    } catch (err) {
        next(err);
    }
};

// GET /api/admin/shipments
export const getAllShipments = async (req, res, next) => {
    try {
        const { status, page, limit } = req.query;
        const statusFilter = status ? status.split(",") : null;

        const result = await shipmentService.getAllShipments(statusFilter, {
            page,
            limit,
        });

        return res.status(200).json(ApiResponse.success(result));
    } catch (err) {
        next(err);
    }
};
