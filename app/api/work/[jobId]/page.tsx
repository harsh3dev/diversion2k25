import connectDB from '@/lib/mongodb';
import Deliverable from '@/model/Deliverable';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  const { jobId } = req.query;

  if (req.method === 'GET') {
    try {
      const deliverables = await Deliverable.find({ jobId });
      res.status(200).json(deliverables);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 