"use client";

import { format } from "date-fns";
import { FileCode, FileText, ChevronRight, ThumbsUp, ThumbsDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { toast } from 'react-toastify';

const jobData = {
  _id: '1',
  title: 'Smart Contract Development for DeFi Platform',
  description: '# Project Overview\n\nWe need an experienced Solidity developer to create a suite of smart contracts for our DeFi platform.\n\n## Key Requirements\n\n- Implement ERC20 token contract\n- Create staking mechanism\n- Develop yield farming contracts\n- Ensure security best practices\n\n## Timeline\n\n8 weeks total duration with regular updates and testing phases.',
  category: 'Smart Contracts',
  estimatedHours: 160,
  status: 'ongoing',
  createdAt: new Date('2024-03-15'),
  milestones: [
    {
      id: 'm1',
      title: 'Token Contract Implementation',
      description: 'Develop and test ERC20 token contract',
      amount: 2000,
      status: 'completed',
      startDate: new Date('2024-03-16'),
      completedDate: new Date('2024-03-20'),
      deliverables: [
        {
          id: 'd1',
          name: 'ERC20.sol',
          type: 'code',
          url: 'https://example.com/files/ERC20.sol',
          uploadedAt: new Date('2024-03-20')
        },
        {
          id: 'd2',
          name: 'Technical Documentation',
          type: 'document',
          url: 'https://example.com/files/docs.pdf',
          uploadedAt: new Date('2024-03-20')
        }
      ]
    },
    {
      id: 'm2',
      title: 'Staking Mechanism',
      description: 'Implement staking functionality',
      amount: 3000,
      status: 'started',
      startDate: new Date('2024-03-21'),
      deliverables: [
        {
          id: 'd3',
          name: 'Staking Contract Draft',
          type: 'code',
          url: 'https://example.com/files/Staking.sol',
          uploadedAt: new Date('2024-03-22')
        }
      ]
    },
    {
      id: 'm3',
      title: 'Yield Farming Contracts',
      description: 'Develop yield farming smart contracts',
      amount: 4000,
      status: 'not_started'
    }
  ],
  totalAmount: 9000,
  applicantsCount: 12
};

export default function Home() {
  const [votes, setVotes] = useState({ freelancer: 0, client: 0 });

  const handleVote = (type: 'freelancer' | 'client') => {
    setVotes(prev => ({
      ...prev,
      [type]: prev[type] + 1
    }));
    toast.success(`Your vote has been cast for the ${type === 'freelancer' ? 'freelancer' : 'client'}. Thank you for your participation!`); 
  };

  const totalVotes = votes.freelancer + votes.client;
  const freelancerPercentage = totalVotes ? (votes.freelancer / totalVotes) * 100 : 0;

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold">{jobData.title}</h1>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="secondary">{jobData.category}</Badge>
                  <Badge variant="outline">{jobData.status}</Badge>
                  <Badge variant="outline">{jobData.estimatedHours}h</Badge>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">${jobData.totalAmount}</p>
                <p className="text-sm text-muted-foreground">Total Budget</p>
              </div>
            </div>

            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Project Description</h2>
              <p className="whitespace-pre-wrap">{jobData.description}</p>
            </Card>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Milestones</h2>
            {jobData.milestones.map((milestone) => (
              <Card key={milestone.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold">{milestone.title}</h3>
                    <p className="text-sm text-muted-foreground">{milestone.description}</p>
                  </div>
                  <Badge 
                    variant={
                      milestone.status === 'completed' ? 'default' :
                      milestone.status === 'started' ? 'secondary' : 'outline'
                    }
                  >
                    {milestone.status}
                  </Badge>
                </div>
                
                {milestone.deliverables && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Deliverables:</p>
                    {milestone.deliverables.map((deliverable) => (
                      <a
                        key={deliverable.id}
                        href={deliverable.url}
                        className="flex items-center gap-2 text-sm text-primary hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {deliverable.type === 'code' ? <FileCode className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                        {deliverable.name}
                        <ChevronRight className="w-4 h-4" />
                      </a>
                    ))}
                  </div>
                )}

                <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
                  <span>${milestone.amount}</span>
                  {milestone.startDate && (
                    <span>
                      Started: {format(milestone.startDate, 'MMM d, yyyy')}
                    </span>
                  )}
                  {milestone.completedDate && (
                    <span>
                      Completed: {format(milestone.completedDate, 'MMM d, yyyy')}
                    </span>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Voting Section */}
        <div className="lg:col-span-1">
          <Card className="p-6 sticky top-8">
            <h2 className="text-xl font-semibold mb-4">Community Voting</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Vote on who you think is right in this dispute. Your vote helps maintain transparency and fairness in our community.
            </p>

            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Voting Progress</span>
                  <span className="text-sm text-muted-foreground">{totalVotes} votes</span>
                </div>
                <Progress value={freelancerPercentage} className="h-2" />
                <div className="flex justify-between text-sm">
                  <span>Freelancer ({votes.freelancer})</span>
                  <span>Client ({votes.client})</span>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <Button
                  className="w-full"
                  onClick={() => handleVote('freelancer')}
                >
                  <ThumbsUp className="w-4 h-4 mr-2" />
                  Vote for Freelancer
                </Button>
                <Button
                  className="w-full"
                  onClick={() => handleVote('client')}
                >
                  <ThumbsDown className="w-4 h-4 mr-2" />
                  Vote for Client
                </Button>
              </div>

              <div className="text-sm text-muted-foreground">
                <p className="mb-2">Voting Guidelines:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Review all project details carefully</li>
                  <li>Consider milestone completion status</li>
                  <li>Check delivered work quality</li>
                  <li>Evaluate communication evidence</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}