"use client";

import { useParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { formatAmount, formatDate } from "@/lib/utils/format";
import Markdown from "react-markdown";
import { ArrowLeft, FileText, Image, Code, File, AlertTriangle, CheckCircle, XCircle, DollarSign, Clock, Star, MapPin } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { AcceptingorRejecting } from "@/components/accept";
import { mockJobs } from "@/lib/mockData"
import {useRouter} from "next/navigation"
import { useProject } from "@/app/hooks/useProject";
import {toast } from "react-toastify"
const statusColors = {
  not_started: "bg-slate-600",
  ongoing: "bg-blue-600",
  completed: "bg-emerald-600",
  disputed: "bg-red-600",
};

const deliverableTypeIcons: { [key: string]: any } = {
  document: FileText,
  image: Image,
  code: Code,
  other: File,
};

interface Milestone {
  id: string;
  description: string;
  status: string;
  amount: number;
  deliverables: {
    id: string;
    name: string;
    type: string;
    url: string;
    uploadedAt: string;
  }[];
}

interface Job {
  _id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  createdAt: string;
  applicantsCount: number;
  totalAmount: number;
  milestones: Milestone[];
}

interface Application {
  id: string;
  freelancer: {
    id: string;
    name: string;
    imageUrl: string;
    location: string;
    trustTokens: number;
  };
  appliedAt: string;
  coverLetter: string;
  proposedAmount: number;
  estimatedDuration: string;
}

export default function JobDetailsPage() {
  const { id } = useParams();
  const [job, setJob] = useState<Job | null | undefined>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const router = useRouter();
  const {createProject, loading, error} = useProject();


  useEffect(() => {
    const fetchJobDetails = async () => {
      const jobData = mockJobs.find((j) => j._id === id);
      if(!jobData) return;
      setJob(jobData);
    };

    const fetchJobApplications = async () => {
      const response = await fetch(`/api/jobs/${id}/apply`);
      if (!response.ok) {
        console.log("Error occurred while fetching job applications");
        return;
      }
      const applicationsData: any[] = await response.json();
      const formattedApplications = applicationsData.map((app) => ({
        id: app._id,
        freelancer: {
          id: app.freelancer._id,
          name: app.freelancer.username,
          imageUrl: '', // Add imageUrl if available
          location: '', // Add location if available
          trustTokens: 0, // Add trustTokens if available
        },
        appliedAt: app.appliedAt,
        coverLetter: '', // Add coverLetter if available
        proposedAmount: 0, // Add proposedAmount if available
        estimatedDuration: '', // Add estimatedDuration if available
      }));
      setApplications(formattedApplications);
    };

    fetchJobDetails();
    fetchJobApplications();
  }, [id]);

  if (!job) {
    return <div>Loading</div>;
  }



  const calculateMilestoneProgress = () => {
    const completed = job.milestones.filter(
      (m) => m.status === "completed"
    ).length;
    return (completed / job.milestones.length) * 100;
  };

  const handleMarkAsCompleted = (milestoneId: string) => {
    console.log('Mark as completed:', milestoneId);
    // Implement completion logic
  };

  const handleRequestChanges = (milestoneId: string) => {
    console.log('Request changes:', milestoneId);
    // Implement change request logic
  };

  const handleRaiseDispute = async (milestoneId: string) => {
    console.log('Raise dispute:', milestoneId);
    // Implement dispute logic
    const user = JSON.parse(localStorage.getItem('user') || ""); // Parse the user from localStorage
    if (!user) {
      console.log("User not found");
      return;
    }

    try{
      await createProject({
        clientAddress: walletAddress,
        freelancerAddress,
        milestoneDescriptions: milestones.map((m) => m.description),
        milestoneAmounts: milestones.map((m) => m.amount),
      });
    } catch {
      console.log("")
    }
    if(!loading){
      toast.success("Dispute Raised")
      router.push('/voting/2')
    }

   
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Link
        href="/client/dashboard"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Link>

      <Card className="p-8 bg-card/50 backdrop-blur-sm border-slate-800/50">
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-sm">
                {job.category}
              </Badge>
              <Badge
                className={`${statusColors[job.status as keyof typeof statusColors ?? 'not_started']} text-white capitalize font-medium`}
              >
                {job.status?.replace("_", " ")}
              </Badge>
            </div>

            <h1 className="text-3xl font-bold">{job.title}</h1>

            <div className="flex gap-4 text-sm text-muted-foreground">
              <span>Created: {formatDate(new Date(job.createdAt))}</span>
              <span>•</span>
              <span>{job.applicantsCount} Applicants</span>
              <span>•</span>
              <span>{formatAmount(job.totalAmount ?? 0)} Total Budget</span>
            </div>
          </div>

          <div className="prose prose-invert max-w-none">
            <Markdown>{job.description}</Markdown>
          </div>

          {/* Applicants Section */}
          {applications.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Applicants</h2>
              <div className="grid gap-4">
                {applications.map((application) => (
                  <Link 
                    href={`/freelancers/${application.freelancer.id}`}
                    key={application.id}
                  >
                    <Card className="p-6 hover:bg-card/60 transition-colors">
                      <div className="flex items-start gap-4">
                        <div className="text-white">{application.freelancer.name}</div>
                        <AcceptingorRejecting job={job} userId={application.freelancer.id} />
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">Project Progress</h2>
              <Progress value={calculateMilestoneProgress()} className="h-2" />
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Milestones</h2>
              <div className="grid gap-4">
                {job.milestones.map((milestone) => (
                  <Card
                    key={milestone.id}
                    className="p-6 bg-card/30 backdrop-blur-sm"
                  >
                    <div className="space-y-4">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{milestone.description}</h3>
                            <Badge
                              className={`${
                                statusColors[milestone.status as keyof typeof statusColors ?? 'not_started']
                              } text-white capitalize`}
                            >
                              {milestone.status?.replace("_", " ")}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {milestone.description}
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-lg font-semibold">
                            {formatAmount(milestone.amount)}
                          </span>
                        </div>
                      </div>

                      {/* Deliverables */}
                      {milestone.deliverables && milestone.deliverables.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium text-muted-foreground">Deliverables</h4>
                          <div className="grid gap-2">
                            {milestone.deliverables.map((deliverable) => {
                              const IconComponent = deliverableTypeIcons[deliverable.type];
                              return (
                                <a
                                  key={deliverable.id}
                                  href={deliverable.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 p-2 rounded-md bg-background/50 hover:bg-background/80 transition-colors"
                                >
                                  <IconComponent className="w-4 h-4 text-muted-foreground" />
                                  <span className="text-sm">{deliverable.name}</span>
                                  <span className="text-xs text-muted-foreground ml-auto">
                                    {formatDate(new Date(deliverable.uploadedAt))}
                                  </span>
                                </a>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex flex-wrap gap-2 mt-4">
                        {milestone.status === "started" && (
                          <>
                            <Button
                              onClick={() => milestone.id && handleMarkAsCompleted(milestone.id)}
                              className="bg-emerald-600 hover:bg-emerald-700"
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Mark as Completed
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => milestone.id && handleRequestChanges(milestone.id)}
                            >
                              <XCircle className="w-4 h-4 mr-2" />
                              Request Changes
                            </Button>
                          </>
                        )}
                        {milestone.status === "completed" && (
                          <Button
                            variant="destructive"
                            onClick={() => milestone.id && handleRaiseDispute(milestone.id)}
                          >
                            <AlertTriangle className="w-4 h-4 mr-2" />
                            Raise Dispute
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}