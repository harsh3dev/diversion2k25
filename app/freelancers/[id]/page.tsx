"use client";

import { useParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin, Star, Clock, DollarSign, Globe, Github, Linkedin } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { mockFreelancers } from "@/lib/mockData";
import { formatAmount } from "@/lib/utils/format";

export default function FreelancerProfilePage() {
  const { id } = useParams();
  const freelancer = mockFreelancers.find((f) => f.id === id);

  if (!freelancer) {
    return <div>Freelancer not found</div>;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Link>

      <div className="grid gap-6">
        {/* Header Card */}
        <Card className="p-8 bg-card/50 backdrop-blur-sm border-slate-800/50">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <Avatar className="w-24 h-24">
              <AvatarImage src={freelancer.imageUrl} />
              <AvatarFallback>{freelancer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            
            <div className="flex-1 space-y-4">
              <div>
                <h1 className="text-3xl font-bold">{freelancer.name}</h1>
                <div className="flex items-center gap-3 mt-2 text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{freelancer.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span>{freelancer.trustTokens} Trust Tokens</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    <span>{formatAmount(freelancer.hourlyRate)}/hour</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                {freelancer.githubUrl && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={freelancer.githubUrl} target="_blank" rel="noopener noreferrer">
                      <Github className="w-4 h-4 mr-2" />
                      GitHub
                    </a>
                  </Button>
                )}
                {freelancer.linkedinUrl && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={freelancer.linkedinUrl} target="_blank" rel="noopener noreferrer">
                      <Linkedin className="w-4 h-4 mr-2" />
                      LinkedIn
                    </a>
                  </Button>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-2 items-end">
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{freelancer.completedJobs} Jobs Completed</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4" />
                  <span>{freelancer.successRate}% Success Rate</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {freelancer.languages.map((language) => (
                  <Badge key={language} variant="outline" className="flex items-center gap-1">
                    <Globe className="w-3 h-3" />
                    {language}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* About Section */}
        <Card className="p-8 bg-card/50 backdrop-blur-sm border-slate-800/50">
          <h2 className="text-xl font-semibold mb-4">About</h2>
          <p className="text-muted-foreground">{freelancer.about}</p>
        </Card>

        {/* Skills Section */}
        <Card className="p-8 bg-card/50 backdrop-blur-sm border-slate-800/50">
          <h2 className="text-xl font-semibold mb-4">Skills</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {freelancer.skills.map((skill) => (
              <div
                key={skill.name}
                className="flex items-center justify-between p-4 rounded-lg bg-background/50"
              >
                <span className="font-medium">{skill.name}</span>
                <Badge variant="secondary">
                  {skill.yearsOfExperience} {skill.yearsOfExperience === 1 ? 'year' : 'years'}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}