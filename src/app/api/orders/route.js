// app/api/orders/route.js
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Order from "@/models/Order";
import Shop from "@/models/Shop";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// GET - Fetch orders for a shop (owner) or a customer
export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGO_URL);
    }

    const { searchParams } = new URL(req.url);
    const shopId = searchParams.get("shopId");

    let orders;

    if (shopId) {
      // Shop owner fetching their shop's orders — verify ownership first
      const shop = await Shop.findById(shopId);
      if (!shop) {
        return NextResponse.json({ success: false, message: "Shop not found" }, { status: 404 });
      }
      if (shop.email !== session.user.email) {
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
      }
      orders = await Order.find({ shopId }).sort({ createdAt: -1 }).lean();
    } else {
      // Customer always fetches only their own orders
      orders = await Order.find({ userEmail: session.user.email }).sort({ createdAt: -1 }).lean();
    }

    return NextResponse.json({ success: true, orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

// POST - Create a new order
export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGO_URL);
    }

    const body = await req.json();
    const {
      shopId,
      cartProducts,
      paymentMethod,
      notes,
      serviceFee,
      phone,
      streetAddress,
      city,
      postalCode,
      country,
    } = body;

    // Validate cart
    if (!cartProducts || !Array.isArray(cartProducts) || cartProducts.length === 0) {
      return NextResponse.json(
        { success: false, message: "Cart is empty" },
        { status: 400 }
      );
    }

    const orderDoc = {
      userEmail: session.user.email,
      cartProducts: cartProducts.map(item => ({
        _id: item._id || item.id || "",
        name: item.name || "Item",
        price: typeof item.price === "number" ? item.price : parseFloat(item.price) || 0,
        image: item.image || "",
        size: item.size || null,
        extras: item.extras || [],
      })),
      status: "pending",
      paid: false,
      paymentMethod: paymentMethod || "cash",
      notes: notes || "",
      serviceFee: serviceFee || 0,
      phone: phone || "",
      streetAddress: streetAddress || "",
      city: city || "",
      postalCode: postalCode || "",
      country: country || "South Africa",
    };

    // Only attach shopId if valid
    if (shopId && shopId !== "unknown" && mongoose.Types.ObjectId.isValid(shopId)) {
      orderDoc.shopId = shopId;
    }

    const order = await Order.create(orderDoc);

    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { success: false, message: "Server error: " + error.message },
      { status: 500 }
    );
  }
}