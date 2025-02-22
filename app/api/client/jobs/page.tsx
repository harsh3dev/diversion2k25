import connectDB from '@/lib/mongodb';
import Job from '@/model/Job';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  if (req.method === 'GET') {
    try {
      // Assuming client ID is available in the request (e.g., from authentication middleware)
      const clientId = req.query.clientId;
      const jobs = await Job.find({ userId: clientId });
      res.status(200).json(jobs);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 