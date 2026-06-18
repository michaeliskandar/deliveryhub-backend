import Joi from "joi";

export const updateProfileSchema = Joi.object({
    name: Joi.string().trim().min(2).max(100).optional(),
    phone: Joi.string().trim().min(8).max(20).optional(),
    avatarUrl: Joi.string().uri().optional(),
}).min(1);

export const pushTokenSchema = Joi.object({
    token: Joi.string().trim().min(10).required(),
});
