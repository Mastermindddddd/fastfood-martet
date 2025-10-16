// app/api/ingredients/route.js
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Ingredient from "@/models/Ingredient";
import MenuItem from "@/models/MenuItem";
import Shop from "@/models/Shop";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// GET - Fetch all ingredients for a shop
export async function GET(req) {
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

    const { searchParams } = new URL(req.url);
    const shopId = searchParams.get("shopId");
    const email = searchParams.get("email");

    let query = {};

    if (shopId) {
      query.shopId = shopId;
    } else if (email) {
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

    const ingredients = await Ingredient.find(query).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      ingredients
    });

  } catch (error) {
    console.error("Error fetching ingredients:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

// POST - Create new ingredient
export async function POST(req) {
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

    const body = await req.json();
    const { shopId, name, stock, unit, lowStockThreshold } = body;

    if (!shopId || !name || stock === undefined || !unit) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    const shop = await Shop.findById(shopId);
    if (!shop) {
      return NextResponse.json(
        { success: false, message: "Shop not found" },
        { status: 404 }
      );
    }

    if (shop.email !== session.user.email) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 403 }
      );
    }

    const ingredient = await Ingredient.create({
      shopId,
      name,
      stock: parseFloat(stock),
      unit,
      lowStockThreshold: lowStockThreshold || 10,
      isAvailable: parseFloat(stock) > 0
    });

    return NextResponse.json({
      success: true,
      message: "Ingredient created successfully",
      ingredient
    });

  } catch (error) {
    console.error("Error creating ingredient:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}