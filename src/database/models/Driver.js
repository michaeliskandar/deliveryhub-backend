import mongoose from "mongoose";

const driverSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  vehicle: { type: Object },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  totalDeliveries: { type: Number, default: 0 },
});

export default mongoose.model("Driver", driverSchema);
