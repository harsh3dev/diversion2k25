import { NextResponse } from "next/server";
import mongoose, { Schema, model, models } from "mongoose";
import connectDB from "@/lib/mongodb"
const MONGODB_URI = process.env.MONGODB_URI || "";
let isConnected = false;


const ClientSchema = new Schema({
  name: { type: String, required: true },
  company: { type: String, required: true },
  projectsPosted: { type: Number, default: 0 },
  completedProjects: { type: Number, default: 0 },
  trustScore: { type: Number, default: 0 },
  location: { type: String, required: true },
  industry: { type: String, required: true },
  website: { type: String },
  about: { type: String, required: true },
  linkedinUrl: { type: String },
  walletAddress: { type: String, required: true, default: "" },
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
    console.log(data, data)
    const newClient = new Client(data);
    await newClient.save();
    return NextResponse.json({ success: true, data: newClient });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}