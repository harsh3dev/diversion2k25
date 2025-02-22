export const USDTAbi = [
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_projectId",
				"type": "uint256"
			}
		],
		"name": "claimPayment",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_projectId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_milestoneIndex",
				"type": "uint256"
			}
		],
		"name": "completeMilestone",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address payable",
				"name": "_freelancer",
				"type": "address"
			},
			{
				"internalType": "string[]",
				"name": "_milestoneDescriptions",
				"type": "string[]"
			},
			{
				"internalType": "uint256[]",
				"name": "_milestoneAmounts",
				"type": "uint256[]"
			}
		],
		"name": "createProject",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "disputeId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "projectId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "milestoneIndex",
				"type": "uint256"
			}
		],
		"name": "DisputeRaised",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "disputeId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "bool",
				"name": "favorClient",
				"type": "bool"
			}
		],
		"name": "DisputeResolved",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "projectId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "milestoneIndex",
				"type": "uint256"
			}
		],
		"name": "MilestoneCompleted",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "projectId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "freelancer",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "PaymentClaimed",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "projectId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "client",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "freelancer",
				"type": "address"
			}
		],
		"name": "ProjectCreated",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_projectId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_milestoneIndex",
				"type": "uint256"
			}
		],
		"name": "raiseDispute",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_disputeId",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "favorClient",
				"type": "bool"
			}
		],
		"name": "voteDispute",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "disputeCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "disputes",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "projectId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "milestoneIndex",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "votesForClient",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "votesForFreelancer",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "resolved",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "projectCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "projects",
		"outputs": [
			{
				"internalType": "address payable",
				"name": "client",
				"type": "address"
			},
			{
				"internalType": "address payable",
				"name": "freelancer",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "totalAmount",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "claimedAmount",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "completedMilestones",
				"type": "uint256"
			},
			{
				"internalType": "enum FreelanceEscrowWithReputation.ProjectStatus",
				"name": "status",
				"type": "uint8"
			},
			{
				"internalType": "bool",
				"name": "isPaid",
				"type": "bool"
			},
			{
				"internalType": "bool",
				"name": "isDisputed",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "reputationTokens",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]

export const USDTAddress = '0xdac17f958d2ee523a2206206994597c13d831ec7'