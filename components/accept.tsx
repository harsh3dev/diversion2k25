import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { calculateTotalAmount } from '@/app/api/projects/route';
import { useProject } from '@/app/hooks/useProject';

// Assuming you have a function to get the wallet address from Tetra Wallet
import { getWalletAddress } from '@/lib/tetraWallet';

interface CreateProjectFormProps {
  walletAddress: string;
}

export function AcceptingorRejecting({ job, userId }: any) {
  const { createProject, loading, error } = useProject();
  const [freelancerAddress, setFreelancerAddress] = useState('0xb038adc01c39a521654c3898757803295400deb3bd31d3a39f6e75f916f75016');
  const [walletAddress, setWalletAddress] = useState('0xaf7d83cc10e7a57548b44e8295a38ef3564b1f82723c35acaee2a21c21b5d7be');
  const [milestones, setMilestones] = useState([{ description: '', amount: 0 }]);

  // useEffect(() => {
  //   async function fetchWalletAddress() {
  //     const address = localStorage.getItem('WalletAddress')
  //     setWalletAddress(address);
  //   }
  //   fetchWalletAddress();
  // }, []);

  const addMilestone = () => {
    setMilestones([...milestones, { description: '', amount: 0 }]);
  };

  const updateMilestone = (index: number, field: 'description' | 'amount', value: string | number) => {
    const newMilestones = [...milestones];
    newMilestones[index] = {
      ...newMilestones[index],
      [field]: field === 'amount' ? Number(value) : value,
    };
    setMilestones(newMilestones);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const totalAmount = calculateTotalAmount(milestones.map((m) => m.amount));

    try {
      await createProject({
        clientAddress: walletAddress,
        freelancerAddress,
        milestoneDescriptions: milestones.map((m) => m.description),
        milestoneAmounts: milestones.map((m) => m.amount),
      });

      // Reset form
      setFreelancerAddress('');
      setMilestones([{ description: '', amount: 0 }]);
    } catch (error) {
      console.error('Failed to create project:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex p-4">
        <Button onClick={handleSubmit}>Accept</Button>
        <Button onClick={handleSubmit}>Reject</Button>
      </div>
    </form>
  );
}