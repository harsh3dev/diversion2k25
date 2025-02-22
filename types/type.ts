export enum MilestoneStatus {
    NotStarted = 'NotStarted',
    InProgress = 'InProgress',
    Completed = 'Completed',
    Disputed = 'Disputed',
    Resolved = 'Resolved'
  }
  
  export enum ProjectStatus {
    Active = 'Active',
    Completed = 'Completed',
    Cancelled = 'Cancelled'
  }
  
  export interface Milestone {
    description: string;
    amount: number;
    status: MilestoneStatus;
    paid: boolean;
  }
  
  export interface Project {
    id: number;
    client: string;
    freelancer: string;
    totalAmount: number;
    claimedAmount: number;
    completedMilestones: number;
    status: ProjectStatus;
    milestones: Milestone[];
    isDisputed: boolean;
    disputeVotesForClient: number;
    disputeVotesForFreelancer: number;
  }
  