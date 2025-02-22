import { Types } from 'aptos';

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '';

export const contractUtils = {

        async createProject(
            client: string,
            freelancer: string,
            milestoneDescriptions: string[],
            milestoneAmounts: number[]
        ) {
            try {
                if (!window.aptos) throw new Error('Petra wallet not found');

                const payload: Types.TransactionPayload = {
                    type: "entry_function_payload",
                    function: `${CONTRACT_ADDRESS}::FreelanceEscrow::create_project`,
                    type_arguments: [],
                    arguments: [client, freelancer, milestoneDescriptions, milestoneAmounts]
                };

                const response = await window.aptos.signAndSubmitTransaction(payload);
                return response;
            } catch (error) {
                console.error('Error creating project:', error);
                throw error;
            }
        },

        async startMilestone(projectId: number, milestoneIndex: number) {
            try {
                if (!window.aptos) throw new Error('Petra wallet not found');

                const payload: Types.TransactionPayload = {
                    type: "entry_function_payload",
                    function: `${CONTRACT_ADDRESS}::FreelanceEscrow::start_milestone`,
                    type_arguments: [],
                    arguments: [projectId, milestoneIndex]
                };

                const response = await window.aptos.signAndSubmitTransaction(payload);
                return response;
            } catch (error) {
                console.error('Error starting milestone:', error);
                throw error;
            }
        }
    };