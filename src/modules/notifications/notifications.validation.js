import Joi from "joi";

export const listNotificationsQuerySchema = Joi.object({
    status: Joi.string().valid("all", "unread").default("all"),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(50).default(20),
});

export const notificationIdParamSchema = Joi.object({
    id: Joi.string().hex().length(24).required(),
});
