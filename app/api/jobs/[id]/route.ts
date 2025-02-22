// app/api/jobs/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Job from '@/model/Job';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();

  const { id } = params;

  try {
    const job = await Job.findById(id).populate('milestones');
    if (!job) {
      return NextResponse.json({ message: 'Job not found' }, { status: 404 });
    }
    return NextResponse.json(job, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Server error', error }, { status: 500 });
  }
}