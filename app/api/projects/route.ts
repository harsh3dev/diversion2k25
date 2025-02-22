import { NextRequest, NextResponse } from 'next/server';
import { Types } from 'aptos';

interface CreateProjectRequest {
  clientAddress: string;
  freelancerAddress: string;
  milestoneDescriptions: string[];
  milestoneAmounts: number[];
}


export const calculateTotalAmount = (amounts: number[]): number => {
    return amounts.reduce((sum, amount) => sum + amount, 0);
};

export async function POST(request: NextRequest) {
  try {
    const body: CreateProjectRequest = await request.json();
    // Validate request body
    if (!body.clientAddress || !body.freelancerAddress || 
        !body.milestoneDescriptions || !body.milestoneAmounts ||
        body.milestoneDescriptions.length === 0 || 
        body.milestoneAmounts.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const totalAmount = calculateTotalAmount(body.milestoneAmounts);

    const payload: Types.TransactionPayload = {
      type: "entry_function_payload",
      function: `2a15f9d5ede60a299a6fa991a8bffd15ce192b8b5b7338d75f9ac4b9d1c2fa60::FreelanceEscrow::create_project`,
      type_arguments: ["0x1::aptos_coin::AptosCoin"], 
      arguments: [
        body.clientAddress,
        body.freelancerAddress,
        body.milestoneDescriptions,
        body.milestoneAmounts,
        totalAmount.toString() 
      ]
    };

    return NextResponse.json({ 
      success: true,
      totalAmount,
      payload 
    });

  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}