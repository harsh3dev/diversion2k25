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

const SkillSchema = new Schema({ name: { type: String, required: true } });

const FreelancerProfileSchema = new Schema({
  name: { type: String, required: true },
  imageUrl: { type: String },
  trustTokens: { type: Number, default: 0 },
  about: { type: String },
  skills: [{ type: Schema.Types.ObjectId, ref: "Skill" }],
  completedJobs: { type: Number, default: 0 },
  successRate: { type: Number, default: 0 },
  location: { type: String },
  hourlyRate: { type: Number },
  languages: [{ type: String }],
  githubUrl: { type: String },
  linkedinUrl: { type: String },
  walletaddress: { type: String },
});

const Skill = models.Skill || model("Skill", SkillSchema);
const Freelancer = models.Freelancer || model("Freelancer", FreelancerProfileSchema);

export async function GET() {
  try {
    await connectDB();
    const freelancers = await Freelancer.find({}).populate("skills");
    return NextResponse.json({ success: true, data: freelancers });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const data = await request.json();
    const newFreelancer = new Freelancer(data);
    await newFreelancer.save();
    return NextResponse.json({ success: true, data: newFreelancer });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}