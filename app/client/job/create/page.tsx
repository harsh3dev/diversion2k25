"use client"
import JobPostingForm from '@/components/job-posting-form';
import ConnectPetraWallet from '@/components/tetra';
import useEthWallet from '@/hooks/useEthWallet';
import ConnectButton from '@/lib/wallet-modal';
import { FeatherIcon as EthereumIcon } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';


export default function Home() {
  const { loading, open, address, isConnected, user } = useEthWallet();

  useEffect(() => {
    console.table({ loading, open, address, isConnected, user }, ['loading', 'open', 'address', 'isConnected', 'user']);
  }, [loading, open, address, isConnected, user])

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      {/* <ConnectButton /> */}
      <div className="w-full p-2 flex justify-end items-center"><ConnectPetraWallet/></div>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <EthereumIcon className="h-12 w-12 text-blue-500" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white mb-4">
            Web3 Job Board
          </h1>
          <p className="text-xl text-gray-400 mb-4">
            Post your blockchain and Web3 development opportunities
          </p>
          <Link 
            href="/jobs" 
            className="text-blue-500 hover:text-blue-400 transition-colors"
          >
            Browse Available Jobs
          </Link>
        </div>
        
        <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl shadow-2xl p-6 border border-gray-800">
          <JobPostingForm />
        </div>
      </div>
    </div>
  );
}