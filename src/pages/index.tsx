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
import AddCourtModal from '@/components/AddCourtModal'
import AddPlayerModal from '@/components/AddPlayerModal'
import { Player, Court, Match } from '../types'

const mockMatches: Match[] = [
  {
    id: "m001",
    name: "Singles Championship - Quarter Final",
    status: "Ongoing",
    players: [
      { id: "p001", name: "Sarah Chen", state: "ready", image: "/next.svg", rank: 1, team: 1, level: "Professional" },
      { id: "p007", name: "Mike Rodriguez", state: "ready", image: "/next.svg", rank: 7, team: 2, level: "Professional" }
    ],
    court: { id: "c001", name: "Center Court", status: "occupied" },
    startTime: new Date(Date.now() - 25 * 60 * 1000) // Started 25 minutes ago
  },
  {
    id: "m002", 
    name: "Doubles Match - Team Alpha vs Beta",
    status: "Ongoing",
    players: [
      { id: "p003", name: "Emma Wilson", state: "ready", image: "/next.svg", rank: 3, team: 1, level: "Intermediate" },
      { id: "p004", name: "James Park", state: "ready", image: "/next.svg", rank: 4, team: 1, level: "Intermediate" },
      { id: "p012", name: "Lisa Zhang", state: "ready", image: "/next.svg", rank: 12, team: 2, level: "Intermediate" },
      { id: "p015", name: "Alex Thompson", state: "ready", image: "/next.svg", rank: 15, team: 2, level: "Intermediate" }
    ],
    court: { id: "c002", name: "Court A", status: "occupied" },
    startTime: new Date(Date.now() - 15 * 60 * 1000) // Started 15 minutes ago
  },
  {
    id: "m003",
    name: "Beginner Tournament - Round 1",
    status: "Pending",
    players: [
      { id: "p020", name: "Tom Anderson", state: "ready", image: "/next.svg", rank: 20, team: 1, level: "Beginner" },
      { id: "p022", name: "Maria Garcia", state: "ready", image: "/next.svg", rank: 22, team: 2, level: "Beginner" }
    ],
    court: null
  },
  {
    id: "m004",
    name: "Mixed Doubles Practice",
    status: "Pending",
    players: [],
    court: null
  },
  {
    id: "m005",
    name: "Morning Singles Final",
    status: "Ended",
    players: [],
    court: null,
    startTime: new Date(Date.now() - 3 * 60 * 60 * 1000), // Started 3 hours ago
    endTime: new Date(Date.now() - 2 * 60 * 60 * 1000), // Ended 2 hours ago
    duration: 58,
    winner: "David Kim"
  },
  {
    id: "m006",
    name: "Intermediate Doubles Championship",
    status: "Ended",
    players: [],
    court: null,
    startTime: new Date(Date.now() - 5 * 60 * 60 * 1000), // Started 5 hours ago
    endTime: new Date(Date.now() - 4 * 60 * 60 * 1000), // Ended 4 hours ago
    duration: 42,
    winner: "Team Red"
  },
  {
    id: "m007",
    name: "Junior Practice Match",
    status: "Ended",
    players: [],
    court: null,
    startTime: new Date(Date.now() - 6.5 * 60 * 60 * 1000), // Started 6.5 hours ago
    endTime: new Date(Date.now() - 6 * 60 * 60 * 1000), // Ended 6 hours ago
    duration: 28,
    winner: "Sophie Lee"
  }
]

// Mock courts for the facility
const mockCourts: Court[] = [
  { id: "c001", name: "Center Court", status: "occupied" },
  { id: "c002", name: "Court A", status: "occupied" },
  { id: "c003", name: "Court B", status: "available" },
  { id: "c004", name: "Court C", status: "available" },
  { id: "c005", name: "Practice Court 1", status: "available" },
  { id: "c006", name: "Practice Court 2", status: "available" }
]
// Professional and competitive players with realistic badminton/tennis data
const mockPlayers: Player[] = [
  // Professional Level Players (Rank 1-8)
  { id: "p001", name: "Sarah Chen", state: "ready", image: "/next.svg", rank: 1, level: "Professional", todayMatches: 1, lastPlayTime: new Date(Date.now() - 2 * 60 * 60 * 1000) }, // 2 hours ago
  { id: "p002", name: "David Kim", state: "ready", image: "/next.svg", rank: 2, level: "Professional", todayMatches: 2, lastPlayTime: new Date(Date.now() - 2 * 60 * 60 * 1000) }, // 2 hours ago
  { id: "p003", name: "Emma Wilson", state: "ready", image: "/next.svg", rank: 3, level: "Professional", todayMatches: 1 },
  { id: "p004", name: "James Park", state: "ready", image: "/next.svg", rank: 4, level: "Professional", todayMatches: 1 },
  { id: "p005", name: "Rachel Torres", state: "standby", image: "/next.svg", rank: 5, level: "Professional", todayMatches: 0 },
  { id: "p006", name: "Marcus Johnson", state: "ready", image: "/next.svg", rank: 6, level: "Professional", todayMatches: 0 },
  { id: "p007", name: "Mike Rodriguez", state: "ready", image: "/next.svg", rank: 7, level: "Professional", todayMatches: 1 },
  { id: "p008", name: "Nina Petrov", state: "standby", image: "/next.svg", rank: 8, level: "Professional", todayMatches: 1, lastPlayTime: new Date(Date.now() - 5 * 60 * 60 * 1000) }, // 5 hours ago

  // Intermediate Level Players (Rank 9-18)
  { id: "p009", name: "Kevin Chang", state: "ready", image: "/next.svg", rank: 9, level: "Intermediate", todayMatches: 0 },
  { id: "p010", name: "Sophie Lee", state: "ready", image: "/next.svg", rank: 10, level: "Intermediate", todayMatches: 1, lastPlayTime: new Date(Date.now() - 6 * 60 * 60 * 1000) }, // 6 hours ago  
  { id: "p011", name: "Carlos Martinez", state: "standby", image: "/next.svg", rank: 11, level: "Intermediate", todayMatches: 0 },
  { id: "p012", name: "Lisa Zhang", state: "ready", image: "/next.svg", rank: 12, level: "Intermediate", todayMatches: 1 },
  { id: "p013", name: "Ryan O'Connor", state: "ready", image: "/next.svg", rank: 13, level: "Intermediate", todayMatches: 0 },
  { id: "p014", name: "Priya Sharma", state: "standby", image: "/next.svg", rank: 14, level: "Intermediate", todayMatches: 1, lastPlayTime: new Date(Date.now() - 4 * 60 * 60 * 1000) }, // 4 hours ago
  { id: "p015", name: "Alex Thompson", state: "ready", image: "/next.svg", rank: 15, level: "Intermediate", todayMatches: 1 },
  { id: "p016", name: "Maya Patel", state: "ready", image: "/next.svg", rank: 16, level: "Intermediate", todayMatches: 0 },
  { id: "p017", name: "Jordan Smith", state: "standby", image: "/next.svg", rank: 17, level: "Intermediate", todayMatches: 2, lastPlayTime: new Date(Date.now() - 3 * 60 * 60 * 1000) }, // 3 hours ago
  { id: "p018", name: "Amanda Foster", state: "ready", image: "/next.svg", rank: 18, level: "Intermediate", todayMatches: 0 },

  // Beginner Level Players (Rank 19-26)
  { id: "p019", name: "Ben Taylor", state: "ready", image: "/next.svg", rank: 19, level: "Beginner", todayMatches: 0 },
  { id: "p020", name: "Tom Anderson", state: "ready", image: "/next.svg", rank: 20, level: "Beginner", todayMatches: 1 },
  { id: "p021", name: "Jessica Brown", state: "standby", image: "/next.svg", rank: 21, level: "Beginner", todayMatches: 0 },
  { id: "p022", name: "Maria Garcia", state: "ready", image: "/next.svg", rank: 22, level: "Beginner", todayMatches: 1 },
  { id: "p023", name: "Daniel Miller", state: "ready", image: "/next.svg", rank: 23, level: "Beginner", todayMatches: 0 },
  { id: "p024", name: "Ashley Davis", state: "standby", image: "/next.svg", rank: 24, level: "Beginner", todayMatches: 1, lastPlayTime: new Date(Date.now() - 7 * 60 * 60 * 1000) }, // 7 hours ago
  { id: "p025", name: "Chris Wilson", state: "ready", image: "/next.svg", rank: 25, level: "Beginner", todayMatches: 0 },
  { id: "p026", name: "Lauren Moore", state: "ready", image: "/next.svg", rank: 26, level: "Beginner", todayMatches: 0 },

  // New/Unranked Players
  { id: "p027", name: "Jake Roberts", state: "ready", image: "/next.svg", rank: 27, level: "Unknown", todayMatches: 0 },
  { id: "p028", name: "Samantha Lee", state: "standby", image: "/next.svg", rank: 28, level: "Unknown", todayMatches: 0 },
  { id: "p029", name: "Michael Chen", state: "ready", image: "/next.svg", rank: 29, level: "Unknown", todayMatches: 0 },
  { id: "p030", name: "Anna Rodriguez", state: "ready", image: "/next.svg", rank: 30, level: "Unknown", todayMatches: 0 }
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
  // State for Add Court Modal
  const [showAddCourtModal, setShowAddCourtModal] = useState(false)
  
  // Add new court handler - now opens modal
  const handleAddCourt = () => {
    setShowAddCourtModal(true)
  }
  
  // Handle court creation with custom name
  const handleCreateCourt = (name: string) => {
    const newId = `c${String(courts.length + 1).padStart(3, '0')}`
    setCourts([...courts, { id: newId, name: name, status: "available" }])
    setShowAddCourtModal(false)
  }
  
  // Remove court handler
  const handleRemoveCourt = (id: string) => {
    setCourts(courts.filter(c => c.id !== id))
  }

  // Use state for matches so we can add/assign
  const [matches, setMatches] = useState<Match[]>(mockMatches)
  // Use state for players to track lastPlayTime
  const [players, setPlayers] = useState<Player[]>(mockPlayers)
  // State for Add Player Modal
  const [showAddPlayerModal, setShowAddPlayerModal] = useState(false)
  
  // Add new match handler
  const handleAddMatch = () => {
    const newId = `m${String(matches.length + 1).padStart(3, '0')}`
    setMatches([
      ...matches,
      { id: newId, name: `New Match ${matches.length + 1}`, status: "Pending", players: [], court: null }
    ])
  }

  // Add new player handler - opens modal
  const handleAddPlayer = () => {
    setShowAddPlayerModal(true)
  }
  
  // Handle player creation with custom name and level
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

  // Remove match handler
  const handleRemoveMatch = (matchId: string) => {
    setMatches(matches => matches.filter(m => m.id !== matchId))
  }

  // Start match handler - changes status to Ongoing and stamps start time
  const handleStartMatch = (matchId: string) => {
    setMatches(matches => matches.map(m => {
      if (m.id === matchId) {
        // Set court status to occupied if there's a court assigned
        if (m.court) {
          setCourts(courts => courts.map(c => 
            c.id === m.court!.id ? { ...c, status: "occupied" } : c
          ))
        }
        return { ...m, status: "Ongoing", startTime: new Date() }
      }
      return m
    }))
  }
  
  // End match handler - changes status to Ended, stamps end time, and releases players and court
  const handleEndMatch = (matchId: string) => {
    const endTime = new Date()
    
    setMatches(matches => matches.map(m => {
      if (m.id === matchId) {
        // Set court status back to available if there was a court assigned
        if (m.court) {
          setCourts(courts => courts.map(c => 
            c.id === m.court!.id ? { ...c, status: "available" } : c
          ))
        }
        
        // Update lastPlayTime for all players in this match
        if (m.players.length > 0) {
          setPlayers(players => players.map(p => 
            m.players.some(mp => mp.id === p.id) 
              ? { ...p, lastPlayTime: endTime }
              : p
          ))
        }
        
        return { 
          ...m, 
          status: "Ended", 
          endTime: endTime,
          players: [], // Release all players back to available pool
          court: null  // Release court back to available pool
        }
      }
      return m
    }))
  }
  // Number of slots per team is now defined in MatchCard component
  // Add modal state for player selection
  const [playerModal, setPlayerModal] = useState<{ matchId: string, team: number, slotIdx: number } | null>(null)

  // Add filter state for match status
  const [matchFilters, setMatchFilters] = useState<string[]>(['Pending', 'Ongoing'])

  // Add filter state for player levels
  const [playerFilters, setPlayerFilters] = useState<string[]>(['Professional', 'Intermediate', 'Beginner', 'Unknown'])
  const [playerStateFilter, setPlayerStateFilter] = useState<string[]>(['ready', 'standby'])

  // Helper: available players (not in any match)
  const assignedPlayerIds = new Set(matches.flatMap(m => m.players.map(p => p.id)))
  const availablePlayers = players
    .filter(p => 
      !assignedPlayerIds.has(p.id) && 
      playerFilters.includes(p.level || 'Unknown') &&
      playerStateFilter.includes(p.state)
    )
    .sort((a, b) => {
      // Sort by lastPlayTime in descending order (most recent first)
      // Players with no lastPlayTime go to the end
      if (!a.lastPlayTime && !b.lastPlayTime) return 0
      if (!a.lastPlayTime) return 1
      if (!b.lastPlayTime) return -1
      return b.lastPlayTime.getTime() - a.lastPlayTime.getTime()
    })

  // Group players by level
  const playersByLevel = availablePlayers.reduce((acc, player) => {
    const level = player.level || 'Unknown'
    if (!acc[level]) acc[level] = []
    acc[level].push(player)
    return acc
  }, {} as Record<string, Player[]>)

  // Player statistics
  const playerStats = {
    total: availablePlayers.length,
    ready: availablePlayers.filter(p => p.state === 'ready').length,
    standby: availablePlayers.filter(p => p.state === 'standby').length,
    byLevel: Object.entries(playersByLevel).map(([level, players]) => ({
      level,
      count: players.length
    }))
  }

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

  // Helper: available courts (not assigned to any ongoing match)
  const assignedCourtIds = new Set(
    matches
      .filter(m => m.court && m.status === 'Ongoing') // Only ongoing matches
      .map(m => m.court!.id)
  )
  const availableCourts = courts.filter(c => c.status === 'available' && !assignedCourtIds.has(c.id))

  // Assign court from modal
  const handleSelectCourt = (matchId: string, court: Court) => {
    // Set court status to occupied
    setCourts(courts => courts.map(c => 
      c.id === court.id ? { ...c, status: "occupied" } : c
    ))
    // Assign court to match
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
      {/* Modal for adding new court */}
      {showAddCourtModal && (
        <AddCourtModal
          onAddCourt={handleCreateCourt}
          onClose={() => setShowAddCourtModal(false)}
          existingCourtNames={courts.map(court => court.name)}
        />
      )}
      
      {/* Modal for adding new player */}
      {showAddPlayerModal && (
        <AddPlayerModal
          onAddPlayer={handleCreatePlayer}
          onClose={() => setShowAddPlayerModal(false)}
          existingPlayerNames={players.map(player => player.name)}
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
                onRemoveCourt={() => {
                  const currentMatch = matches.find(m => m.id === match.id)
                  if (currentMatch?.court) {
                    // Set court status back to available
                    setCourts(courts => courts.map(c => 
                      c.id === currentMatch.court!.id ? { ...c, status: "available" } : c
                    ))
                  }
                  // Remove court from match
                  setMatches(matches => matches.map(m => m.id === match.id ? { ...m, court: null } : m))
                }}
                onAddCourt={() => setCourtModalMatchId(match.id)}
                onSelectPlayer={(team, slotIdx) => setPlayerModal({ matchId: match.id, team, slotIdx })}
                onRemovePlayer={(playerId) => setMatches(matches => matches.map(m => 
                  m.id === match.id 
                    ? { ...m, players: m.players.filter(p => p.id !== playerId) }
                    : m
                ))}
                onRemoveMatch={() => handleRemoveMatch(match.id)}
                onStartMatch={() => handleStartMatch(match.id)}
                onEndMatch={() => handleEndMatch(match.id)}
              />
            ))}
          </div>
        </div>
        {/* Enhanced Player List */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
            <h3 className="text-3xl font-bold text-slate-800 tracking-tight animate-glow flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-indigo-600">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
              </svg>
              Available Players
            </h3>
            
            <div className="flex items-center gap-4">
              {/* Player Statistics */}
              <div className="bg-gradient-to-r from-indigo-100 to-blue-100 rounded-lg px-4 py-2 border border-indigo-200">
                <span className="font-semibold text-indigo-700">Total: {playerStats.total}</span>
              </div>
              
              {/* Add Player Button */}
              <button 
                onClick={handleAddPlayer} 
                className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transform hover:scale-105 transition-all duration-300 btn-3d"
              >
                Add Player
              </button>
            </div>
          </div>
          
          {/* Player Filters */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-4 items-center justify-between">
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-sm font-medium text-slate-600 mr-2">Filter by level:</span>
                {['Professional', 'Intermediate', 'Beginner', 'Unknown'].map(level => (
                  <button
                    key={level}
                    onClick={() => {
                      setPlayerFilters(prev => 
                        prev.includes(level) 
                          ? prev.filter(l => l !== level)
                          : [...prev, level]
                      )
                    }}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 shadow-md ${
                      playerFilters.includes(level)
                        ? level === 'Professional' 
                          ? 'bg-gradient-to-r from-red-500 to-red-600 text-white border border-red-300'
                          : level === 'Intermediate'
                          ? 'bg-gradient-to-r from-green-500 to-green-600 text-white border border-green-300'
                          : level === 'Beginner'
                          ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white border border-blue-300'
                          : 'bg-gradient-to-r from-slate-500 to-slate-600 text-white border border-slate-300'
                        : 'bg-white/50 text-slate-500 border border-slate-300 hover:bg-white/80'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
              
              <div className="flex gap-2 items-center">
                <span className="text-sm font-medium text-slate-600 mr-2">Status:</span>
                {['ready', 'standby'].map(state => (
                  <button
                    key={state}
                    onClick={() => {
                      setPlayerStateFilter(prev => 
                        prev.includes(state) 
                          ? prev.filter(s => s !== state)
                          : [...prev, state]
                      )
                    }}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 shadow-sm ${
                      playerStateFilter.includes(state)
                        ? state === 'ready'
                          ? 'bg-green-100 text-green-700 border border-green-300'
                          : 'bg-yellow-100 text-yellow-700 border border-yellow-300'
                        : 'bg-white/50 text-slate-500 border border-slate-300 hover:bg-white/80'
                    }`}
                  >
                    {state.charAt(0).toUpperCase() + state.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Players Grid */}
          {availablePlayers.length > 0 ? (
            <div className="space-y-8">
              {Object.entries(playersByLevel)
                .sort(([a], [b]) => {
                  const order = ['Professional', 'Intermediate', 'Beginner', 'Unknown']
                  return order.indexOf(a) - order.indexOf(b)
                })
                .map(([level, players]) => (
                <div key={level} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-semibold text-slate-700 flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${
                        level === 'Professional' ? 'bg-red-500' :
                        level === 'Intermediate' ? 'bg-green-500' :
                        level === 'Beginner' ? 'bg-blue-500' : 'bg-slate-500'
                      }`}></div>
                      {level} Level
                    </h4>
                    <span className="text-sm text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                      {players.length} player{players.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {players
                      .map(player => (
                        <PlayerCard
                          key={player.id}
                          player={player}
                        />
                      ))
                    }
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
              <h3 className="text-lg font-semibold text-slate-600 mb-2">No players available</h3>
              <p className="text-slate-500">All players are currently assigned to matches or filtered out.</p>
            </div>
          )}
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
                {courts.map(court => (
                  <div key={court.id} className="border border-gray-200 rounded-lg p-2 flex flex-col gap-1 bg-white">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-blue-700 text-sm">{court.name}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ml-2 ${court.status === 'available' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'}`}>{court.status}</span>
                    </div>
                    <div className="flex gap-1 mt-1">
                      <button className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs font-medium hover:bg-blue-100 transition">Edit</button>
                      <button 
                        onClick={() => handleRemoveCourt(court.id)}
                        className="bg-red-50 text-red-700 px-2 py-0.5 rounded text-xs font-medium hover:bg-red-100 transition"
                      >
                        Delete
                      </button>
                      {court.status === 'occupied' && (
                        <Link href="/match/1" className="bg-green-50 text-green-700 px-2 py-0.5 rounded text-xs font-medium hover:bg-green-100 transition">View</Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <button 
                onClick={handleAddCourt}
                className="mt-2 bg-blue-600 text-white px-3 py-1.5 rounded text-sm font-medium hover:bg-blue-700 transition self-start"
              >
                Add Court
              </button>
            </div>
            {/* List of Players in Ready and Standby */}
            <div className="bg-gray-50 rounded-lg p-4 shadow-sm flex flex-col gap-2">
              <div className="font-semibold text-base mb-1">Players Management</div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="font-medium text-green-700 mb-1 text-sm">Ready</div>
                  {players.filter(p => p.state === 'ready').map(p => (
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
                  {players.filter(p => p.state === 'standby').map(p => (
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
