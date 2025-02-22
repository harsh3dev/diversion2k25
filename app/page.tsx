"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Lock, CheckCircle, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="bg-gray-900 text-white">
      {/* Hero Section */}
      <section className="text-center py-20 px-5">
        <motion.h1
          className="text-5xl font-bold mb-6"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          Secure Freelance Payments with Blockchain
        </motion.h1>
        <p className="text-lg text-gray-300 mb-6">
          Work safely with milestone-based payments and secure escrow. Get paid instantly!
        </p>
        <motion.button
          className="bg-blue-500 text-white px-6 py-3 rounded-lg text-lg font-medium hover:bg-blue-600 transition"
          whileHover={{ scale: 1.05 }}
        >
          Get Started
        </motion.button>
      </section>

      {/* Secure Payments Section */}
      <section className="py-16 px-6 text-center bg-gray-800">
        <h2 className="text-3xl font-bold mb-6">Why Choose Secure Payments?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<ShieldCheck size={40} />}
            title="Blockchain Security"
            description="Every transaction is stored securely on the blockchain to prevent fraud."
          />
          <FeatureCard
            icon={<Lock size={40} />}
            title="Milestone-Based Payouts"
            description="Freelancers get paid for each completed milestone, ensuring fairness."
          />
          <FeatureCard
            icon={<CheckCircle size={40} />}
            title="Fast & Secure Withdrawals"
            description="Withdraw your earnings instantly with multiple payment options."
          />
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-6 text-center">
        <h2 className="text-3xl font-bold mb-6">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <StepCard step="1" title="Post a Job" description="Clients create a project and set milestones." />
          <StepCard step="2" title="Freelancer Works" description="Freelancer completes tasks and submits work." />
          <StepCard step="3" title="Secure Payment" description="Payment is released when work is approved." />
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 text-center bg-blue-600">
        <h2 className="text-3xl font-bold mb-6">Join the Future of Freelancing</h2>
        <p className="text-lg mb-6">Get started today and experience secure payments like never before.</p>
        <motion.button
          className="bg-white text-blue-600 px-6 py-3 rounded-lg text-lg font-medium hover:bg-gray-200 transition"
          whileHover={{ scale: 1.05 }}
        >
          Sign Up Now <ArrowRight className="inline ml-2" />
        </motion.button>
      </section>
    </div>
  );
}

// FeatureCard Component
const FeatureCard: React.FC<{ icon: JSX.Element; title: string; description: string }> = ({
  icon,
  title,
  description,
}) => (
  <motion.div
    className="bg-gray-700 p-6 rounded-xl shadow-md"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <div className="text-blue-400 mb-4">{icon}</div>
    <h3 className="text-xl font-semibold">{title}</h3>
    <p className="text-gray-300">{description}</p>
  </motion.div>
);

// StepCard Component
const StepCard: React.FC<{ step: string; title: string; description: string }> = ({
  step,
  title,
  description,
}) => (
  <motion.div
    className="p-6 rounded-xl border border-gray-600 bg-gray-800"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-bold">{step}</span>
    <h3 className="text-xl font-semibold mt-4">{title}</h3>
    <p className="text-gray-300">{description}</p>
  </motion.div>
);
