import mongoose from "mongoose";

const ShopSchema = new mongoose.Schema({
  businessName: { type: String, required: true },
  businessType: { type: String },
  businessRegistrationNumber: { type: String },
  ownerName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  postalCode: { type: String },
  cuisine: { type: String, required: true },
  description: { type: String },
  operatingHours: {
    monday: { open: String, close: String, closed: Boolean },
    tuesday: { open: String, close: String, closed: Boolean },
    wednesday: { open: String, close: String, closed: Boolean },
    thursday: { open: String, close: String, closed: Boolean },
    friday: { open: String, close: String, closed: Boolean },
    saturday: { open: String, close: String, closed: Boolean },
    sunday: { open: String, close: String, closed: Boolean },
  },
  bankName: { type: String, required: true },
  accountNumber: { type: String, required: true },
  accountHolder: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.Shop || mongoose.model("Shop", ShopSchema);
