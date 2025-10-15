// models/MenuItem.js
import mongoose from "mongoose";

const MenuItemSchema = new mongoose.Schema({
  shopId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Shop',
    required: true 
  },
  name: { 
    type: String, 
    required: true 
  },
  price: { 
    type: Number, 
    required: true,
    min: 0
  },
  category: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String,
    default: ''
  },
  available: { 
    type: Boolean, 
    default: true 
  },
  image: {
    type: String,
    default: ''
  }
}, { timestamps: true });

// Index for faster queries
MenuItemSchema.index({ shopId: 1, available: 1 });

export default mongoose.models.MenuItem || mongoose.model("MenuItem", MenuItemSchema);