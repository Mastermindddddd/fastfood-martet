import Shop from "@/models/Shop";
import bcrypt from "bcrypt";
import mongoose from "mongoose";

export async function POST(req) {
  try {
    const body = await req.json();
    
    // Connect to MongoDB
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGO_URL);
    }

    // Check if shop with email already exists
    const existingShop = await Shop.findOne({ email: body.email });
    if (existingShop) {
      return Response.json(
        { success: false, message: "A shop with this email already exists" },
        { status: 400 }
      );
    }

    // Create shop
    const createdShop = await Shop.create(body);

    // Return success response
    return Response.json({
      success: true,
      message: "Shop registered successfully",
      shop: {
        id: createdShop._id,
        businessName: createdShop.businessName,
        email: createdShop.email,
        ownerName: createdShop.ownerName
      }
    });

  } catch (error) {
    console.error("Shop registration error:", error);
    return Response.json(
      { 
        success: false, 
        message: error.message || "Registration failed. Please try again." 
      },
      { status: 400 }
    );
  }
}