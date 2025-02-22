"use client";

import ReactMarkdown from 'react-markdown';

interface JobDescriptionProps {
  description: string;
}

export default function JobDescription({ description }: JobDescriptionProps) {
  return (
    <div className="prose prose-invert max-w-none">
      <ReactMarkdown>{description}</ReactMarkdown>
    </div>
  );
}