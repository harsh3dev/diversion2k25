import { formatISO } from 'date-fns';

export interface Milestone {
  id?: string;
  title: string;
  description: string;
  amount: number;
  status?: string;
  startDate?: Date;
  completedDate?: Date;
  deliverables?: Deliverable[];
}


export interface Skill {
  name: string;
  yearsOfExperience: number;
}

export interface FreelancerProfile {
  id: string;
  name: string;
  imageUrl: string;
  trustTokens: number;
  about: string;
  skills: Skill[];
  completedJobs: number;
  successRate: number;
  location: string;
  hourlyRate: number;
  languages: string[];
  githubUrl?: string;
  linkedinUrl?: string;
}

export interface JobApplication {
  id: string;
  freelancer: FreelancerProfile;
  appliedAt: Date;
  coverLetter: string;
  proposedAmount: number;
  estimatedDuration: string;
}

export interface Deliverable {
  id: string;
  name: string;
  type: 'image' | 'document' | 'code' | 'other';
  url: string;
  uploadedAt: Date;
}

export interface Job {
  _id: string;
  category: string;
  title: string;
  description: string;
  milestones: Milestone[];
  estimatedHours: number;
  createdAt: Date;
  totalAmount?: number;
  applicantsCount?: number;
  status?: string;
  applications?: JobApplication[];
}


export const mockFreelancers: FreelancerProfile[] = [
  {
    id: 'f1',
    name: 'Alex Thompson',
    imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&h=200&auto=format&fit=crop',
    trustTokens: 450,
    about: 'Senior blockchain developer with 5+ years of experience in DeFi protocols and smart contract development. Specialized in Solidity and Web3 integration.',
    skills: [
      { name: 'Solidity', yearsOfExperience: 5 },
      { name: 'Smart Contracts', yearsOfExperience: 4 },
      { name: 'DeFi', yearsOfExperience: 3 },
      { name: 'Web3.js', yearsOfExperience: 4 }
    ],
    completedJobs: 87,
    successRate: 98,
    location: 'London, UK',
    hourlyRate: 150,
    languages: ['English', 'Spanish'],
    githubUrl: 'https://github.com/alexthompson',
    linkedinUrl: 'https://linkedin.com/in/alexthompson'
  },
  {
    id: 'f2',
    name: 'Sarah Chen',
    imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&h=200&auto=format&fit=crop',
    trustTokens: 380,
    about: 'Full-stack developer focusing on Web3 applications. Expert in React, Node.js, and blockchain integration.',
    skills: [
      { name: 'React', yearsOfExperience: 4 },
      { name: 'Node.js', yearsOfExperience: 5 },
      { name: 'TypeScript', yearsOfExperience: 3 },
      { name: 'Web3', yearsOfExperience: 2 }
    ],
    completedJobs: 64,
    successRate: 96,
    location: 'Singapore',
    hourlyRate: 120,
    languages: ['English', 'Mandarin', 'Cantonese']
  }
];

export const mockJobs: Job[] = [
  {
    _id: '1',
    title: 'Smart Contract Development for DeFi Platform',
    description: '# Project Overview\n\nWe need an experienced Solidity developer to create a suite of smart contracts for our DeFi platform.\n\n## Key Requirements\n\n- Implement ERC20 token contract\n- Create staking mechanism\n- Develop yield farming contracts\n- Ensure security best practices\n\n## Timeline\n\n8 weeks total duration with regular updates and testing phases.',
    category: 'Smart Contracts',
    estimatedHours: 160,
    status: 'ongoing',
    createdAt: new Date('2024-03-15'),
    milestones: [
      {
        id: 'm1',
        title: 'Token Contract Implementation',
        description: 'Develop and test ERC20 token contract',
        amount: 2000,
        status: 'completed',
        startDate: new Date('2024-03-16'),
        completedDate: new Date('2024-03-20'),
        deliverables: [
          {
            id: 'd1',
            name: 'ERC20.sol',
            type: 'code',
            url: 'https://example.com/files/ERC20.sol',
            uploadedAt: new Date('2024-03-20')
          },
          {
            id: 'd2',
            name: 'Technical Documentation',
            type: 'document',
            url: 'https://example.com/files/docs.pdf',
            uploadedAt: new Date('2024-03-20')
          }
        ]
      },
      {
        id: 'm2',
        title: 'Staking Mechanism',
        description: 'Implement staking functionality',
        amount: 3000,
        status: 'started',
        startDate: new Date('2024-03-21'),
        deliverables: [
          {
            id: 'd3',
            name: 'Staking Contract Draft',
            type: 'code',
            url: 'https://example.com/files/Staking.sol',
            uploadedAt: new Date('2024-03-22')
          }
        ]
      },
      {
        id: 'm3',
        title: 'Yield Farming Contracts',
        description: 'Develop yield farming smart contracts',
        amount: 4000,
        status: 'not_started'
      }
    ],
    totalAmount: 9000,
    applicantsCount: 12
  },
  {
    _id: '2',
    title: 'NFT Marketplace Frontend Development',
    description: '# NFT Marketplace UI Development\n\nCreate a modern and intuitive frontend for our NFT marketplace.\n\n## Features\n\n- NFT browsing and filtering\n- Wallet integration\n- Bidding interface\n- Artist profiles\n\n## Tech Stack\n\n- Next.js\n- Ethers.js\n- Tailwind CSS',
    estimatedHours: 120,
    status: 'not_started',
    createdAt: new Date('2024-03-18'),
    category: 'Frontend Development',
    milestones: [
      {
        id: 'm4',
        title: 'UI Design Implementation',
        description: 'Implement core UI components',
        amount: 3000,
        status: 'not_started'
      },
      {
        id: 'm5',
        title: 'Wallet Integration',
        description: 'Integrate Web3 wallet connectivity',
        amount: 2500,
        status: 'not_started'
      }
    ],
    totalAmount: 5500,
    applicantsCount: 8,
    applications: [
      {
        id: 'a1',
        freelancer: mockFreelancers[0],
        appliedAt: new Date('2024-03-19T10:30:00'),
        coverLetter: 'I have extensive experience in building NFT marketplaces and would love to help with this project.',
        proposedAmount: 5000,
        estimatedDuration: '4 weeks'
      },
      {
        id: 'a2',
        freelancer: mockFreelancers[1],
        appliedAt: new Date('2024-03-19T15:45:00'),
        coverLetter: 'My background in React and Web3 makes me a perfect fit for this marketplace development.',
        proposedAmount: 5200,
        estimatedDuration: '5 weeks'
      }
    ]
  },
  {
    _id: '3',
    title: 'Blockchain Analytics Dashboard',
    description: 'Develop a dashboard for blockchain analytics.',
    estimatedHours: 100,
    status: 'completed',
    createdAt: new Date('2024-02-01'),
    category: 'Analytics',
    milestones: [
      {
        id: 'm6',
        title: 'Data Integration',
        description: 'Connect to blockchain data sources',
        amount: 4000,
        status: 'completed',
        deliverables: [
          {
            id: 'd4',
            name: 'Dashboard Screenshots',
            type: 'image',
            url: 'https://example.com/files/dashboard.png',
            uploadedAt: new Date('2024-02-15')
          }
        ]
      }
    ],
    totalAmount: 4000,
    applicantsCount: 5
  },
  {
    _id: '4',
    title: 'Security Audit',
    description: 'Conduct a comprehensive security audit.',
    estimatedHours: 80,
    status: 'disputed',
    createdAt: new Date('2024-03-10'),
    category: 'Security',
    milestones: [
      {
        id: 'm7',
        title: 'Initial Audit',
        description: 'First phase of security assessment',
        amount: 5000,
        status: 'completed',
        deliverables: [
          {
            id: 'd5',
            name: 'Audit Report',
            type: 'document',
            url: 'https://example.com/files/audit.pdf',
            uploadedAt: new Date('2024-03-15')
          }
        ]
      }
    ],
    totalAmount: 5000,
    applicantsCount: 3
  }
];

