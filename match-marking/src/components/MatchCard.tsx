import React from 'react'
import { Player, Match } from '../types'

interface MatchCardProps {
  match: Match
  onRemoveCourt: () => void
  onAddCourt: () => void
  onSelectPlayer: (team: number, slotIdx: number, player: Player | null) => void
  onRemovePlayer: (playerId: string) => void
  onRemoveMatch: () => void
  TEAM_SIZE?: number
}

const getLevelColor = (level?: string) => {
  if (level === "Professional") return "status-rejected"
  if (level === "Sportship") return "status-pending"
  if (level === "Intermediate") return "status-approved"
  if (level === "Beginner") return "bg-gradient-to-r from-blue-400 to-blue-500 text-white border border-blue-300/30"
  return "bg-gradient-to-r from-slate-300 to-slate-400 text-white border border-slate-300/30"
}

const getMatchStatusStyle = (status: string) => {
  switch (status.toLowerCase()) {
    case 'ongoing':
      return "bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border border-green-200"
    case 'pending':
      return "bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-700 border border-yellow-200"
    case 'ended':
      return "bg-gradient-to-r from-gray-100 to-slate-100 text-gray-700 border border-gray-200"
    default:
      return "bg-gradient-to-r from-indigo-100 to-blue-100 text-indigo-700 border border-indigo-200"
  }
}

const getMatchCardBorderStyle = (status: string) => {
  switch (status.toLowerCase()) {
    case 'ongoing':
      return "border-green-300/50"
    case 'pending':
      return "border-yellow-300/50"
    case 'ended':
      return "border-gray-300/50"
    default:
      return "border-slate-200/50"
  }
}

const MatchCard: React.FC<MatchCardProps> = ({ match, onRemoveCourt, onAddCourt, onSelectPlayer, onRemovePlayer, onRemoveMatch, TEAM_SIZE = 2 }) => {
  // Get current date for display
  const currentDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'short', 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  })

  return (
    <div className={`glass-card rounded-3xl p-8 shadow-2xl backdrop-blur-xl bg-white/80 min-h-[200px] border w-full transition-all duration-300 ${getMatchCardBorderStyle(match.status)} relative`}>
      {/* Remove button - only show for pending matches */}
      {match.status === 'Pending' && (
        <button
          onClick={onRemoveMatch}
          className="absolute top-4 right-4 p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50/50 transition-all duration-300 z-10"
          title="Remove match"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
      
      <div className="flex items-center gap-3 mb-4">
        <span className="font-bold text-indigo-600 text-xl drop-shadow-sm">{match.name}</span>
        <span className={`text-sm px-3 py-1 rounded-full ml-2 shadow-lg font-medium ${getMatchStatusStyle(match.status)}`}>
          {match.status}
        </span>
      </div>
    
    <div className="plan-cell p-4 rounded-xl bg-gradient-to-r from-green-50/50 to-emerald-50/30 border border-green-200/30 mb-4">
      <div className="flex items-center gap-3 min-h-[2.5rem]">
        <span className="font-bold text-sm text-emerald-600 flex items-center gap-2 flex-shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 9h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
          </svg>
          Court:
        </span>
        <div className="flex gap-3 items-center flex-1">
          {match.court ? (
            <span className="inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium shadow-lg transition-all duration-300 bg-gradient-to-r from-emerald-400 to-green-500 text-white border border-emerald-300/30">
              <span className="font-bold mr-2">{match.court.name}</span>
              {match.status === 'Pending' && (
                <button 
                  onClick={onRemoveCourt} 
                  className="ml-1 bg-white/20 text-current px-1.5 py-0.5 rounded-full text-xs font-medium hover:bg-white/30 transition-all duration-200"
                  title="Remove court"
                >
                  ×
                </button>
              )}
            </span>
          ) : (
            match.status === 'Pending' && (
              <button
                onClick={onAddCourt}
                className="inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium border-2 border-dashed border-emerald-300 text-emerald-500 bg-white/50 hover:border-emerald-400 hover:text-emerald-600 transition-all duration-300 shadow-lg"
              >
                + Add
              </button>
            )
          )}
        </div>
      </div>
    </div>

    <div className="flex flex-col gap-4">
      {/* Team 1 */}
      <div className="plan-cell p-4 rounded-xl bg-gradient-to-r from-blue-50/50 to-indigo-50/30 border border-blue-200/30">
        <div className="flex items-center gap-3 min-h-[2.5rem]">
          <span className="font-bold text-sm text-indigo-600 flex items-center gap-2 flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
            </svg>
            Team 1:
          </span>
          <div className="flex gap-3 items-center flex-1">
            {[...Array(TEAM_SIZE)].map((_, idx) => {
              const teamPlayers = match.players.filter(p => p.team === 1)
              const player = teamPlayers[idx]
              return player ? (
                <span key={player.id} className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium shadow-lg border transition-all duration-300 ${getLevelColor(player.level)}`}>
                  <span className="font-bold mr-2">{player.name}</span>
                  {match.status === 'Pending' && (
                    <button 
                      onClick={() => onRemovePlayer(player.id)} 
                      className="ml-1 bg-white/20 text-current px-1.5 py-0.5 rounded-full text-xs font-medium hover:bg-white/30 transition-all duration-200"
                    >
                      ×
                    </button>
                  )}
                </span>
              ) : (
                match.status === 'Pending' && (
                  <button
                    key={"empty-1-" + idx}
                    className="inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium border-2 border-dashed border-blue-300 text-blue-500 bg-white/50 hover:border-blue-400 hover:text-blue-600 transition-all duration-300 shadow-lg"
                    onClick={() => onSelectPlayer(1, idx, null)}
                  >
                    + Add
                  </button>
                )
              )
            })}
          </div>
        </div>
      </div>

      {/* Team 2 */}
      <div className="plan-cell p-4 rounded-xl bg-gradient-to-r from-red-50/50 to-rose-50/30 border border-red-200/30">
        <div className="flex items-center gap-3 min-h-[2.5rem]">
          <span className="font-bold text-sm text-rose-600 flex items-center gap-2 flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
            </svg>
            Team 2:
          </span>
          <div className="flex gap-3 items-center flex-1">
            {[...Array(TEAM_SIZE)].map((_, idx) => {
              const teamPlayers = match.players.filter(p => p.team === 2)
              const player = teamPlayers[idx]
              return player ? (
                <span key={player.id} className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium shadow-lg border transition-all duration-300 ${getLevelColor(player.level)}`}>
                  <span className="font-bold mr-2">{player.name}</span>
                  {match.status === 'Pending' && (
                    <button 
                      onClick={() => onRemovePlayer(player.id)} 
                      className="ml-1 bg-white/20 text-current px-1.5 py-0.5 rounded-full text-xs font-medium hover:bg-white/30 transition-all duration-200"
                    >
                      ×
                    </button>
                  )}
                </span>
              ) : (
                match.status === 'Pending' && (
                  <button
                    key={"empty-2-" + idx}
                    className="inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium border-2 border-dashed border-red-300 text-red-500 bg-white/50 hover:border-red-400 hover:text-red-600 transition-all duration-300 shadow-lg"
                    onClick={() => onSelectPlayer(2, idx, null)}
                  >
                    + Add
                  </button>
                )
              )
            })}
          </div>
        </div>
      </div>
    </div>

    <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-200/50 text-sm text-slate-500">
      <div className="flex flex-col gap-1">
        <span className="flex items-center gap-1 text-xs">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5a2.25 2.25 0 002.25-2.25m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5a2.25 2.25 0 012.25 2.25v7.5" />
          </svg>
          {currentDate}
        </span>
        <span className="flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Start: 10:00
        </span>
      </div>
      <div className="flex flex-col gap-1 text-right">
        <span className="flex items-center gap-1 text-xs">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2m6-6a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Duration: 60m
        </span>
        <span className="flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          End: 11:00
        </span>
      </div>
    </div>

    <div className="flex gap-4 mt-6">
      <button className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 rounded-xl font-semibold shadow-lg transition-all duration-300">
        START
      </button>
      <button className="flex-1 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white py-3 rounded-xl font-semibold shadow-lg transition-all duration-300">
        END
      </button>
    </div>
  </div>
  )
}

export default MatchCard 