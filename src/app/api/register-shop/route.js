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

    // Validate password
    const { password } = body;
    if (!password?.length || password.length < 5) {
      return Response.json(
        { success: false, message: "Password must be at least 5 characters long" },
        { status: 400 }
      );
    }

    // Check if shop with email already exists
    const existingShop = await Shop.findOne({ email: body.email });
    if (existingShop) {
      return Response.json(
        { success: false, message: "A shop with this email already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    body.password = hashedPassword;

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