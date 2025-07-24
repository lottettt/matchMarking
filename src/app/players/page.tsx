'use client'

// Player management page - comprehensive view and management of all players
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import PlayerCard from '@/components/PlayerCard'
import AddPlayerModal from '@/components/AddPlayerModal'
import { Player } from '@/types'

// Mock players data
const mockPlayers: Player[] = [
  // Professional Level Players (Rank 1-8)
  { id: "p001", name: "Sarah Chen", state: "ready", image: "/next.svg", rank: 1, level: "Professional", todayMatches: 1, lastPlayTime: new Date(Date.now() - 2 * 60 * 60 * 1000) },
  { id: "p002", name: "David Kim", state: "ready", image: "/next.svg", rank: 2, level: "Professional", todayMatches: 2, lastPlayTime: new Date(Date.now() - 2 * 60 * 60 * 1000) },
  { id: "p003", name: "Emma Wilson", state: "ready", image: "/next.svg", rank: 3, level: "Professional", todayMatches: 1 },
  { id: "p004", name: "James Park", state: "ready", image: "/next.svg", rank: 4, level: "Professional", todayMatches: 1 },
  { id: "p005", name: "Rachel Torres", state: "standby", image: "/next.svg", rank: 5, level: "Professional", todayMatches: 0 },
  { id: "p006", name: "Marcus Johnson", state: "ready", image: "/next.svg", rank: 6, level: "Professional", todayMatches: 0 },
  { id: "p007", name: "Mike Rodriguez", state: "ready", image: "/next.svg", rank: 7, level: "Professional", todayMatches: 1 },
  { id: "p008", name: "Nina Petrov", state: "standby", image: "/next.svg", rank: 8, level: "Professional", todayMatches: 1, lastPlayTime: new Date(Date.now() - 5 * 60 * 60 * 1000) },

  // Intermediate Level Players
  { id: "p009", name: "Kevin Chang", state: "ready", image: "/next.svg", rank: 9, level: "Intermediate", todayMatches: 0 },
  { id: "p010", name: "Sophie Lee", state: "ready", image: "/next.svg", rank: 10, level: "Intermediate", todayMatches: 1, lastPlayTime: new Date(Date.now() - 6 * 60 * 60 * 1000) },
  { id: "p011", name: "Carlos Martinez", state: "standby", image: "/next.svg", rank: 11, level: "Intermediate", todayMatches: 0 },
  { id: "p012", name: "Lisa Zhang", state: "ready", image: "/next.svg", rank: 12, level: "Intermediate", todayMatches: 1 },

  // Beginner Level Players  
  { id: "p019", name: "Ben Taylor", state: "ready", image: "/next.svg", rank: 19, level: "Beginner", todayMatches: 0 },
  { id: "p020", name: "Tom Anderson", state: "ready", image: "/next.svg", rank: 20, level: "Beginner", todayMatches: 1 },
  { id: "p021", name: "Jessica Brown", state: "standby", image: "/next.svg", rank: 21, level: "Beginner", todayMatches: 0 },
  { id: "p022", name: "Maria Garcia", state: "ready", image: "/next.svg", rank: 22, level: "Beginner", todayMatches: 1 },
]

export default function PlayersPage() {
  const { status } = useSession()
  const router = useRouter()
  const [players, setPlayers] = useState<Player[]>(mockPlayers)
  const [showAddPlayerModal, setShowAddPlayerModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<'rank' | 'name' | 'level' | 'matches'>('rank')

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  // Handle player creation
  const handleCreatePlayer = (name: string, level: string) => {
    const newId = `p${String(players.length + 1).padStart(3, '0')}`
    const newPlayer: Player = {
      id: newId,
      name: name,
      state: "ready",
      image: "/next.svg",
      rank: players.length + 1,
      level: level,
      todayMatches: 0
    }
    setPlayers([...players, newPlayer])
    setShowAddPlayerModal(false)
  }

  // Filter and sort players
  const filteredPlayers = players
    .filter(player => 
      player.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      ['Professional', 'Intermediate', 'Beginner', 'Unknown'].includes(player.level || 'Unknown') &&
      ['ready', 'standby'].includes(player.state)
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'level':
          const levelOrder = ['Professional', 'Intermediate', 'Beginner', 'Unknown']
          return levelOrder.indexOf(a.level || 'Unknown') - levelOrder.indexOf(b.level || 'Unknown')
        case 'matches':
          return (b.todayMatches || 0) - (a.todayMatches || 0)
        default:
          return a.rank - b.rank
      }
    })

  // Group players by level
  const playersByLevel = filteredPlayers.reduce((acc, player) => {
    const level = player.level || 'Unknown'
    if (!acc[level]) acc[level] = []
    acc[level].push(player)
    return acc
  }, {} as Record<string, Player[]>)

  const stats = {
    total: players.length,
    ready: players.filter(p => p.state === 'ready').length,
    standby: players.filter(p => p.state === 'standby').length,
    professional: players.filter(p => p.level === 'Professional').length,
    intermediate: players.filter(p => p.level === 'Intermediate').length,
    beginner: players.filter(p => p.level === 'Beginner').length,
  }

  return (
    <div className="min-h-screen relative flex flex-col items-center px-2 sm:px-4 py-4 sm:py-8 font-poppins overflow-x-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-80 h-80 bg-gradient-to-br from-purple-300/20 to-indigo-300/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tr from-blue-200/20 to-cyan-200/10 rounded-full blur-3xl animate-pulse"></div>
      </div>

      {/* Add Player Modal */}
      {showAddPlayerModal && (
        <AddPlayerModal
          onAddPlayer={handleCreatePlayer}
          onClose={() => setShowAddPlayerModal(false)}
          existingPlayerNames={players.map(player => player.name)}
        />
      )}

      {/* Main container */}
      <div className="w-full max-w-7xl flex flex-col gap-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-indigo-600 hover:text-indigo-800 transition-colors">
              ← Back to Dashboard
            </Link>
            <h1 className="text-4xl font-bold text-slate-800 tracking-tight animate-glow flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-indigo-600">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
              </svg>
              Player Management
            </h1>
          </div>
          
          <button 
            onClick={() => setShowAddPlayerModal(true)}
            className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transform hover:scale-105 transition-all duration-300"
          >
            Add New Player
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl p-4 border border-blue-300">
            <div className="text-2xl font-bold text-blue-800">{stats.total}</div>
            <div className="text-sm text-blue-600">Total Players</div>
          </div>
          <div className="bg-gradient-to-br from-green-100 to-green-200 rounded-xl p-4 border border-green-300">
            <div className="text-2xl font-bold text-green-800">{stats.ready}</div>
            <div className="text-sm text-green-600">Ready</div>
          </div>
          <div className="bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-xl p-4 border border-yellow-300">
            <div className="text-2xl font-bold text-yellow-800">{stats.standby}</div>
            <div className="text-sm text-yellow-600">Standby</div>
          </div>
          <div className="bg-gradient-to-br from-red-100 to-red-200 rounded-xl p-4 border border-red-300">
            <div className="text-2xl font-bold text-red-800">{stats.professional}</div>
            <div className="text-sm text-red-600">Professional</div>
          </div>
          <div className="bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-xl p-4 border border-emerald-300">
            <div className="text-2xl font-bold text-emerald-800">{stats.intermediate}</div>
            <div className="text-sm text-emerald-600">Intermediate</div>
          </div>
          <div className="bg-gradient-to-br from-cyan-100 to-cyan-200 rounded-xl p-4 border border-cyan-300">
            <div className="text-2xl font-bold text-cyan-800">{stats.beginner}</div>
            <div className="text-sm text-cyan-600">Beginner</div>
          </div>
        </div>

        {/* Controls */}
        <div className="glass-card rounded-xl p-6 shadow-lg backdrop-blur-xl bg-white/80">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search */}
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search players..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            
            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'rank' | 'name' | 'level' | 'matches')}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="rank">Sort by Rank</option>
              <option value="name">Sort by Name</option>
              <option value="level">Sort by Level</option>
              <option value="matches">Sort by Matches</option>
            </select>
          </div>
        </div>

        {/* Players List */}
        {filteredPlayers.length > 0 ? (
          <div className="space-y-8">
            {Object.entries(playersByLevel)
              .sort(([a], [b]) => {
                const order = ['Professional', 'Intermediate', 'Beginner', 'Unknown']
                return order.indexOf(a) - order.indexOf(b)
              })
              .map(([level, levelPlayers]) => (
              <div key={level} className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-slate-700 flex items-center gap-2">
                    <div className={`w-4 h-4 rounded-full ${
                      level === 'Professional' ? 'bg-red-500' :
                      level === 'Intermediate' ? 'bg-green-500' :
                      level === 'Beginner' ? 'bg-blue-500' : 'bg-slate-500'
                    }`}></div>
                    {level} Level
                  </h3>
                  <span className="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                    {levelPlayers.length} player{levelPlayers.length !== 1 ? 's' : ''}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {levelPlayers.map(player => (
                    <PlayerCard key={player.id} player={player} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-slate-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-600 mb-2">No players found</h3>
            <p className="text-slate-500">Try adjusting your search or filters.</p>
          </div>
        )}
      </div>
    </div>
  )
}
