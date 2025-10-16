// app/api/ingredients/[id]/route.js
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Ingredient from "@/models/Ingredient";
import MenuItem from "@/models/MenuItem";
import Shop from "@/models/Shop";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// Helper function to update menu item availability based on ingredients
async function updateMenuItemsAvailability(ingredientId) {
  try {
    // Find all menu items that use this ingredient
    const menuItems = await MenuItem.find({ ingredients: ingredientId }).populate('ingredients');
    
    for (const item of menuItems) {
      let available = true;
      let unavailableIngredients = [];
      
      // Check if all ingredients are available
      for (const ing of item.ingredients) {
        if (!ing.isAvailable || ing.stock <= 0) {
          available = false;
          unavailableIngredients.push(ing.name);
        }
      }
      
      // Update menu item availability
      item.available = available;
      item.unavailableReason = available 
        ? '' 
        : `Out of stock: ${unavailableIngredients.join(', ')}`;
      await item.save();
    }
  } catch (error) {
    console.error('Error updating menu items:', error);
  }
}

// PUT - Update ingredient
export async function PUT(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGO_URL);
    }

    const { id } = params;
    const body = await req.json();
    const { name, stock, unit, lowStockThreshold } = body;

    const ingredient = await Ingredient.findById(id);
    if (!ingredient) {
      return NextResponse.json(
        { success: false, message: "Ingredient not found" },
        { status: 404 }
      );
    }

    const shop = await Shop.findById(ingredient.shopId);
    if (!shop || shop.email !== session.user.email) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 403 }
      );
    }

    // Update ingredient
    const updatedIngredient = await Ingredient.findByIdAndUpdate(
      id,
      {
        name: name || ingredient.name,
        stock: stock !== undefined ? parseFloat(stock) : ingredient.stock,
        unit: unit || ingredient.unit,
        lowStockThreshold: lowStockThreshold !== undefined ? parseFloat(lowStockThreshold) : ingredient.lowStockThreshold,
        isAvailable: (stock !== undefined ? parseFloat(stock) : ingredient.stock) > 0
      },
      { new: true, runValidators: true }
    );

    // Update menu items that use this ingredient
    await updateMenuItemsAvailability(id);

    return NextResponse.json({
      success: true,
      message: "Ingredient updated successfully",
      ingredient: updatedIngredient
    });

  } catch (error) {
    console.error("Error updating ingredient:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

// DELETE - Delete ingredient
export async function DELETE(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGO_URL);
    }

    const { id } = params;

    const ingredient = await Ingredient.findById(id);
    if (!ingredient) {
      return NextResponse.json(
        { success: false, message: "Ingredient not found" },
        { status: 404 }
      );
    }

    const shop = await Shop.findById(ingredient.shopId);
    if (!shop || shop.email !== session.user.email) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 403 }
      );
    }

    // Check if ingredient is used in any menu items
    const menuItemsUsingIngredient = await MenuItem.find({ ingredients: id });
    if (menuItemsUsingIngredient.length > 0) {
      return NextResponse.json(
        { 
          success: false, 
          message: `Cannot delete. This ingredient is used in ${menuItemsUsingIngredient.length} menu item(s)` 
        },
        { status: 400 }
      );
    }

    await Ingredient.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: "Ingredient deleted successfully"
    });

  } catch (error) {
    console.error("Error deleting ingredient:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

// PATCH - Quick stock update (increment/decrement)
export async function PATCH(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGO_URL);
    }

    const { id } = params;
    const body = await req.json();
    const { operation, amount } = body; // operation: 'add' or 'subtract'

    const ingredient = await Ingredient.findById(id);
    if (!ingredient) {
      return NextResponse.json(
        { success: false, message: "Ingredient not found" },
        { status: 404 }
      );
    }

    const shop = await Shop.findById(ingredient.shopId);
    if (!shop || shop.email !== session.user.email) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 403 }
      );
    }

    let newStock = ingredient.stock;
    if (operation === 'add') {
      newStock += parseFloat(amount || 1);
    } else if (operation === 'subtract') {
      newStock = Math.max(0, newStock - parseFloat(amount || 1));
    }

    const updatedIngredient = await Ingredient.findByIdAndUpdate(
      id,
      { 
        stock: newStock,
        isAvailable: newStock > 0
      },
      { new: true }
    );

    // Update menu items that use this ingredient
    await updateMenuItemsAvailability(id);

    return NextResponse.json({
      success: true,
      message: "Stock updated successfully",
      ingredient: updatedIngredient
    });

  } catch (error) {
    console.error("Error updating stock:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}