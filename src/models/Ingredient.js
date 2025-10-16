// models/Ingredient.js
import mongoose from "mongoose";

const IngredientSchema = new mongoose.Schema({
  shopId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Shop',
    required: true 
  },
  name: { 
    type: String, 
    required: true 
  },
  stock: { 
    type: Number, 
    required: true,
    min: 0,
    default: 0
  },
  unit: { 
    type: String, 
    required: true,
    enum: ['pieces', 'kg', 'grams', 'liters', 'ml', 'units', 'packs']
  },
  lowStockThreshold: { 
    type: Number, 
    required: true,
    min: 0,
    default: 10
  },
  isAvailable: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

// Virtual to check if stock is low
IngredientSchema.virtual('isLowStock').get(function() {
  return this.stock <= this.lowStockThreshold;
});

// Update availability based on stock
IngredientSchema.pre('save', function(next) {
  this.isAvailable = this.stock > 0;
  next();
});

// Index for faster queries
IngredientSchema.index({ shopId: 1, isAvailable: 1 });

export default mongoose.models.Ingredient || mongoose.model("Ingredient", IngredientSchema);