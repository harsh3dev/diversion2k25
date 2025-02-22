import { NextResponse } from "next/server";
import mongoose, { Schema, model, models } from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "";
let isConnected = false;

async function connectDB() {
  if (isConnected) return;
  try {
    await mongoose.connect(MONGODB_URI);
    isConnected = true;
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
}

const ClientSchema = new Schema({
  name: { type: String, required: true },
  company: { type: String },
  projectsPosted: { type: Number, default: 0 },
  completedProjects: { type: Number, default: 0 },
  trustScore: { type: Number, default: 0 },
  location: { type: String },
  industry: { type: String },
  website: { type: String },
  about: { type: String },
  linkedinUrl: { type: String },
  walletaddress: { type: String },
});

const Client = models.Client || model("Client", ClientSchema);

export async function GET() {
  try {
    await connectDB();
    const clients = await Client.find({});
    return NextResponse.json({ success: true, data: clients });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const data = await request.json();
    const newClient = new Client(data);
    await newClient.save();
    return NextResponse.json({ success: true, data: newClient });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}