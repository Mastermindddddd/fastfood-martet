import Shop from "@/models/Shop";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { uploadToS3 } from "@/libs/s3Upload";

export async function POST(req) {
  try {
    const formData = await req.formData();
    
    // Extract image file if exists
    const imageFile = formData.get('shopImage');
    let shopImageUrl = null;
    
    if (imageFile && imageFile.size > 0) {
      shopImageUrl = await uploadToS3(imageFile, imageFile.name);
    }
    
    // Extract other form data
    const body = {
      businessName: formData.get('businessName'),
      businessType: formData.get('businessType'),
      businessRegistrationNumber: formData.get('businessRegistrationNumber'),
      ownerName: formData.get('ownerName'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      address: formData.get('address'),
      city: formData.get('city'),
      postalCode: formData.get('postalCode'),
      cuisine: formData.get('cuisine'),
      description: formData.get('description'),
      operatingHours: JSON.parse(formData.get('operatingHours')),
      bankName: formData.get('bankName'),
      accountNumber: formData.get('accountNumber'),
      accountHolder: formData.get('accountHolder'),
      shopImage: shopImageUrl,
    };

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