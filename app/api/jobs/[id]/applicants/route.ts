import connectDB from '@/lib/mongodb';
import JobApplication from '@/model/JobApplication';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const applications = await JobApplication.find({ jobId: id }).populate('freelancer');
      res.status(200).json(applications);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 