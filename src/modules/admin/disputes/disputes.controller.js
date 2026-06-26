import disputesService from "./disputes.service.js";
import ApiResponse from "../../../shared/utils/ApiResponse.js";

const getDisputes = async (req, res, next) => {
    try {
        const { status, page, limit } = req.query;
        const result = await disputesService.getDisputes({
            status,
            page,
            limit,
        });
        return res.status(200).json(ApiResponse.success(result));
    } catch (err) {
        next(err);
    }
};

const resolveDispute = async (req, res, next) => {
    try {
        const result = await disputesService.resolveDispute(req.params.id);
        return res
            .status(200)
            .json(ApiResponse.success(result, "Dispute resolved"));
    } catch (err) {
        next(err);
    }
};

export default { getDisputes, resolveDispute };
