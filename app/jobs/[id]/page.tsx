"use client";
"use client";
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Briefcase, Clock, Coins, ArrowLeft } from 'lucide-react';
import { mockJobs } from '@/lib/mockData';
import JobDescription from './job-description';
import { useEffect, useState } from 'react';
import { useParams } from "next/navigation";
import { toast } from 'react-toastify';

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
  status: string;
}

export default function JobDetailsPage() {
  const { id } = useParams();
  const [job, setJob] = useState<Job | null>(null);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [userId, setUserId] = useState<string>(''); 
  const [hasApplied, setHasApplied] = useState<boolean>(false);
  const [applicant, setApplicant] = useState<string | null>(null);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await fetch(`/api/jobs/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch job');
        }
        const data = await response.json();
        setJob(data);
        const totalAmount = data.milestones.reduce((total: number, m: Milestone) => total + m.amount, 0);
        setTotalAmount(totalAmount);
      } catch (error) {
        console.error('Error fetching job:', error);
      }
    };

    fetchJob();
  }, [id]);

  const handleApply = async () => {
    const user = JSON.parse(localStorage.getItem('user') || ""); // Parse the user from localStorage
    if (!user) {
      console.log("User not found");
      return;
    }
    try {
      const response = await fetch(`/api/jobs/${id}/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ // Ensure body is a JSON string
          id: user.id,
          jobId: id
        }),
      });
  
      if (response.ok) {
        setHasApplied(true); // Update the state to reflect the application
        setApplicant(user.id); // Set the current applicant
        setJob((prevJob) => prevJob ? { ...prevJob, status: 'ongoing' } : null); // Update job status
      } else {
        console.log("")
      }
    } catch (error) {
      console.error("Error submitting application", error);
    }
    toast.success('Application submitted successfully');
  };
  

  if (!job) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Link 
          href="/jobs" 
          className="inline-flex items-center text-gray-400 hover:text-white mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Jobs
        </Link>

        <div className="space-y-8">
          <div>
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold mb-4">{job.title}</h1>
                <Badge variant="secondary" className="mb-4">
                  {job.category}
                </Badge>
              </div>
              <div className="text-sm text-gray-400">
                Posted {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}
              </div>
            </div>

            <div className="flex items-center gap-6 text-gray-400">
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
                <span>{totalAmount} APT</span>
              </div>
            </div>
          </div>

          <Card className="p-6 border-gray-800">
            <h2 className="text-xl font-semibold mb-4">Project Description</h2>
            <JobDescription description={job.description} />
          </Card>

          <Card className="p-6 border-gray-800">
            <h2 className="text-xl font-semibold mb-6">Milestones</h2>
            <div className="space-y-6">
              {job.milestones.map((milestone, index) => (
                <div 
                  key={index}
                  className="flex items-start justify-between p-4 rounded-lg bg-gray-900/50"
                >
                  <div className="flex-1">
                    <h3 className="font-medium mb-2">Milestone {index + 1}</h3>
                    <p className="text-gray-400">{milestone.description}</p>
                  </div>
                  <div className="ml-4 flex items-center text-green-400">
                    <Coins className="w-4 h-4 mr-2" />
                    <span>{milestone.amount} ETH</span>
                  </div>
                </div>
              ))}
            </div>
          
          </Card>

          <div className="flex justify-center">
            <Button size="lg" className="glow-effect" onClick={handleApply} disabled={hasApplied}>
              {hasApplied ? 'Applied' : 'Apply for this Job'}
            </Button>
          </div>

          {applicant && (
            <div className="flex justify-center">
              <p className="text-green-400">Current Applicant: {applicant}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}