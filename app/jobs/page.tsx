"use client"
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Briefcase, Clock, Coins } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Milestone {
  description: string;
  amount: number;
}

interface Job {
  _id: string;
  title: string;
  category: string;
  createdAt: Date;
  estimatedHours: number;
  description: string;
  milestones: Milestone[];
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch(`/api/job/getall`);
        if (!response.ok) {
          throw new Error('Failed to fetch jobs');
        }
        const data = await response.json();
        setJobs(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  if (loading) {
    return <div className="text-center py-12 text-gray-400">Loading...</div>;
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Available Jobs</h1>
          <Link 
            href="/" 
            className="text-blue-500 hover:text-blue-400 transition-colors"
          >
            Post a Job
          </Link>
        </div>

        <div className="space-y-6">
          {jobs.map((job) => (
            <Link href={`/jobs/${job._id}`} key={job._id}>
              <Card className="p-6 hover:bg-gray-900/50 transition-colors cursor-pointer border-gray-800">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-semibold mb-2">{job.title}</h2>
                    <Badge variant="secondary" className="mb-2">
                      {job.category}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-400">
                    {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}
                  </div>
                </div>

                <div className="flex items-center gap-6 text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4" />
                    <span>{job.milestones.length} Milestones</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{job.estimatedHours} Hours</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Coins className="w-4 h-4" />
                    <span>
                      {job.milestones.reduce((total, m) => total + m.amount, 0)} ETH
                    </span>
                  </div>
                </div>
              </Card>
            </Link>
          ))}

          {jobs.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              No jobs available at the moment.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}