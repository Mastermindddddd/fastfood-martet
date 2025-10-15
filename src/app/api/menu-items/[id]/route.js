// app/api/menu-items/[id]/route.js
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import MenuItem from "@/models/MenuItem";
import Shop from "@/models/Shop";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

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

    // Connect to database
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGO_URL);
    }

    const { id } = params;
    const body = await req.json();
    const { name, price, category, description, available } = body;

    // Find menu item
    const menuItem = await MenuItem.findById(id);
    if (!menuItem) {
      return NextResponse.json(
        { success: false, message: "Menu item not found" },
        { status: 404 }
      );
    }

    // Verify ownership
    const shop = await Shop.findById(menuItem.shopId);
    if (!shop || shop.email !== session.user.email) {
      return NextResponse.json(
        { success: false, message: "Unauthorized to modify this item" },
        { status: 403 }
      );
    }

    // Update menu item
    const updatedItem = await MenuItem.findByIdAndUpdate(
      id,
      {
        name: name || menuItem.name,
        price: price !== undefined ? parseFloat(price) : menuItem.price,
        category: category || menuItem.category,
        description: description !== undefined ? description : menuItem.description,
        available: available !== undefined ? available : menuItem.available
      },
      { new: true, runValidators: true }
    );

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

    // Connect to database
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGO_URL);
    }

    const { id } = params;

    // Find menu item
    const menuItem = await MenuItem.findById(id);
    if (!menuItem) {
      return NextResponse.json(
        { success: false, message: "Menu item not found" },
        { status: 404 }
      );
    }

    // Verify ownership
    const shop = await Shop.findById(menuItem.shopId);
    if (!shop || shop.email !== session.user.email) {
      return NextResponse.json(
        { success: false, message: "Unauthorized to delete this item" },
        { status: 403 }
      );
    }

    // Delete menu item
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

// PATCH - Toggle availability (quick update)
export async function PATCH(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Connect to database
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGO_URL);
    }

    const { id } = params;
    const body = await req.json();
    const { available } = body;

    // Find menu item
    const menuItem = await MenuItem.findById(id);
    if (!menuItem) {
      return NextResponse.json(
        { success: false, message: "Menu item not found" },
        { status: 404 }
      );
    }

    // Verify ownership
    const shop = await Shop.findById(menuItem.shopId);
    if (!shop || shop.email !== session.user.email) {
      return NextResponse.json(
        { success: false, message: "Unauthorized to modify this item" },
        { status: 403 }
      );
    }

    // Toggle or set availability
    const updatedItem = await MenuItem.findByIdAndUpdate(
      id,
      { available: available !== undefined ? available : !menuItem.available },
      { new: true }
    );

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