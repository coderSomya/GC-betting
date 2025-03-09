import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

// The actual secret key should come from environment variables
const ADMIN_SECRET_KEY = process.env.ADMIN_SECRET_KEY || 'default-secret-key-for-development';

// In a real application, this would be stored in a database
let gamesData = [
  {
    id: '1',
    teamX: 'Lakers',
    teamY: 'Celtics',
    sport: 'Basketball',
    multiplierX: 1.8,
    multiplierY: 2.2
  },
  {
    id: '2',
    teamX: 'Chiefs',
    teamY: 'Eagles',
    sport: 'Football',
    multiplierX: 1.5,
    multiplierY: 2.5
  },
  {
    id: '3',
    teamX: 'Yankees',
    teamY: 'Red Sox',
    sport: 'Baseball',
    multiplierX: 2.0,
    multiplierY: 1.9
  },
  {
    id: '4',
    teamX: 'Manchester United',
    teamY: 'Liverpool',
    sport: 'Soccer',
    multiplierX: 2.3,
    multiplierY: 1.7
  },
  {
    id: '5',
    teamX: 'Maple Leafs',
    teamY: 'Canadiens',
    sport: 'Hockey',
    multiplierX: 1.6,
    multiplierY: 2.4
  }
];

// Helper function to verify admin secret key
function verifyAdminKey(secretKey: string): boolean {
  return secretKey === ADMIN_SECRET_KEY;
}

export async function GET(request: Request) {
  // Add a small delay to simulate network latency
  console.log("here atleast....");  
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  
  if (id) {
    const game = gamesData.find(g => g.id === id);
    
    if (!game) {
      return NextResponse.json({ 
        message: 'Game not found' 
      }, { status: 404 });
    }
    
    return NextResponse.json({ game });
  }
  
  return NextResponse.json({ 
    games: gamesData,
    count: gamesData.length,
    timestamp: new Date().toISOString()
  });
}

// Create a new game
export async function POST(request: Request) {
    console.log("here atleast....");  

  try {
    const body = await request.json();
    const { secretKey, teamX, teamY, sport, multiplierX, multiplierY } = body;
    
    // Verify admin key
    if (!verifyAdminKey(secretKey)) {
      return NextResponse.json({ 
        message: 'Unauthorized: Invalid secret key' 
      }, { status: 401 });
    }
    
    // Validate required fields
    if (!teamX || !teamY || !sport) {
      return NextResponse.json({ 
        message: 'Team names and sport are required' 
      }, { status: 400 });
    }
    
    // Create a new game
    const newGame = {
      id: uuidv4(),
      teamX,
      teamY,
      sport,
      multiplierX: parseFloat(multiplierX) || 1.5,
      multiplierY: parseFloat(multiplierY) || 1.5
    };
    
    // Add to our "database"
    gamesData.push(newGame);
    
    return NextResponse.json({ 
      message: 'Game created successfully',
      game: newGame,
    });
  } catch (error) {
    console.error('Error creating game:', error);
    return NextResponse.json({ 
      message: 'Error processing your request' 
    }, { status: 500 });
  }
}

// Delete a game
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ 
        message: 'Game ID is required' 
      }, { status: 400 });
    }
    
    const body = await request.json();
    const { secretKey } = body;
    
    // Verify admin key
    if (!verifyAdminKey(secretKey)) {
      return NextResponse.json({ 
        message: 'Unauthorized: Invalid secret key' 
      }, { status: 401 });
    }
    
    // Check if game exists
    const gameIndex = gamesData.findIndex(g => g.id === id);
    
    if (gameIndex === -1) {
      return NextResponse.json({ 
        message: 'Game not found' 
      }, { status: 404 });
    }
    
    // Remove the game from our "database"
    const deletedGame = gamesData[gameIndex];
    gamesData = gamesData.filter(g => g.id !== id);
    
    return NextResponse.json({ 
      message: 'Game deleted successfully',
      game: deletedGame
    });
  } catch (error) {
    console.error('Error deleting game:', error);
    return NextResponse.json({ 
      message: 'Error processing your request' 
    }, { status: 500 });
  }
}

// This endpoint can also handle bets if needed
export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ 
        message: 'Game ID is required' 
      }, { status: 400 });
    }
    
    const body = await request.json();
    const { betAmount, teamSelected } = body;
    
    // Validate required fields
    if (betAmount === undefined || !teamSelected) {
      return NextResponse.json({ 
        message: 'Bet amount and selected team are required' 
      }, { status: 400 });
    }
    
    // Find the game
    const game = gamesData.find(g => g.id === id);
    
    if (!game) {
      return NextResponse.json({ 
        message: 'Game not found' 
      }, { status: 404 });
    }
    
    // Calculate potential returns based on selected team
    const multiplier = teamSelected === 'X' ? game.multiplierX : game.multiplierY;
    const potentialReturn = betAmount * multiplier;
    
    return NextResponse.json({ 
      message: 'Bet placed successfully',
      bet: {
        gameId: id,
        amount: betAmount,
        teamSelected,
        multiplier,
        potentialReturn,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error processing bet:', error);
    return NextResponse.json({ 
      message: 'Error processing your request' 
    }, { status: 500 });
  }
}