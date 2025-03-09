'use client';

import { useState, useEffect } from 'react';

// Define types for our data
interface Game {
  id: string;
  teamX: string;
  teamY: string;
  sport: string;
  multiplierX: number;
  multiplierY: number;
}

export default function Games() {
  // State for storing games data
  const [games, setGames] = useState<Game[]>([]);
  // State for storing bet amounts for each game
  const [betAmounts, setBetAmounts] = useState<Record<string, number>>({});
  // Loading state
  const [loading, setLoading] = useState<boolean>(true);
  // Error state
  const [error, setError] = useState<string | null>(null);
  
  // Admin modal states
  const [showSecretKeyModal, setShowSecretKeyModal] = useState<boolean>(false);
  const [secretKey, setSecretKey] = useState<string>('');
  const [adminAction, setAdminAction] = useState<'create' | 'delete' | null>(null);
  const [showGameFormModal, setShowGameFormModal] = useState<boolean>(false);
  const [gameToDelete, setGameToDelete] = useState<string | null>(null);
  
  // New game form state
  const [newGame, setNewGame] = useState<Omit<Game, 'id'>>({
    teamX: '',
    teamY: '',
    sport: '',
    multiplierX: 1.5,
    multiplierY: 1.5
  });

  // Fetch games data from API
  const fetchGames = async () => {
    try {
      setLoading(true);
      // Replace with your actual API endpoint
      const response = await fetch('/api/games');
      
      if (!response.ok) {
        throw new Error('Failed to fetch games');
      }
      
      const data = await response.json();
      setGames(data.games);
      
      // Initialize bet amounts for each game to 0
      const initialBetAmounts: Record<string, number> = {};
      data.games.forEach((game: Game) => {
        initialBetAmounts[game.id] = 0;
      });
      setBetAmounts(initialBetAmounts);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching games:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGames();
  }, []);

  // Handle slider change
  const handleSliderChange = (gameId: string, value: number) => {
    setBetAmounts(prev => ({
      ...prev,
      [gameId]: value
    }));
  };

  // Calculate expected returns
  const calculateReturns = (amount: number, multiplier: number) => {
    return (amount * multiplier).toFixed(2);
  };

  // Handle opening the secret key modal
  const handleAdminAction = (action: 'create' | 'delete', gameId?: string) => {
    setAdminAction(action);
    if (action === 'delete' && gameId) {
      setGameToDelete(gameId);
    } else if (action === 'create') {
      setGameToDelete(null);
    }
    setSecretKey('');
    setShowSecretKeyModal(true);
  };

  // Handle secret key submission
  const handleSecretKeySubmit = async () => {
    try {
      const response = await fetch('/api/admin/verify-key', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ secretKey }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Invalid secret key');
      }

      // If key is valid, close this modal and take appropriate action
      setShowSecretKeyModal(false);
      
      if (adminAction === 'create') {
        setShowGameFormModal(true);
      } else if (adminAction === 'delete' && gameToDelete) {
        deleteGame(gameToDelete);
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Invalid secret key');
    }
  };

  // Handle new game form submission
  const handleCreateGame = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/games', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          ...newGame,
          secretKey // Include secret key for verification on server
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create game');
      }

      // Close the modal and refresh games
      setShowGameFormModal(false);
      fetchGames();
      
      // Reset form
      setNewGame({
        teamX: '',
        teamY: '',
        sport: '',
        multiplierX: 1.5,
        multiplierY: 1.5
      });
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to create game');
    }
  };

  // Handle game deletion
  const deleteGame = async (gameId: string) => {
    try {
      const response = await fetch(`/api/games?id=${gameId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ secretKey }), // Include secret key for verification
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete game');
      }

      // Refresh games
      fetchGames();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete game');
    }
  };

  // Handle form field changes
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewGame(prev => ({
      ...prev,
      [name]: name === 'multiplierX' || name === 'multiplierY' ? parseFloat(value) : value
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-60">
        <div className="loader animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative my-4" role="alert">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 pb-20">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Games alive</h1>
        <button 
          onClick={() => handleAdminAction('create')}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
        >
          Add Game
        </button>
      </div>
      
      <div className="space-y-6">
        {games.length === 0 ? (
          <p className="text-gray-500">No games available at the moment.</p>
        ) : (
          games.map(game => (
            <div 
              key={game.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">
                    {game.teamX} vs {game.teamY}
                  </h2>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-full text-sm font-medium">
                      {game.sport}
                    </span>
                    <button 
                      onClick={() => handleAdminAction('delete', game.id)}
                      className="text-red-500 hover:text-red-700"
                      aria-label="Delete game"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                <div className="mb-6">
                  <label htmlFor={`bet-${game.id}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Bet Amount: ${betAmounts[game.id]}
                  </label>
                  <input
                    type="range"
                    id={`bet-${game.id}`}
                    min="0"
                    max="100"
                    step="1"
                    value={betAmounts[game.id]}
                    onChange={(e) => handleSliderChange(game.id, parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>$0</span>
                    <span>$100</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">If {game.teamX} wins:</div>
                    <div className="text-lg font-bold">${calculateReturns(betAmounts[game.id], game.multiplierX)}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Multiplier: {game.multiplierX}x</div>
                  </div>
                  
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">If {game.teamY} wins:</div>
                    <div className="text-lg font-bold">${calculateReturns(betAmounts[game.id], game.multiplierY)}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Multiplier: {game.multiplierY}x</div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <button 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={betAmounts[game.id] === 0}
                    onClick={() => {
                      // Create PhonePe deeplink with the specified number and bet amount
                      const phoneNumber = "9113340204";
                      const amount = betAmounts[game.id];
                      const description = `Bet on ${game.teamX} vs ${game.teamY}`;
                      
                      // PhonePe deeplink format
                      const phonePeLink = `phonepe://pay?pn=${encodeURIComponent(phoneNumber)}&pa=${encodeURIComponent(phoneNumber + "@ybl")}&am=${amount}&cu=INR&tn=${encodeURIComponent(description)}`;
                      
                      // Open the deeplink
                      window.location.href = phonePeLink;
                    }}
                  >
                    Pay with PhonePe
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Secret Key Modal */}
      {showSecretKeyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-bold mb-4">Admin Authorization Required</h2>
            <p className="mb-4 text-gray-600 dark:text-gray-400">
              Please enter the admin secret key to {adminAction === 'create' ? 'add a new game' : 'delete this game'}.
            </p>
            
            <div className="mb-4">
              <label htmlFor="secretKey" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Secret Key
              </label>
              <input
                type="password"
                id="secretKey"
                value={secretKey}
                onChange={(e) => setSecretKey(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                placeholder="Enter secret key"
              />
            </div>
            
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowSecretKeyModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleSecretKeySubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                disabled={!secretKey}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Game Form Modal */}
      {showGameFormModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-bold mb-4">Add New Game</h2>
            
            <form onSubmit={handleCreateGame}>
              <div className="mb-4">
                <label htmlFor="teamX" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Team X
                </label>
                <input
                  type="text"
                  id="teamX"
                  name="teamX"
                  value={newGame.teamX}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                  placeholder="First team name"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="teamY" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Team Y
                </label>
                <input
                  type="text"
                  id="teamY"
                  name="teamY"
                  value={newGame.teamY}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                  placeholder="Second team name"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="sport" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Sport
                </label>
                <input
                  type="text"
                  id="sport"
                  name="sport"
                  value={newGame.sport}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                  placeholder="Sport type"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="multiplierX" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Team X Multiplier
                </label>
                <input
                  type="number"
                  id="multiplierX"
                  name="multiplierX"
                  value={newGame.multiplierX}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                  placeholder="1.5"
                  step="0.1"
                  min="1"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="multiplierY" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Team Y Multiplier
                </label>
                <input
                  type="number"
                  id="multiplierY"
                  name="multiplierY"
                  value={newGame.multiplierY}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                  placeholder="1.5"
                  step="0.1"
                  min="1"
                  required
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowGameFormModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                  Add Game
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}