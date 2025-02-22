import connectDB from '@/lib/mongodb';
import Deliverable from '@/model/Deliverable';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  const { jobId } = req.query;

  if (req.method === 'POST') {
    try {
      // Assuming approval logic involves updating the deliverable status
      const deliverables = await Deliverable.updateMany({ jobId }, { status: 'approved' });
      res.status(200).json({ message: 'Work approved successfully', deliverables });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 