import { v2 as cloudinary } from "cloudinary";
import { ENV } from "./env.js";

// Single, shared Cloudinary SDK instance.
// Every dashboard module (client / office / captain) reuses this configured
// instance through src/shared/services/cloudinary.service.js — nobody calls
// the SDK directly from a controller/service file.
cloudinary.config({
  cloud_name: ENV.CLOUDINARY_CLOUD_NAME,
  api_key: ENV.CLOUDINARY_API_KEY,
  api_secret: ENV.CLOUDINARY_API_SECRET,
  secure: true,
});

if (!ENV.CLOUDINARY_CLOUD_NAME || !ENV.CLOUDINARY_API_KEY || !ENV.CLOUDINARY_API_SECRET) {
  // We don't throw here — we just warn — so the rest of the API (auth, shipments, etc.)
  // keeps working even if Cloudinary hasn't been configured yet in this environment.
  console.warn(
    "[cloudinary] Missing CLOUDINARY_CLOUD_NAME / CLOUDINARY_API_KEY / CLOUDINARY_API_SECRET env vars. " +
    "Image upload endpoints will fail until these are set.",
  );
}

export default cloudinary;
