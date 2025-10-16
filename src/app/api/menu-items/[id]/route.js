// app/api/menu-items/[id]/route.js
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import MenuItem from "@/models/MenuItem";
import Ingredient from "@/models/Ingredient";
import Shop from "@/models/Shop";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// Helper function to check ingredient availability
async function checkIngredientAvailability(ingredientIds) {
  const ingredients = await Ingredient.find({ _id: { $in: ingredientIds } });
  const unavailableIngredients = ingredients.filter(ing => !ing.isAvailable || ing.stock <= 0);
  return {
    available: unavailableIngredients.length === 0,
    unavailableIngredients: unavailableIngredients.map(ing => ing.name)
  };
}

// PUT - Update menu item
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
    const { name, price, category, description, ingredients } = body;

    const menuItem = await MenuItem.findById(id);
    if (!menuItem) {
      return NextResponse.json(
        { success: false, message: "Menu item not found" },
        { status: 404 }
      );
    }

    const shop = await Shop.findById(menuItem.shopId);
    if (!shop || shop.email !== session.user.email) {
      return NextResponse.json(
        { success: false, message: "Unauthorized to modify this item" },
        { status: 403 }
      );
    }

    // Check ingredient availability if ingredients are updated
    let available = menuItem.available;
    let unavailableReason = menuItem.unavailableReason;
    
    const updatedIngredients = ingredients !== undefined ? ingredients : menuItem.ingredients;
    if (updatedIngredients && updatedIngredients.length > 0) {
      const availabilityCheck = await checkIngredientAvailability(updatedIngredients);
      available = availabilityCheck.available;
      if (!available) {
        unavailableReason = `Out of stock: ${availabilityCheck.unavailableIngredients.join(', ')}`;
      } else {
        unavailableReason = '';
      }
    }

    // Update menu item
    const updatedItem = await MenuItem.findByIdAndUpdate(
      id,
      {
        name: name || menuItem.name,
        price: price !== undefined ? parseFloat(price) : menuItem.price,
        category: category || menuItem.category,
        description: description !== undefined ? description : menuItem.description,
        ingredients: updatedIngredients,
        available,
        unavailableReason
      },
      { new: true, runValidators: true }
    ).populate('ingredients');

    return NextResponse.json({
      success: true,
      message: "Menu item updated successfully",
      menuItem: updatedItem
    });

  } catch (error) {
    console.error("Error updating menu item:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

// DELETE - Delete menu item
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

    const menuItem = await MenuItem.findById(id);
    if (!menuItem) {
      return NextResponse.json(
        { success: false, message: "Menu item not found" },
        { status: 404 }
      );
    }

    const shop = await Shop.findById(menuItem.shopId);
    if (!shop || shop.email !== session.user.email) {
      return NextResponse.json(
        { success: false, message: "Unauthorized to delete this item" },
        { status: 403 }
      );
    }

    await MenuItem.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: "Menu item deleted successfully"
    });

  } catch (error) {
    console.error("Error deleting menu item:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

// PATCH - Toggle availability or refresh based on ingredients
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
    const { action } = body; // 'toggle' or 'refresh'

    const menuItem = await MenuItem.findById(id).populate('ingredients');
    if (!menuItem) {
      return NextResponse.json(
        { success: false, message: "Menu item not found" },
        { status: 404 }
      );
    }

    const shop = await Shop.findById(menuItem.shopId);
    if (!shop || shop.email !== session.user.email) {
      return NextResponse.json(
        { success: false, message: "Unauthorized to modify this item" },
        { status: 403 }
      );
    }

    let available = menuItem.available;
    let unavailableReason = menuItem.unavailableReason;

    if (action === 'refresh' && menuItem.ingredients.length > 0) {
      // Check ingredient availability
      const availabilityCheck = await checkIngredientAvailability(
        menuItem.ingredients.map(ing => ing._id)
      );
      available = availabilityCheck.available;
      unavailableReason = available 
        ? '' 
        : `Out of stock: ${availabilityCheck.unavailableIngredients.join(', ')}`;
    } else {
      // Manual toggle (only if no ingredient issues)
      if (menuItem.ingredients.length > 0) {
        const availabilityCheck = await checkIngredientAvailability(
          menuItem.ingredients.map(ing => ing._id)
        );
        if (!availabilityCheck.available) {
          return NextResponse.json({
            success: false,
            message: `Cannot enable: ${availabilityCheck.unavailableIngredients.join(', ')} out of stock`
          }, { status: 400 });
        }
      }
      available = !menuItem.available;
      unavailableReason = '';
    }

    const updatedItem = await MenuItem.findByIdAndUpdate(
      id,
      { available, unavailableReason },
      { new: true }
    ).populate('ingredients');

    return NextResponse.json({
      success: true,
      message: "Availability updated successfully",
      menuItem: updatedItem
    });

  } catch (error) {
    console.error("Error updating availability:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}