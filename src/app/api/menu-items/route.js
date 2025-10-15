// app/api/menu-items/route.js
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import MenuItem from "@/models/MenuItem";
import Shop from "@/models/Shop";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// GET - Fetch all menu items for a shop
export async function GET(req) {
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

    // Get shopId from query params
    const { searchParams } = new URL(req.url);
    const shopId = searchParams.get("shopId");
    const email = searchParams.get("email");

    let query = {};

    if (shopId) {
      query.shopId = shopId;
    } else if (email) {
      // Find shop by email first
      const shop = await Shop.findOne({ email });
      if (!shop) {
        return NextResponse.json(
          { success: false, message: "Shop not found" },
          { status: 404 }
        );
      }
      query.shopId = shop._id;
    } else {
      return NextResponse.json(
        { success: false, message: "shopId or email is required" },
        { status: 400 }
      );
    }

    // Fetch menu items
    const menuItems = await MenuItem.find(query).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      menuItems
    });

  } catch (error) {
    console.error("Error fetching menu items:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

// POST - Create new menu item
export async function POST(req) {
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

    const body = await req.json();
    const { shopId, name, price, category, description, available } = body;

    // Validation
    if (!shopId || !name || !price || !category) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Verify shop exists and belongs to user
    const shop = await Shop.findById(shopId);
    if (!shop) {
      return NextResponse.json(
        { success: false, message: "Shop not found" },
        { status: 404 }
      );
    }

    if (shop.email !== session.user.email) {
      return NextResponse.json(
        { success: false, message: "Unauthorized to modify this shop" },
        { status: 403 }
      );
    }

    // Create menu item
    const menuItem = await MenuItem.create({
      shopId,
      name,
      price: parseFloat(price),
      category,
      description: description || '',
      available: available !== undefined ? available : true
    });

    return NextResponse.json({
      success: true,
      message: "Menu item created successfully",
      menuItem
    });

  } catch (error) {
    console.error("Error creating menu item:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}