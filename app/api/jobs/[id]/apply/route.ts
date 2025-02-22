import connectDB from '@/lib/mongodb';
import Job from '@/model/Job';
import JobApplication from '@/model/JobApplication';
import { NextApiRequest, NextApiResponse } from 'next';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  const { id } = req.query;

  if (req.method === 'POST') {
    const { coverLetter, userId } = req.body;

    if (!coverLetter || !userId) {
      return res.status(400).json({ message: 'Cover letter and user ID are required' });
    }

    try {
      const job = await Job.findById(id);
      if (!job) {
        return res.status(404).json({ message: 'Job not found' });
      }

      const application = new JobApplication({
        freelancer: userId,
        appliedAt: new Date(),
        coverLetter,
        proposedAmount: 0, // Assuming proposedAmount is handled elsewhere
        estimatedDuration: '', // Assuming estimatedDuration is handled elsewhere
      });

      await application.save();

      res.status(201).json({ message: 'Application submitted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 