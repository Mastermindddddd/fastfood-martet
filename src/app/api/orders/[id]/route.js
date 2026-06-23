// app/api/orders/[id]/route.js
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Order from "@/models/Order";
import Shop from "@/models/Shop";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const VALID_STATUSES = ["pending", "confirmed", "preparing", "ready", "completed", "cancelled"];

async function connectDB() {
  if (mongoose.connection.readyState !== 1) {
    await mongoose.connect(process.env.MONGO_URL);
  }
}

// GET /api/orders/[id]  — fetch a single order
export async function GET(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const order = await Order.findById(params.id).lean();
    if (!order) {
      return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });
    }

    // Only the customer who placed it OR the shop owner may read it
    const isOwner = order.userEmail === session.user.email;
    let isShopOwner = false;
    if (order.shopId) {
      const shop = await Shop.findById(order.shopId).lean();
      isShopOwner = shop?.email === session.user.email;
    }

    if (!isOwner && !isShopOwner) {
      return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error("GET /api/orders/[id] error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

// PATCH /api/orders/[id]  — update order status (shop owner only)
export async function PATCH(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const order = await Order.findById(params.id);
    if (!order) {
      return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });
    }

    // Verify the caller owns the shop this order belongs to
    if (!order.shopId) {
      return NextResponse.json({ success: false, message: "Order has no associated shop" }, { status: 400 });
    }

    const shop = await Shop.findById(order.shopId);
    if (!shop || shop.email !== session.user.email) {
      return NextResponse.json({ success: false, message: "Forbidden — you do not own this shop" }, { status: 403 });
    }

    const body = await req.json();
    const { status } = body;

    if (!status || !VALID_STATUSES.includes(status)) {
      return NextResponse.json(
        { success: false, message: `Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}` },
        { status: 400 }
      );
    }

    // Prevent moving backwards (optional guard)
    const statusOrder = VALID_STATUSES.indexOf(status);
    const currentOrder = VALID_STATUSES.indexOf(order.status);
    if (statusOrder < currentOrder && status !== "cancelled") {
      return NextResponse.json(
        { success: false, message: "Cannot move order to a previous status" },
        { status: 400 }
      );
    }

    order.status = status;
    order.updatedAt = new Date();
    await order.save();

    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error("PATCH /api/orders/[id] error:", error);
    return NextResponse.json({ success: false, message: "Server error: " + error.message }, { status: 500 });
  }
}

// DELETE /api/orders/[id]  — cancel / remove an order
export async function DELETE(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const order = await Order.findById(params.id);
    if (!order) {
      return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });
    }

    // Only the customer who placed it may delete (cancel) it
    if (order.userEmail !== session.user.email) {
      return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
    }

    // Only allow deletion if it hasn't started being prepared
    if (["preparing", "ready", "completed"].includes(order.status)) {
      return NextResponse.json(
        { success: false, message: "Order cannot be cancelled once preparation has started" },
        { status: 400 }
      );
    }

    await Order.findByIdAndDelete(params.id);
    return NextResponse.json({ success: true, message: "Order deleted" });
  } catch (error) {
    console.error("DELETE /api/orders/[id] error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}