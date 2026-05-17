// models/Order.js
import mongoose, { Schema, model, models } from "mongoose";

const OrderSchema = new Schema(
  {
    userEmail: { type: String, required: true },
    shopId: { type: mongoose.Schema.Types.ObjectId, ref: "Shop", default: null },

    // Cart
    cartProducts: [
      {
        _id: String,
        name: String,
        price: Number,
        image: String,
        size: Object,
        extras: [Object],
      },
    ],

    // Status tracking
    status: {
      type: String,
      enum: ["pending", "confirmed", "preparing", "ready", "completed", "cancelled"],
      default: "pending",
    },

    // Payment
    paid: { type: Boolean, default: false },
    paymentMethod: { type: String, enum: ["cash", "card", "wallet"], default: "cash" },
    stripeSessionId: { type: String },

    // Extra order info
    notes: { type: String, default: "" },
    serviceFee: { type: Number, default: 0 },

    // Delivery address
    phone: String,
    streetAddress: String,
    postalCode: String,
    city: String,
    country: String,

    // Timestamps
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Index for efficient queries
OrderSchema.index({ shopId: 1, createdAt: -1 });
OrderSchema.index({ userEmail: 1, createdAt: -1 });

const Order = models?.Order || model("Order", OrderSchema);
export default Order;