import connectDB from '@/lib/mongodb';
import Job from '@/model/Job';
import JobApplication from '@/model/JobApplication';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  await connectDB();

  try {
    const { id, jobId } = await req.json();  

    if (!id) {
      return NextResponse.json({ message: 'Invalid user ID' }, { status: 400 });
    }

    if (!jobId) {
      return NextResponse.json({ message: 'Job ID is required' }, { status: 400 });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return NextResponse.json({ message: 'Job not found' }, { status: 404 });
    }

    const application = new JobApplication({
      job: jobId,
      freelancer: id,
      appliedAt: new Date(),
    });

    await application.save();

    return NextResponse.json({ message: 'Application submitted successfully' }, { status: 201 });
  } catch (error) {
    console.error('Server error', error);
    return NextResponse.json({ message: 'Server error', error }, { status: 500 });
  }
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();
  const { id } = params;

  if (!id) {
    return NextResponse.json({ message: 'Invalid job ID' }, { status: 400 });
  }

  try {
    const applications = await JobApplication.find({ jobId: id }).populate('freelancer');
    return NextResponse.json(applications, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Server error', error }, { status: 500 });
  }
}

