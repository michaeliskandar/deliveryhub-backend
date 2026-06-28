import mongoose from 'mongoose';

const officeSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    businessName: String,
    licenseNumber: String,
    address: Object,
    status: {
        type: String,
        enum: ["available", "offline"],
        default: "available"
    }
}, { timestamps: true });

export default mongoose.model('Office', officeSchema);