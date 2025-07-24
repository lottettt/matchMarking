import { useState } from 'react'

interface AddPlayerModalProps {
  onAddPlayer: (name: string, level: string) => void
  onClose: () => void
  existingPlayerNames: string[]
}

export default function AddPlayerModal({ onAddPlayer, onClose, existingPlayerNames }: AddPlayerModalProps) {
  const [playerName, setPlayerName] = useState('')
  const [playerLevel, setPlayerLevel] = useState('Beginner')
  const [error, setError] = useState('')

  const playerLevels = ['Professional', 'Intermediate', 'Beginner', 'Unknown']

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    if (!playerName.trim()) {
      setError('Player name is required')
      return
    }
    
    if (existingPlayerNames.includes(playerName.trim())) {
      setError('A player with this name already exists')
      return
    }
    
    onAddPlayer(playerName.trim(), playerLevel)
    setPlayerName('')
    setPlayerLevel('Beginner')
    setError('')
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-modal-appear">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-indigo-600">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM3 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 019.374 21c-2.331 0-4.512-.645-6.374-1.765z" />
              </svg>
              Add New Player
            </h2>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 transition-colors p-1"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Player Name Input */}
            <div>
              <label htmlFor="playerName" className="block text-sm font-medium text-slate-700 mb-2">
                Player Name
              </label>
              <input
                type="text"
                id="playerName"
                value={playerName}
                onChange={(e) => {
                  setPlayerName(e.target.value)
                  setError('')
                }}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all duration-300"
                placeholder="Enter player name"
                autoFocus
              />
            </div>

            {/* Player Level Selection */}
            <div>
              <label htmlFor="playerLevel" className="block text-sm font-medium text-slate-700 mb-2">
                Player Level
              </label>
              <select
                id="playerLevel"
                value={playerLevel}
                onChange={(e) => setPlayerLevel(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all duration-300 bg-white"
              >
                {playerLevels.map(level => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl font-medium transition-all duration-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white rounded-xl font-medium shadow-lg transform hover:scale-105 transition-all duration-300"
              >
                Add Player
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
