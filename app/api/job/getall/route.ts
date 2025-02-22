import Job from "@/model/Job";
import connectDB from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  await connectDB();

  try {
    const jobs = await Job.find();
    return new Response(JSON.stringify(jobs), { status: 200 });
  } catch (error) {
    return new Response('Failed to fetch jobs', { status: 500 });
  }
}