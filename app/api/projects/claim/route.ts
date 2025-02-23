import { NextRequest, NextResponse } from 'next/server';
import { Types } from 'aptos';

interface ClaimMilestoneRequest {
  projectId: number;
  milestoneIndex: number;
  freelancerAddress: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: ClaimMilestoneRequest = await request.json();

    // Validation
    if (body.projectId === undefined || body.milestoneIndex === undefined || !body.freelancerAddress) {
      return NextResponse.json(
        { error: 'Invalid request parameters' },
        { status: 400 }
      );
    }

    // Create transaction payload to claim payment for a specific milestone
    const payload: Types.TransactionPayload = {
      type: 'entry_function_payload',
      function: `0xe1d7abfba4e0763fd4fe74a88bcd3c3e8a9d0a7a3d4790bb97e1b624a28269b1::FreelanceEscrow::claim_milestone_payment`,
      type_arguments: [],
      arguments: [
        body.projectId,       // Project ID
        body.milestoneIndex   // Milestone index
      ]
    };

    // Return the payload and any additional debugging information if needed
    return NextResponse.json({
      success: true,
      payload,
      debug: {
        projectId: body.projectId,
        milestoneIndex: body.milestoneIndex
      }
    });
  } catch (error: any) {
    console.error('Error claiming milestone payment:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
