// app/api/shops/route.js
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Shop from "@/models/Shop";

// GET - Fetch all shops
export async function GET(req) {
  try {
    // Connect to database
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGO_URL);
    }

    // Fetch all shops
    const shops = await Shop.find({}).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      shops,
      count: shops.length
    });
  } catch (error) {
    console.error("Error fetching shops:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

