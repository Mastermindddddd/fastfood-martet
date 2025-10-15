import Shop from "@/models/Shop";
import mongoose from "mongoose";

export async function GET(req) {
  try {
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGO_URL);
    }

    // Extract email from query parameters
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return Response.json(
        { shopExists: false, message: "Email is required" },
        { status: 400 }
      );
    }

    const shop = await Shop.findOne({ email });

    return Response.json({
      shopExists: !!shop,
      shop: shop || null,
    });
  } catch (error) {
    console.error("Error checking shop by email:", error);
    return Response.json(
      { shopExists: false, message: "Server error. Please try again later." },
      { status: 500 }
    );
  }
}