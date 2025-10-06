import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { User } from "@/models/User";

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, phone, password } = body;

    if (!name || !email || !phone || !password) {
      return Response.json({ message: "All fields are required" }, { status: 400 });
    }

    if (password.length < 5) {
      return Response.json({ message: "Password must be at least 5 characters" }, { status: 400 });
    }

    await mongoose.connect(process.env.MONGO_URL);

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return Response.json({ message: "Email already registered" }, { status: 400 });
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const createdUser = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
    });

    return Response.json({ success: true, user: createdUser }, { status: 201 });
  } catch (error) {
    console.error(error);
    return Response.json({ message: "Server error", error: error.message }, { status: 500 });
  }
}
