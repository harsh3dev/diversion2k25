import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { calculateTotalAmount } from '@/app/api/projects/route';
import { useProject } from '@/app/hooks/useProject';

interface CreateProjectFormProps {
  walletAddress: string;
}

export function AcceptingorRejecting({ jobs }: any) {
  const { createProject, loading, error } = useProject();
  const [freelancerAddress, setFreelancerAddress] = useState('');
  const [milestones, setMilestones] = useState([
    { description: '', amount: 0 }
  ]);

  const addMilestone = () => {
    setMilestones([...milestones, { description: '', amount: 0 }]);
  };

  const updateMilestone = (index: number, field: 'description' | 'amount', value: string | number) => {
    const newMilestones = [...milestones];
    newMilestones[index] = {
      ...newMilestones[index],
      [field]: field === 'amount' ? Number(value) : value
    };
    setMilestones(newMilestones);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const totalAmount = calculateTotalAmount(milestones.map(m => m.amount));

    try {
      await createProject({
        clientAddress: walletAddress,
        freelancerAddress,
        milestoneDescriptions: milestones.map(m => m.description),
        milestoneAmounts: milestones.map(m => m.amount)
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
     <div className='flex p-4'>
      <Button  onClick={handleSubmit}>
         Accept
      </Button>
      <Button  onClick={handleSubmit}>
         Reject
      </Button>
      </div>
    </form>
  );
}