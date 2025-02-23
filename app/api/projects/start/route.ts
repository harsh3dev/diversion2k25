import { NextRequest, NextResponse } from 'next/server';
import { Types } from 'aptos';


// Convert a string to a byte array
export const convertStringToBytes = (input: string): number[] => {
  return Array.from(new TextEncoder().encode(input));
};

export function calculateTotalAmount(amounts: number[]): number {
  return amounts.reduce((acc, amount) => acc + amount, 0);
}




interface CreateProjectRequest {
  clientAddress: string;
  freelancerAddress: string;
  milestoneDescriptions: string[];
  milestoneAmounts: number[];
}



export async function POST(request: NextRequest) {
  try {
    const body: CreateProjectRequest = await request.json();
    
    // Validation
    if (!body.clientAddress || !body.freelancerAddress || 
        !body.milestoneDescriptions || !body.milestoneAmounts ||
        body.milestoneDescriptions.length === 0 || 
        body.milestoneAmounts.length === 0 ||
        body.milestoneDescriptions.length !== body.milestoneAmounts.length) {
      return NextResponse.json(
        { error: 'Invalid request parameters' },
        { status: 400 }
      );
    }

    // Ensure amounts are non-negative integers
    if (!body.milestoneAmounts.every(amount => Number.isInteger(amount) && amount >= 0)) {
      return NextResponse.json(
        { error: 'All amounts must be non-negative integers' },
        { status: 400 }
      );
    }

    // Format descriptions as vector<vector<u8>>
    const descriptions = body.milestoneDescriptions.map(convertStringToBytes);
    
    // Ensure all milestone amounts are valid u64 values
    const amounts = body.milestoneAmounts;
    
    // Calculate total
    const totalAmount = amounts.reduce((sum, amount) => sum + amount, 0);

    const payload: Types.TransactionPayload = {
      type: "entry_function_payload",
      function: `0xa8b9f1264df1dfebc48397cf1f57cd405b4c2080b9d3ca16a70f20124998f28f::FreelanceEscrow::create_project`,
      type_arguments: [],
      arguments: [
        body.freelancerAddress,
        descriptions,
        amounts,
        totalAmount
      ]
    };

    return NextResponse.json({ 
      success: true,
      payload,
      debug: {
        descriptionsLength: descriptions.length,
        amountsLength: amounts.length,
        totalAmount: totalAmount,
        firstDescription: descriptions[0],
        firstAmount: amounts[0]
      }
    });

  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}