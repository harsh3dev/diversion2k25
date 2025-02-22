import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import FreelancerProfile from '@/model/FreelancerProfile';


export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    await connectDB();
  const { id } = params;

  try {
    const freelancer = await FreelancerProfile.findOne({ id });

    if (!freelancer) {
      return NextResponse.json({ message: 'Freelancer not found' }, { status: 404 });
    }

    return NextResponse.json(freelancer, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching freelancer' }, { status: 500 });
  }
}

export async function POST() {
  return NextResponse.json(
    { message: 'Method POST Not Allowed' },
    { status: 405, headers: { Allow: 'GET' } }
  );
}
