import connectDB from "@/lib/mongodb";
import User from "@/model/user";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export const GET = async (request: NextRequest) => {
  await connectDB();
  const allUsers = await User.find();
  return NextResponse.json(allUsers);
};

export const POST = async (request: NextRequest) => {
  await connectDB();

  const body = await request.json();
  const { username, email, password } = body;

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ username, email, password: hashedPassword });
  await newUser.save();

  return NextResponse.json({ username, email });
};

export const login = async (request: NextRequest) => {
  await connectDB();

  const body = await request.json();
  const { username, password } = body;

  const user = await User.findOne({ username });
  if (!user) {
    return new Response("User not found", { status: 404 });
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return new Response("Invalid credentials", { status: 401 });
  }

  return NextResponse.json({ id: user._id, username: user.username, email: user.email });
};
