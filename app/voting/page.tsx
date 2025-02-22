"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const disputes = [
  { id: 1, jobName: "Logo Design", trustTokens: 50, description: "Client and freelancer disagree on final design." },
  { id: 2, jobName: "Web Development", trustTokens: 100, description: "Client claims incomplete work, freelancer disagrees." },
  { id: 3, jobName: "Content Writing", trustTokens: 30, description: "Plagiarism issue raised by client." },
  { id: 4, jobName: "Mobile App", trustTokens: 70, description: "App not functioning as expected per requirements." },
  { id: 5, jobName: "SEO Optimization", trustTokens: 40, description: "Dispute over results not meeting expectations." },
  { id: 6, jobName: "Data Analysis", trustTokens: 60, description: "Client believes data was misinterpreted." },
  { id: 7, jobName: "Video Editing", trustTokens: 80, description: "Freelancer delivered an unapproved cut." },
  { id: 8, jobName: "Illustration", trustTokens: 55, description: "Client disputes originality of work." },
  { id: 9, jobName: "Cybersecurity Audit", trustTokens: 120, description: "Client argues security recommendations were vague." },
  { id: 10, jobName: "Machine Learning Model", trustTokens: 150, description: "Algorithm didn't perform as promised." },
];

export default function DisputesPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredDisputes = disputes.filter(
    (dispute) =>
      dispute.jobName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dispute.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Job Disputes</h1>

        {/* Search Bar */}
        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Search disputes..."
            className="w-full p-3 pl-10 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="absolute left-3 top-3 text-gray-500">🔍</span>
        </div>

        {/* Dispute Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredDisputes.map((dispute) => (
            <motion.div
              key={dispute.id}
              whileHover={{ scale: 1.05, boxShadow: "0px 6px 16px rgba(0, 0, 0, 0.2)" }}
              whileTap={{ scale: 0.95 }}
              className="bg-white shadow-md p-4 rounded-xl cursor-pointer transition-all duration-300 border border-gray-200"
              onClick={() => alert(`Opening details for: ${dispute.jobName}`)}
            >
              <h2 className="text-lg font-semibold text-gray-800">{dispute.jobName}</h2>
              <p className="text-sm text-gray-600 mt-2">{dispute.description}</p>
              <div className="mt-3 text-blue-600 font-bold">
                Trust Tokens: {dispute.trustTokens}
              </div>
              <button className="mt-4 bg-yellow-500 text-white py-2 px-4 rounded-lg font-bold hover:bg-yellow-600">
                View Dispute
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
