import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Job from '@/model/Job'; 

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();
  const { id } = params;

  try {
 
    const jobs = await Job.find({ freelancerJobId: id });

    if (!jobs || jobs.length === 0) {
      return NextResponse.json({ message: 'No jobs found for the freelancer' }, { status: 200 });
    }

    return NextResponse.json(jobs, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching jobs' }, { status: 500 });
  }
}
