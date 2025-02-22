import Job from "@/model/Job";
import connectDB from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();

  if (params.id) {
    const job = await Job.findById(params.id);
    if (!job) {
      return new Response('Job not found', { status: 404 });
    }
    return new Response(JSON.stringify(job), { status: 200 });
  } else {
    const jobs = await Job.find();
    return new Response(JSON.stringify(jobs), { status: 200 });
  }
}

export async function POST(req: NextRequest) {
    await connectDB();
  
    const body = await req.json();
    const { category, title, description, milestones, estimatedHours, userId } = body;
  
    try {
      const newJob = new Job({
        category,
        title,
        description,
        milestones,
        estimatedHours,
        userId,
      });
      await newJob.save();
      return new Response(JSON.stringify(newJob), { status: 201 });
    } catch (error) {
      return new Response('Failed to create job', { status: 400 });
    }
  }

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();

  const body = await req.json();
  const { category, title, description, milestones, estimatedHours } = body;

  try {
    const updatedJob = await Job.findByIdAndUpdate(
      params.id,
      { category, title, description, milestones, estimatedHours },
      { new: true }
    );
    if (!updatedJob) {
      return new Response('Job not found', { status: 404 });
    }
    return new Response(JSON.stringify(updatedJob), { status: 200 });
  } catch (error) {
    return new Response('Failed to update job', { status: 400 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();

  try {
    const deletedJob = await Job.findByIdAndDelete(params.id);
    if (!deletedJob) {
      return new Response('Job not found', { status: 404 });
    }
    return new Response('Job deleted', { status: 200 });
  } catch (error) {
    return new Response('Failed to delete job', { status: 400 });
  }
}