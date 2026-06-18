import { Schema, model } from "mongoose";
import { ROLES } from "../../shared/constants/roles.js";

const userSchema = new Schema(
    {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        phone: { type: String, required: true, trim: true },
        passwordHash: { type: String, required: true, select: false },
        role: {
            type: String,
            enum: Object.values(ROLES),
            default: ROLES.CUSTOMER,
            required: true,
        },
        avatarUrl: { type: String },
        pushTokens: { type: [String], default: [] },
        isVerified: { type: Boolean, default: false },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

userSchema.index({ role: 1 });

export default model("User", userSchema);
