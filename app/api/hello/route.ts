import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ 
    message: 'Hello from the API!',
    timestamp: new Date().toISOString(),
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Here you would typically validate the data and maybe save it to a database
    console.log('Received contact form submission:', body);
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return NextResponse.json({ 
      message: 'Form submission received successfully',
      data: body,
    });
  } catch (error) {
    console.error('Error processing POST request:', error);
    return NextResponse.json({ message: 'Error processing your request' }, { status: 400 });
  }
}