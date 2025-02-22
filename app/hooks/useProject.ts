import { useState } from 'react';


interface CreateProjectParams {
  clientAddress: string;
  freelancerAddress: string;
  milestoneDescriptions: string[];
  milestoneAmounts: number[];
}

export const useProject = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createProject = async (params: CreateProjectParams) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create project');
      }

      const { payload } = await response.json();

      // Submit the transaction using Petra wallet
      if (!window.aptos) {
        throw new Error('Petra wallet not found');
      }

      const result = await window.aptos.signAndSubmitTransaction(payload);
      return result;

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    createProject,
    loading,
    error,
  };
};