// Home dashboard for Match Marking. Shows welcome, active matches, 3D preview, and quick actions.
import { useSession } from "next-auth/react"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { Fragment } from "react"
import Link from "next/link"

// Import extracted components
import MatchCard from '@/components/MatchCard'
import PlayerCard from '@/components/PlayerCard'
import CourtCard from '@/components/CourtCard'
import CourtModal from '@/components/CourtModal'
import PlayerModal from '@/components/PlayerModal'
import { Player, Court, Match } from '../types'

const mockMatches: Match[] = [
  {
    id: "1",
    name: "Court 1 Match",
    status: "Ongoing",
    players: [
      { id: "p1", name: "Alice", state: "ready", image: "/next.svg", rank: 1, team: 1 },
      { id: "p2", name: "Bob", state: "standby", image: "/next.svg", rank: 2, team: 1 }
    ],
    court: { id: "c1", name: "Court 1", status: "occupied" }
  },
  {
    id: "2",
    name: "Court 2 Match",
    status: "Pending",
    players: [],
    court: null
  },
  {
    id: "3",
    name: "Court 3 Match",
    status: "Ended",
    players: [
      { id: "p3", name: "Carol", state: "ready", image: "/next.svg", rank: 3, team: 1 },
      { id: "p4", name: "Dave", state: "standby", image: "/next.svg", rank: 4, team: 2 }
    ],
    court: { id: "c2", name: "Court 2", status: "available" }
  }
]

// Mock courts and players for admin view
const mockCourts: Court[] = [
  { id: "c1", name: "Court 1", status: "occupied" },
  { id: "c2", name: "Court 2", status: "occupied" },
  { id: "c3", name: "Court 3", status: "available" }
]
// Update mockPlayers to include level
const mockPlayers: Player[] = [
  // Professional (red)
  { id: "p1", name: "Alice", state: "ready", image: "/next.svg", rank: 1, team: 1, level: "Professional" },
  { id: "p2", name: "Bob", state: "standby", image: "/next.svg", rank: 2, team: 1, level: "Professional" },
  { id: "p3", name: "Carol", state: "ready", image: "/next.svg", rank: 3, team: 2, level: "Professional" },
  { id: "p4", name: "Dave", state: "standby", image: "/next.svg", rank: 4, team: 2, level: "Professional" },
  { id: "p5", name: "Eve", state: "ready", image: "/next.svg", rank: 5, team: 2, level: "Professional" },
  // Sportship (orange)
  { id: "p6", name: "Frank", state: "ready", image: "/next.svg", rank: 6, team: 1, level: "Sportship" },
  { id: "p7", name: "Grace", state: "standby", image: "/next.svg", rank: 7, team: 1, level: "Sportship" },
  { id: "p8", name: "Heidi", state: "ready", image: "/next.svg", rank: 8, team: 2, level: "Sportship" },
  { id: "p9", name: "Ivan", state: "standby", image: "/next.svg", rank: 9, team: 2, level: "Sportship" },
  { id: "p10", name: "Judy", state: "ready", image: "/next.svg", rank: 10, team: 2, level: "Sportship" },
  // Intermediate (green)
  { id: "p11", name: "Ken", state: "ready", image: "/next.svg", rank: 11, team: 1, level: "Intermediate" },
  { id: "p12", name: "Liam", state: "standby", image: "/next.svg", rank: 12, team: 1, level: "Intermediate" },
  { id: "p13", name: "Mona", state: "ready", image: "/next.svg", rank: 13, team: 2, level: "Intermediate" },
  { id: "p14", name: "Nina", state: "standby", image: "/next.svg", rank: 14, team: 2, level: "Intermediate" },
  { id: "p15", name: "Oscar", state: "ready", image: "/next.svg", rank: 15, team: 2, level: "Intermediate" },
  // Beginner (blue)
  { id: "p16", name: "Paul", state: "ready", image: "/next.svg", rank: 16, team: 1, level: "Beginner" },
  { id: "p17", name: "Quinn", state: "standby", image: "/next.svg", rank: 17, team: 1, level: "Beginner" },
  { id: "p18", name: "Rita", state: "ready", image: "/next.svg", rank: 18, team: 2, level: "Beginner" },
  { id: "p19", name: "Sam", state: "standby", image: "/next.svg", rank: 19, team: 2, level: "Beginner" },
  { id: "p20", name: "Tina", state: "ready", image: "/next.svg", rank: 20, team: 2, level: "Beginner" },
  // Unknown (grey)
  { id: "p21", name: "Uma", state: "ready", image: "/next.svg", rank: 21, team: 1, level: "Unknown" },
  { id: "p22", name: "Vince", state: "standby", image: "/next.svg", rank: 22, team: 1, level: "Unknown" },
  { id: "p23", name: "Wendy", state: "ready", image: "/next.svg", rank: 23, team: 2, level: "Unknown" },
  { id: "p24", name: "Xander", state: "standby", image: "/next.svg", rank: 24, team: 2, level: "Unknown" },
  { id: "p25", name: "Yara", state: "ready", image: "/next.svg", rank: 25, team: 2, level: "Unknown" },
]

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login")
    }
  }, [status, router])

  // Helper to get user role (for mock/demo)
  const getUserRole = () => {
    return (session?.user && (session.user as { role?: string }).role) || undefined
  }

  // Use state for courts so we can add/remove
  const [courts, setCourts] = useState<Court[]>(mockCourts)
  // Add new court handler
  const handleAddCourt = () => {
    const newId = `c${courts.length + 1}`
    setCourts([...courts, { id: newId, name: `Court ${courts.length + 1}`, status: "available" }])
  }
  // Remove court handler
  const handleRemoveCourt = (id: string) => {
    setCourts(courts.filter(c => c.id !== id))
  }

  // Use state for matches so we can add/assign
  const [matches, setMatches] = useState<Match[]>(mockMatches)
  // Add new match handler
  const handleAddMatch = () => {
    const newId = `${matches.length + 1}`
    setMatches([
      ...matches,
      { id: newId, name: `Match ${matches.length + 1}`, status: "Pending", players: [], court: null }
    ])
  }

  // Remove match handler
  const handleRemoveMatch = (matchId: string) => {
    setMatches(matches => matches.filter(m => m.id !== matchId))
  }
  // Number of slots per team is now defined in MatchCard component
  // Add modal state for player selection
  const [playerModal, setPlayerModal] = useState<{ matchId: string, team: number, slotIdx: number } | null>(null)

  // Add filter state for match status
  const [matchFilters, setMatchFilters] = useState<string[]>(['Pending', 'Ongoing'])

  // Helper: available players (not in any match)
  const assignedPlayerIds = new Set(matches.flatMap(m => m.players.map(p => p.id)))
  const availablePlayers = mockPlayers.filter(p => !assignedPlayerIds.has(p.id))

  // Assign player from modal
  const handleSelectPlayer = (matchId: string, team: number, slotIdx: number, player: Player) => {
    setMatches(matches => matches.map(m => {
      if (m.id !== matchId) return m
      // Remove player from any team in this match
      let newPlayers = m.players.filter(p => p.id !== player.id)
      // Assign to this team and slot
      const playerWithTeam = { ...player, team }
      // Fill up to slotIdx with nulls if needed
      const teamPlayers: (Player | null)[] = newPlayers.filter(p => p.team === team)
      while (teamPlayers.length < slotIdx) teamPlayers.push(null)
      teamPlayers[slotIdx] = playerWithTeam
      // Remove all players of this team from newPlayers, then add back the new teamPlayers
      newPlayers = newPlayers.filter(p => p.team !== team)
      newPlayers = [...newPlayers, ...teamPlayers.filter(Boolean) as Player[]]
      // Keep other team as is
      return { ...m, players: newPlayers }
    }))
    setPlayerModal(null)
  }

  // Modal state for court selection
  const [courtModalMatchId, setCourtModalMatchId] = useState<string | null>(null)

  // Helper: available courts (not assigned to any match)
  const assignedCourtIds = new Set(matches.filter(m => m.court).map(m => m.court!.id))
  const availableCourts = courts.filter(c => c.status === 'available' && !assignedCourtIds.has(c.id))

  // Assign court from modal
  const handleSelectCourt = (matchId: string, court: Court) => {
    setMatches(matches => matches.map(m => m.id === matchId ? { ...m, court } : m))
    setCourtModalMatchId(null)
  }

  return (
    <div className="min-h-screen relative flex flex-col items-center px-2 sm:px-4 py-4 sm:py-8 font-poppins overflow-x-hidden">
      {/* Immersive 3D Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-80 h-80 bg-gradient-to-br from-blue-300/20 to-indigo-300/10 rounded-full blur-3xl float-animation"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tr from-pink-200/20 to-purple-200/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-gradient-to-br from-emerald-200/10 to-cyan-200/10 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2 animate-gradient-shift"></div>
      </div>

      {/* Animated Background Layer */}
      <div className="absolute inset-0 -z-5 animated-bg opacity-30"></div>
      {/* Modal for court selection */}
      {courtModalMatchId && (
        <CourtModal
          matchId={courtModalMatchId}
          availableCourts={availableCourts}
          onSelectCourt={handleSelectCourt}
          onClose={() => setCourtModalMatchId(null)}
        />
      )}
      {/* Modal for player selection */}
      {playerModal && (
        <PlayerModal
          matchId={playerModal.matchId}
          team={playerModal.team}
          slotIdx={playerModal.slotIdx}
          availablePlayers={availablePlayers}
          onSelectPlayer={handleSelectPlayer}
          onClose={() => setPlayerModal(null)}
          columns={3}
        />
      )}
      {/* Main container */}
      <div className="w-full max-w-7xl flex flex-col gap-10">
        {/* Welcome Section */}
        <div className="glass-card rounded-xl p-4 flex flex-col sm:flex-row items-center gap-3 shadow-lg backdrop-blur-xl bg-white/80">
          <div className="rounded-full w-10 h-10 bg-gradient-to-br from-indigo-500 to-blue-500 shadow-lg flex items-center justify-center text-lg font-bold text-white">
            M
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-lg sm:text-xl font-bold text-slate-800">
              Welcome{session?.user?.name ? `, ${session.user.name}` : "!"}
            </h2>
            <div className="text-slate-600 text-sm">Ready to manage your matches?</div>
          </div>
        </div>
        {/* Matches Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
            <h3 className="text-3xl font-bold text-slate-800 tracking-tight animate-glow flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-indigo-600">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-2.755m1.982 2.755a9.006 9.006 0 001.982-2.755m-1.982 2.755H9.497m1.982-2.755a9.006 9.006 0 00-1.982 2.755m4.975 0a7.479 7.479 0 00.982-2.755m-4.975 2.755H9.497" />
              </svg>
              Match making
            </h3>
            <button 
              onClick={handleAddMatch} 
              className="bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transform hover:scale-105 transition-all duration-300 btn-3d"
            >
              Create Match
            </button>
          </div>
          
          {/* Match Status Filter */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-2 items-center justify-between">
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-sm font-medium text-slate-600 mr-2">Filter by status:</span>
                {['Pending', 'Ongoing', 'Ended'].map(status => (
                  <button
                    key={status}
                    onClick={() => {
                      setMatchFilters(prev => 
                        prev.includes(status) 
                          ? prev.filter(s => s !== status)
                          : [...prev, status]
                      )
                    }}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 shadow-md ${
                      matchFilters.includes(status)
                        ? status === 'Ongoing' 
                          ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white border border-green-300'
                          : status === 'Pending'
                          ? 'bg-gradient-to-r from-yellow-500 to-amber-500 text-white border border-yellow-300'
                          : 'bg-gradient-to-r from-gray-500 to-slate-500 text-white border border-gray-300'
                        : 'bg-white/50 text-slate-500 border border-slate-300 hover:bg-white/80'
                    }`}
                  >
                    {status}
                  </button>
                ))}
                <button
                  onClick={() => setMatchFilters(['Pending', 'Ongoing', 'Ended'])}
                  className="px-3 py-2 rounded-lg text-xs font-medium bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all duration-300 ml-2"
                >
                  Show All
                </button>
                <button
                  onClick={() => setMatchFilters(['Pending', 'Ongoing'])}
                  className="px-3 py-2 rounded-lg text-xs font-medium bg-indigo-100 text-indigo-600 hover:bg-indigo-200 transition-all duration-300"
                >
                  Reset
                </button>
              </div>
              <div className="text-sm text-slate-500">
                Showing {matches.filter(match => matchFilters.includes(match.status)).length} of {matches.length} matches
              </div>
            </div>
          </div>
          {/* In the matches grid, set 3 columns for lg+ screens, 2 for md, 1 for mobile */}
          <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {matches
              .filter(match => matchFilters.includes(match.status))
              .sort((a, b) => {
                // Sort by status: Pending first, then Ongoing, then Ended
                const statusOrder = { 'Pending': 0, 'Ongoing': 1, 'Ended': 2 }
                const aOrder = statusOrder[a.status as keyof typeof statusOrder] ?? 3
                const bOrder = statusOrder[b.status as keyof typeof statusOrder] ?? 3
                return aOrder - bOrder
              })
              .map(match => (
              <MatchCard
                key={match.id}
                match={match}
                onRemoveCourt={() => setMatches(matches => matches.map(m => m.id === match.id ? { ...m, court: null } : m))}
                onAddCourt={() => setCourtModalMatchId(match.id)}
                onSelectPlayer={(team, slotIdx) => setPlayerModal({ matchId: match.id, team, slotIdx })}
                onRemovePlayer={(playerId) => setMatches(matches => matches.map(m => 
                  m.id === match.id 
                    ? { ...m, players: m.players.filter(p => p.id !== playerId) }
                    : m
                ))}
                onRemoveMatch={() => handleRemoveMatch(match.id)}
              />
            ))}
          </div>
        </div>
        {/* Player List */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3 animate-glow">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 text-indigo-600">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
            </svg>
            Available Players
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {availablePlayers.map(player => (
              <PlayerCard
                key={player.id}
                player={player}
              />
            ))}
          </div>
        </div>
        {/* Courts */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
            <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-3 animate-glow">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 text-indigo-600">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 9h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
              </svg>
              Courts
            </h3>
            <button 
              onClick={handleAddCourt} 
              className="bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transform hover:scale-105 transition-all duration-300 btn-3d w-full sm:w-auto"
            >
              Add Court
            </button>
          </div>
          {/* In the courts grid, make court cards smaller and span 1 column always */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
            {courts.map(court => (
              <CourtCard
                key={court.id}
                court={court}
                onRemove={handleRemoveCourt}
              />
            ))}
          </div>
        </div>

        {/* Admin-only: Court and Player Management */}
        {getUserRole() === 'admin' && (
          <>
            {/* List of Courts */}
            <div className="bg-gray-50 rounded-lg p-4 shadow-sm flex flex-col gap-2">
              <div className="font-semibold text-base mb-1">Courts Management</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {mockCourts.map(court => (
                  <div key={court.id} className="border border-gray-200 rounded-lg p-2 flex flex-col gap-1 bg-white">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-blue-700 text-sm">{court.name}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ml-2 ${court.status === 'available' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'}`}>{court.status}</span>
                    </div>
                    <div className="flex gap-1 mt-1">
                      <button className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs font-medium hover:bg-blue-100 transition">Edit</button>
                      <button className="bg-red-50 text-red-700 px-2 py-0.5 rounded text-xs font-medium hover:bg-red-100 transition">Delete</button>
                      {court.status === 'occupied' && (
                        <Link href="/match/1" className="bg-green-50 text-green-700 px-2 py-0.5 rounded text-xs font-medium hover:bg-green-100 transition">View</Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <button className="mt-2 bg-blue-600 text-white px-3 py-1.5 rounded text-sm font-medium hover:bg-blue-700 transition self-start">Add Court</button>
            </div>
            {/* List of Players in Ready and Standby */}
            <div className="bg-gray-50 rounded-lg p-4 shadow-sm flex flex-col gap-2">
              <div className="font-semibold text-base mb-1">Players Management</div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="font-medium text-green-700 mb-1 text-sm">Ready</div>
                  {mockPlayers.filter(p => p.state === 'ready').map(p => (
                    <div key={p.id} className="flex items-center gap-2 justify-between bg-white border border-gray-200 rounded px-2 py-1 mb-1">
                      <span className="text-sm">{p.name}</span>
                      <div className="flex gap-1">
                        <button className="bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded text-xs font-medium hover:bg-blue-100 transition">Edit</button>
                        <button className="bg-red-50 text-red-700 px-1.5 py-0.5 rounded text-xs font-medium hover:bg-red-100 transition">Remove</button>
                      </div>
                    </div>
                  ))}
                </div>
                <div>
                  <div className="font-medium text-yellow-700 mb-1 text-sm">Standby</div>
                  {mockPlayers.filter(p => p.state === 'standby').map(p => (
                    <div key={p.id} className="flex items-center gap-2 justify-between bg-white border border-gray-200 rounded px-2 py-1 mb-1">
                      <span className="text-sm">{p.name}</span>
                      <div className="flex gap-1">
                        <button className="bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded text-xs font-medium hover:bg-blue-100 transition">Edit</button>
                        <button className="bg-red-50 text-red-700 px-1.5 py-0.5 rounded text-xs font-medium hover:bg-red-100 transition">Remove</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <button className="mt-2 bg-blue-600 text-white px-3 py-1.5 rounded text-sm font-medium hover:bg-blue-700 transition self-start">Add Player</button>
            </div>
          </>
        )}

      </div>
      {/* Custom 3D perspective utility */}
      <style jsx global>{`
        .perspective-3d {
          perspective: 800px;
        }
      `}</style>
    </div>
  )
}
