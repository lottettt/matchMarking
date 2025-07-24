import React, { useState, useMemo } from 'react'
import { Player } from '../types'

interface PlayerModalProps {
  matchId: string
  team: number
  slotIdx: number
  availablePlayers: Player[]
  onSelectPlayer: (matchId: string, team: number, slotIdx: number, player: Player) => void
  onClose: () => void
  columns?: number
}

const getLevelColor = (level?: string) => {
  if (level === "Professional") return "bg-red-100 text-red-700 border-red-200 hover:bg-red-200"
  if (level === "Intermediate") return "bg-green-100 text-green-700 border-green-200 hover:bg-green-200"
  if (level === "Beginner") return "bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200"
  return "bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200"
}

const getStateIcon = (state: string) => {
  return state === 'ready' 
    ? { letter: 'R', bgColor: 'bg-green-500', textColor: 'text-white' }
    : { letter: 'S', bgColor: 'bg-yellow-500', textColor: 'text-white' }
}

const PlayerModal: React.FC<PlayerModalProps> = ({ matchId, team, slotIdx, availablePlayers, onSelectPlayer, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLevel, setSelectedLevel] = useState<string>('All')
  const [selectedState, setSelectedState] = useState<string>('All')

  // Filter and search players
  const filteredPlayers = useMemo(() => {
    return availablePlayers.filter(player => {
      const matchesSearch = player.name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesLevel = selectedLevel === 'All' || player.level === selectedLevel
      const matchesState = selectedState === 'All' || player.state === selectedState
      return matchesSearch && matchesLevel && matchesState
    })
  }, [availablePlayers, searchTerm, selectedLevel, selectedState])

  // Group players by level
  const playersByLevel = useMemo(() => {
    const grouped = filteredPlayers.reduce((acc, player) => {
      const level = player.level || 'Unknown'
      if (!acc[level]) acc[level] = []
      acc[level].push(player)
      return acc
    }, {} as Record<string, Player[]>)
    
    // Sort levels and players
    const levelOrder = ['Professional', 'Intermediate', 'Beginner', 'Unknown']
    const sortedGroups: [string, Player[]][] = []
    
    levelOrder.forEach(level => {
      if (grouped[level]) {
        sortedGroups.push([level, grouped[level]])
      }
    })
    
    return sortedGroups
  }, [filteredPlayers])

  const levels = ['All', 'Professional', 'Intermediate', 'Beginner', 'Unknown']
  const states = ['All', 'ready', 'standby']

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4">
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-white/30 animate-fade-in">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-500 to-blue-500 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-2xl font-bold flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                </svg>
                Select Player for Team {team}
              </h4>
              <p className="text-indigo-100 mt-1">Choose a player for position {slotIdx + 1}</p>
            </div>
            <button 
              onClick={onClose}
              className="text-white/80 hover:text-white hover:bg-white/20 rounded-full p-2 transition-all duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="p-6 border-b border-gray-200 bg-white/50">
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search players by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white/80 backdrop-blur-sm"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-600">Level:</span>
                <div className="flex gap-1">
                  {levels.map(level => (
                    <button
                      key={level}
                      onClick={() => setSelectedLevel(level)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                        selectedLevel === level
                          ? level === 'Professional' ? 'bg-red-500 text-white'
                          : level === 'Intermediate' ? 'bg-green-500 text-white'
                          : level === 'Beginner' ? 'bg-blue-500 text-white'
                          : level === 'Unknown' ? 'bg-gray-500 text-white'
                          : 'bg-indigo-500 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-600">Status:</span>
                <div className="flex gap-1">
                  {states.map(state => (
                    <button
                      key={state}
                      onClick={() => setSelectedState(state)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                        selectedState === state
                          ? state === 'ready' ? 'bg-green-500 text-white'
                          : state === 'standby' ? 'bg-yellow-500 text-white'
                          : 'bg-indigo-500 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {state === 'All' ? 'All' : state.charAt(0).toUpperCase() + state.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Results Count */}
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Showing {filteredPlayers.length} of {availablePlayers.length} players</span>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  Clear search
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Players List */}
        <div className="p-6 overflow-y-auto max-h-96">
          {filteredPlayers.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-gray-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No players found</h3>
              <p className="text-gray-500">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="space-y-6">
              {playersByLevel.map(([level, players]) => (
                <div key={level} className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${
                      level === 'Professional' ? 'bg-red-500' :
                      level === 'Intermediate' ? 'bg-green-500' :
                      level === 'Beginner' ? 'bg-blue-500' : 'bg-gray-500'
                    }`}></div>
                    <h5 className="font-semibold text-gray-700">{level} Level</h5>
                    <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      {players.length}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {players.map(player => {
                      const statusInfo = getStateIcon(player.state)
                      return (
                        <button 
                          key={player.id} 
                          onClick={() => onSelectPlayer(matchId, team, slotIdx, player)}
                          className={`p-4 rounded-xl border-2 transition-all duration-200 text-left hover:shadow-lg hover:scale-105 transform relative ${getLevelColor(player.level)}`}
                        >
                          {/* Status badge in top right */}
                          <div className={`absolute top-2 right-2 w-6 h-6 ${statusInfo.bgColor} ${statusInfo.textColor} rounded-md flex items-center justify-center text-xs font-bold shadow-sm`}>
                            {statusInfo.letter}
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/80 rounded-full flex items-center justify-center text-lg font-bold shadow-sm">
                              {player.name.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-semibold text-sm truncate">{player.name}</div>
                              <div className="text-xs text-gray-600 mt-1">
                                Today: {player.todayMatches || 0} match{(player.todayMatches || 0) !== 1 ? 'es' : ''}
                              </div>
                            </div>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 bg-gray-50 border-t border-gray-200">
          <div className="flex justify-end gap-3">
            <button 
              onClick={onClose}
              className="px-6 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors duration-200"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PlayerModal 