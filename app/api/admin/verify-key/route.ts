import { NextResponse } from 'next/server';

// The actual secret key should come from environment variables
const ADMIN_SECRET_KEY = process.env.ADMIN_SECRET_KEY || 'default-secret-key-for-development';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { secretKey } = body;
    
    if (!secretKey) {
      return NextResponse.json({ 
        message: 'Secret key is required' 
      }, { status: 400 });
    }
    
    // Verify the secret key
    if (secretKey !== ADMIN_SECRET_KEY) {
      return NextResponse.json({ 
        message: 'Invalid secret key' 
      }, { status: 401 });
    }
    
    // If key is valid, return success
    return NextResponse.json({ 
      message: 'Key verified successfully',
      success: true
    });
  } catch (error) {
    console.error('Error verifying admin key:', error);
    return NextResponse.json({ 
      message: 'Error processing your request' 
    }, { status: 500 });
  }
}