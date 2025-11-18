// app/api/orders/route.js
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Order from "@/models/Order";
import Shop from "@/models/Shop";
import MenuItem from "@/models/MenuItem";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// GET - Fetch user's orders or shop's orders
export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Connect to database
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGO_URL);
    }

    const { searchParams } = new URL(req.url);
    const shopId = searchParams.get("shopId");
    
    let query = {};
    
    if (shopId) {
      // Fetch orders for a specific shop (for shop owners)
      const shop = await Shop.findById(shopId);
      if (!shop || shop.email !== session.user.email) {
        return NextResponse.json(
          { success: false, message: "Unauthorized to view these orders" },
          { status: 403 }
        );
      }
      query.shopId = shopId;
    } else {
      // Fetch orders for the current user
      query.userEmail = session.user.email;
    }

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .limit(100);

    return NextResponse.json({
      success: true,
      orders,
      count: orders.length
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

// POST - Create new order
export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Please sign in to place an order." },
        { status: 401 }
      );
    }

    // Connect to database
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGO_URL);
    }

    const body = await req.json();
    const { 
      shopId, 
      items, 
      deliveryAddress, 
      paymentMethod, 
      notes,
      deliveryFee = 15 
    } = body;

    // Validation
    if (!shopId || !items || items.length === 0) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Verify shop exists
    const shop = await Shop.findById(shopId);
    if (!shop) {
      return NextResponse.json(
        { success: false, message: "Shop not found" },
        { status: 404 }
      );
    }

    // Verify all menu items exist and calculate total
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const menuItem = await MenuItem.findById(item.menuItemId);
      if (!menuItem) {
        return NextResponse.json(
          { success: false, message: `Menu item ${item.name} not found` },
          { status: 404 }
        );
      }

      if (!menuItem.available) {
        return NextResponse.json(
          { success: false, message: `${menuItem.name} is not available` },
          { status: 400 }
        );
      }

      const itemTotal = menuItem.price * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        menuItemId: menuItem._id,
        name: menuItem.name,
        price: menuItem.price,
        quantity: item.quantity
      });
    }

    const total = subtotal + deliveryFee;

    // Create order
    const order = await Order.create({
      userId: session.user.id || session.user.email,
      userEmail: session.user.email,
      shopId: shop._id,
      shopName: shop.businessName,
      items: orderItems,
      subtotal,
      deliveryFee,
      total,
      deliveryAddress: deliveryAddress || {},
      paymentMethod: paymentMethod || 'cash',
      paymentStatus: 'pending',
      status: 'pending',
      notes: notes || ''
    });

    return NextResponse.json({
      success: true,
      message: "Order placed successfully",
      order
    });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

// PUT - Update order status
export async function PUT(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Connect to database
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGO_URL);
    }

    const body = await req.json();
    const { orderId, status } = body;

    if (!orderId || !status) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Find order
    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    // Verify authorization (shop owner can update)
    const shop = await Shop.findById(order.shopId);
    if (!shop || shop.email !== session.user.email) {
      return NextResponse.json(
        { success: false, message: "Unauthorized to update this order" },
        { status: 403 }
      );
    }

    // Update order
    order.status = status;
    await order.save();

    return NextResponse.json({
      success: true,
      message: "Order updated successfully",
      order
    });
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}