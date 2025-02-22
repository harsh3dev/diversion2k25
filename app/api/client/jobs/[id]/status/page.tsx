import connectDB from '@/lib/mongodb';
import Job from '@/model/Job';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const job = await Job.findById(id, 'status');
      if (!job) {
        return res.status(404).json({ message: 'Job not found' });
      }
      res.status(200).json({ status: job.status });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 