import { NextResponse } from "next/server";
import { User } from "@/models/User";
import bcrypt from "bcrypt";
import mongoose from "mongoose";

export async function POST(req) {
  try {
    const body = await req.json();
    await mongoose.connect(process.env.MONGO_URL);

    const pass = body.password;
    if (!pass || pass.length < 5) {
      throw new Error("Password must be at least 5 characters");
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(pass, salt);

    const createdUser = await User.create({
      ...body,
      password: hashedPassword,
    });

    return NextResponse.json(createdUser, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
