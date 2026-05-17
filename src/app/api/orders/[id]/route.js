// app/api/orders/route.js
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Order from "@/models/Order";
import Shop from "@/models/Shop";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// GET - Fetch orders for a shop (owner) or a user (customer)
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
    const userEmail = searchParams.get("userEmail");

    let orders;

    if (shopId) {
      // Shop owner fetching their orders
      const shop = await Shop.findById(shopId);
      if (!shop) {
        return NextResponse.json({ success: false, message: "Shop not found" }, { status: 404 });
      }
      if (shop.email !== session.user.email) {
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
      }
      orders = await Order.find({ shopId }).sort({ createdAt: -1 }).lean();
    } else if (userEmail) {
      // Customer fetching their own orders
      if (userEmail !== session.user.email) {
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
      }
      orders = await Order.find({ userEmail }).sort({ createdAt: -1 }).lean();
    } else {
      return NextResponse.json({ success: false, message: "shopId or userEmail required" }, { status: 400 });
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

    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGO_URL);
    }

    const body = await req.json();
    const { cartProducts, address, shopId, userEmail } = body;

    if (!cartProducts || cartProducts.length === 0) {
      return NextResponse.json({ success: false, message: "Cart is empty" }, { status: 400 });
    }

    const order = await Order.create({
      userEmail: userEmail || session?.user?.email,
      shopId,
      cartProducts,
      status: "pending",
      paid: false,
      ...address,
    });

    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}