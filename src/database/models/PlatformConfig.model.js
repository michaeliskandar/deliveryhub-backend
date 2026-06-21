import mongoose from "mongoose";

const platformConfigSchema = new mongoose.Schema(
  {
    commissionRate: { type: Number, default: 10, min: 0, max: 100 },
  },
  { timestamps: true },
);

export default mongoose.model("PlatformConfig", platformConfigSchema);
