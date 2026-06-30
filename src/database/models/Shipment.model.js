import mongoose from "mongoose";
import { SHIPMENT_STATUS } from "../../shared/constants/shipmentStatus.js";

const shipmentSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    trackingNumber: {
      type: String,
      unique: true,
    },

    pickupAddress: {
      type: String,
      required: true,
    },

    deliveryAddress: {
      type: String,
      required: true,
    },

    pickupCoords: {
      type: [Number],
      required: true,
    },

    deliveryCoords: {
      type: [Number],
      required: true,
    },

    weight: {
      type: Number,
      required: true,
    },

    packageType: {
      type: String,
      enum: ["small_box", "medium_box", "large_box", "pallet"],
      required: true,
    },

    deliverySpeed: {
      type: String,
      enum: ["standard", "express", "scheduled"],
      required: true,
    },

    scheduledDate: {
      type: Date,
      default: null,
    },

    notes: {
      type: String,
      default: null,
    },

    status: {
      type: String,
      enum: Object.values(SHIPMENT_STATUS),
      default: SHIPMENT_STATUS.PENDING_OFFERS,
    },

    distanceKm: {
      type: Number,
      default: null,
    },

    estimatedPriceMin: {
      type: Number,
      default: null,
    },

    estimatedPriceMax: {
      type: Number,
      default: null,
    },

    price: {
      type: Number,
      default: null,
    },

    captain: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // Set when an Office's offer is accepted; the office must then assign
    // one of its own captains via the /office/offers endpoints.
    assignedOffice: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Office",
      default: null,
    },

    selectedOfferId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Offer",
      default: null,
    },

    etaDescription: {
      type: String,
      default: null,
    },

    pickedUpTime: {
      type: String,
      default: null,
    },

    deliveryProgressPercent: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },

    officeDiscountPercentage: {
      type: Number,
      default: 0,
    },

    captainPrice: {
      type: Number,
      default: null,
    },

    captainStatus: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

shipmentSchema.pre("save", async function (next) {
  if (!this.trackingNumber) {
    let trackingNumber;
    let exists = true;
    while (exists) {
      const randomDigits = Math.floor(10000 + Math.random() * 90000);
      trackingNumber = `SC-${randomDigits}`;
      const found = await mongoose.model("Shipment").findOne({ trackingNumber });
      if (!found) {
        exists = false;
      }
    }
    this.trackingNumber = trackingNumber;
  }
  next();
});

const Shipment = mongoose.model("Shipment", shipmentSchema);

export default Shipment;
