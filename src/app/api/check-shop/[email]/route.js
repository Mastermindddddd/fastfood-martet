import Shop from "@/models/Shop";
import mongoose from "mongoose";

export async function GET(req, { params }) {
  try {
    // Connect to MongoDB if not already connected
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGO_URL);
    }

    // Extract the email parameter from the route
    const { email } = params;

    // Find the shop linked to this email
    const shop = await Shop.findOne({ email });

    // Return response
    return Response.json({
      shopExists: !!shop,
      shop: shop || null
    });

  } catch (error) {
    console.error("Error checking shop by email:", error);
    return Response.json(
      { shopExists: false, message: "Server error. Please try again later." },
      { status: 500 }
    );
  }
}
