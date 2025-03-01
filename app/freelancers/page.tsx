"use client";

import { useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Users, Calendar, Target } from "lucide-react";
import { formatDate, formatAmount } from "@/lib/utils/format";
import Link from "next/link";
import { useEffect, useState } from "react";


const statusColors = {
  not_started: "bg-slate-500",
  ongoing: "bg-blue-500",
  completed: "bg-green-500",
  disputed: "bg-red-500",
  past: "bg-purple-500",
};

interface Job {
  _id: string;
  title: string;
  category: string;
  status: string;
  createdAt: string;
  applicantsCount: number;
  milestones: { length: number }[];
  totalAmount: number;
}
export const mockJobs = [
  {
    _id: '1',
    title: 'Web Developer',
    category: 'Development',
    status: 'applied',
    createdAt: '2023-01-01T00:00:00Z',
    applicantsCount: 5,
    milestones: [{ length: 3 }],
    totalAmount: 5000,
  },
  {
    _id: '2',
    title: 'Graphic Designer',
    category: 'Design',
    status: 'applied',
    createdAt: '2023-02-01T00:00:00Z',
    applicantsCount: 3,
    milestones: [{ length: 2 }],
    totalAmount: 3000,
  },
  {
    _id: '3',
    title: 'Content Writer',
    category: 'Writing',
    status: 'applied',
    createdAt: '2023-03-01T00:00:00Z',
    applicantsCount: 7,
    milestones: [{ length: 4 }],
    totalAmount: 2000,
  },
  {
    _id: '4',
    title: 'SEO Specialist',
    category: 'Marketing',
    status: 'applied',
    createdAt: '2023-04-01T00:00:00Z',
    applicantsCount: 2,
    milestones: [{ length: 1 }],
    totalAmount: 1500,
  },
];
export default function DashboardPage() {
  const searchParams = useSearchParams();
  const [jobs, setJobs] = useState<Job[]>(mockJobs);
  const currentStatus = searchParams.get("status") || "applied";

  // const fetchJobs = async () => {
  //   const user = JSON.parse(localStorage.getItem('user') || '{}');
  //   const id = user.id;
  //   if (!id) return;
  //   const res = await fetch(`/api/freelancers/${id}/alljob`);
  //   const data = await res.json();
  //   setJobs(data);
  // };

  // useEffect(() => {
  //   fetchJobs();
  // }, []);

  // Filter jobs based on status


  const filteredJobs = jobs?.filter((job) => job.status === currentStatus);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
          Applied Jobs
        </h1>
      </div>

      {filteredJobs.length === 0 ? (
        <Card className="p-6 text-center text-muted-foreground">
          No jobs found in this category.
        </Card>
      ) : (
        <div className="grid gap-6">
          {filteredJobs.map((job) => (
            <Link href={`/freelancers/dashboard/${job._id}`} key={job._id}>
              <Card className="p-6 hover:shadow-lg transition-shadow duration-200 bg-card/50 backdrop-blur-sm border-slate-800/50 hover:border-slate-700">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {job.category}
                      </Badge>
                      <Badge
                        className={`${
                          statusColors[job.status as keyof typeof statusColors || "not_started"]
                        } text-blue-500 capitalize bg-slate-500`}
                      >
                        {(job.status || "not_started").replace("_", " ")}
                      </Badge>
                    </div>
                    <h2 className="text-xl font-semibold">{job.title}</h2>
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>{job.applicantsCount} Applicants</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4" />
                      <span>{job.milestones.length} Milestones</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(new Date(job.createdAt))}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4" />
                      <span>{formatAmount(job.totalAmount ?? 0)}</span>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}