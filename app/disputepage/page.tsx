"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";

export default function DisputeDetails() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const dispute = {
    id,
    name: "Delayed Payment Issue",
    category: "Payment",
    details:
      "The freelancer completed the work, but the client has delayed payment beyond the agreed-upon deadline.",
    jobDescription: "Web Development Project for an E-commerce Store",
    client: "John Doe",
    freelancer: "Jane Smith",
    moneyInvolved: "$1500",
    milestones: [
      { name: "UI Design", status: "Completed" },
      { name: "Backend Setup", status: "Completed" },
      { name: "Final Deployment", status: "Pending" },
    ],
    votesFor: 12,
    votesAgainst: 8,
  };

  const [votesFor, setVotesFor] = useState(dispute.votesFor);
  const [votesAgainst, setVotesAgainst] = useState(dispute.votesAgainst);

  return (
    <div className="min-h-screen bg-darkBlue text-white p-8 flex flex-col items-center">
      {/* Large Heading */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-5xl font-extrabold text-center mb-8"
      >
        Dispute Resolution Center
      </motion.h1>

      {/* Card Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-5xl w-full bg-white text-darkBlue rounded-3xl shadow-2xl p-8"
      >
        <Card className="rounded-2xl overflow-hidden shadow-lg">
          <CardHeader className="bg-darkBlue text-white py-6 px-8">
            <CardTitle className="text-3xl font-bold text-center">{dispute.name}</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            {/* Dispute Details */}
            <div className="mb-6">
              <p className="text-xl font-semibold">Category: <span className="text-darkBlue">{dispute.category}</span></p>
              <p className="mt-2 text-lg">{dispute.details}</p>
            </div>

            {/* Job Description */}
            <div className="mb-6 bg-gray-200 p-4 rounded-lg">
              <p className="text-lg font-semibold">Job Description:</p>
              <p>{dispute.jobDescription}</p>
            </div>

            {/* Client & Freelancer */}
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className="bg-gray-300 p-4 rounded-lg">
                <p className="text-lg font-bold">Client</p>
                <p>{dispute.client}</p>
              </div>
              <div className="bg-gray-300 p-4 rounded-lg">
                <p className="text-lg font-bold">Freelancer</p>
                <p>{dispute.freelancer}</p>
              </div>
            </div>

            {/* Money Involved */}
            <div className="mb-6 text-lg font-semibold bg-darkBlue text-white p-4 rounded-lg text-center">
              💰 Money Involved: {dispute.moneyInvolved}
            </div>

            {/* Milestones */}
            <div className="mb-6">
              <p className="text-2xl font-bold">Milestones</p>
              {dispute.milestones.map((milestone, index) => (
                <div key={index} className="mt-3 bg-gray-200 p-4 rounded-lg">
                  <p className="text-lg font-semibold">{milestone.name}</p>
                  <Progress
                    value={milestone.status === "Completed" ? 100 : 50}
                    className="h-2 mt-2 bg-gray-300"
                  />
                  <p className="text-sm">Status: {milestone.status}</p>
                </div>
              ))}
            </div>

            {/* Voting Section */}
            <div className="bg-gray-200 p-6 rounded-lg shadow-lg">
              <p className="text-2xl font-bold text-center mb-4">Voting Section</p>
              <div className="flex justify-center gap-6">
                <Button
                  className="bg-darkBlue text-white px-6 py-3 text-lg font-bold rounded-lg hover:bg-blue-800 transition"
                  onClick={() => setVotesFor(votesFor + 1)}
                >
                  ✅ Vote For ({votesFor})
                </Button>
                <Button
                  className="bg-darkBlue text-white px-6 py-3 text-lg font-bold rounded-lg hover:bg-blue-800 transition"
                  onClick={() => setVotesAgainst(votesAgainst + 1)}
                >
                  ❌ Vote Against ({votesAgainst})
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
