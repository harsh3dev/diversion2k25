import connectDB from '@/lib/mongodb';
import Job from '@/model/Job';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();
  const { id } = params;

  if (!id) {
    return NextResponse.json({ message: 'Invalid job ID' }, { status: 400 });
  }

  try {
    const jobs = await Job.find({ userId: id });
    return NextResponse.json(jobs, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Server error', error }, { status: 500 });
  }
}

