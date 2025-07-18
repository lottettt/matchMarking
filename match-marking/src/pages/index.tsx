// Home dashboard for Match Marking. Shows welcome, active matches, 3D preview, and quick actions.
import { useSession } from "next-auth/react"
import { useRouter } from "next/router"
import Image from "next/image"
import { useEffect, useState } from "react"

type Player = { id: string; name: string; state: string; image: string; rank: number, team?: number }
type Court = { id: string; name: string; status: string }
type Match = { id: string; name: string; status: string; players: Player[]; court: Court | null }

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
  }
]

// Mock courts and players for admin view
const mockCourts: Court[] = [
  { id: "c1", name: "Court 1", status: "occupied" },
  { id: "c2", name: "Court 2", status: "occupied" },
  { id: "c3", name: "Court 3", status: "available" }
]
// Update mockPlayers to include image and rank
const mockPlayers: Player[] = [
  { id: "p1", name: "Alice", state: "ready", image: "/next.svg", rank: 1, team: 1 },
  { id: "p2", name: "Bob", state: "standby", image: "/next.svg", rank: 2, team: 1 },
  { id: "p3", name: "Carol", state: "ready", image: "/next.svg", rank: 3, team: 2 },
  { id: "p4", name: "Dave", state: "standby", image: "/next.svg", rank: 4, team: 2 }
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
  // Number of slots per team
  const TEAM_SIZE = 2
  // Drag and drop handlers (mocked)
  const [draggedPlayer, setDraggedPlayer] = useState<Player | null>(null)
  const [draggedCourt, setDraggedCourt] = useState<Court | null>(null)
  const handlePlayerDragStart = (player: Player) => setDraggedPlayer(player)
  const handleCourtDragStart = (court: Court) => setDraggedCourt(court)
  // Assign player to a team slot
  const handleTeamSlotDrop = (matchId: string, team: number, slotIdx: number) => {
    if (draggedPlayer) {
      setMatches(matches => matches.map(m => {
        if (m.id !== matchId) return m
        // Remove player from any team in this match
        let newPlayers = m.players.filter(p => p.id !== draggedPlayer.id)
        // Assign to this team and slot
        const playerWithTeam = { ...draggedPlayer, team }
        // Fill up to slotIdx with nulls if needed
        const teamPlayers: (Player | null)[] = newPlayers.filter(p => p.team === team)
        while (teamPlayers.length < slotIdx) teamPlayers.push(null)
        // Insert player at slotIdx
        teamPlayers[slotIdx] = playerWithTeam
        // Remove all players of this team from newPlayers, then add back the new teamPlayers
        newPlayers = newPlayers.filter(p => p.team !== team)
        newPlayers = [...newPlayers, ...teamPlayers.filter(Boolean) as Player[]]
        // Keep other team as is
        return { ...m, players: newPlayers }
      }))
      setDraggedPlayer(null)
    }
  }
  const handleMatchDropCourt = (matchId: string) => {
    if (draggedCourt) {
      setMatches(matches => matches.map(m => m.id === matchId
        ? { ...m, court: draggedCourt }
        : m))
      setDraggedCourt(null)
    }
  }

  // Compute available players (not in any match)
  const assignedPlayerIds = new Set(matches.flatMap(m => m.players.map(p => p.id)))
  const availablePlayers = mockPlayers.filter(p => !assignedPlayerIds.has(p.id))

  // Helper to get badge color by rank
  const getRankColor = (rank: number) => {
    if (rank === 1) return 'bg-green-100 text-green-700'
    if (rank === 2) return 'bg-blue-100 text-blue-700'
    if (rank === 3) return 'bg-yellow-100 text-yellow-700'
    return 'bg-red-100 text-red-700'
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center px-4 py-8">
      <div className="w-full max-w-3xl flex flex-col gap-8">
        {/* Welcome Section */}
        <div className="flex items-center gap-4">
          <Image src="/next.svg" alt="User Avatar" width={48} height={48} className="rounded-full" />
          <div>
            <h2 className="text-xl font-bold text-gray-900">Welcome{session?.user?.name ? `, ${session.user.name}` : "!"}</h2>
            <div className="text-gray-500 text-sm">Ready to manage your matches?</div>
          </div>
        </div>

        {/* Matches Section (now at the top) */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold">Matches</h3>
            <button onClick={handleAddMatch} className="bg-blue-600 text-white px-4 py-2 rounded-full font-semibold hover:bg-blue-700 transition">Create Match</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {matches.map(match => (
              <div
                key={match.id}
                className="border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col gap-2 bg-white min-h-[120px]"
                onDragOver={e => e.preventDefault()}
                onDrop={e => {
                  if (draggedPlayer) handleTeamSlotDrop(match.id, 1, 0) // Default to team 1 slot 0
                  if (draggedCourt) handleMatchDropCourt(match.id)
                }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-blue-700 text-lg">{match.name}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full ml-2 bg-blue-50 text-blue-700">{match.status}</span>
                </div>
                <div className="text-xs text-gray-400 mb-1 flex items-center gap-2">
                  Court: {match.court ? (
                    <>
                      {match.court.name}
                      <button onClick={() => setMatches(matches => matches.map(m => m.id === match.id ? { ...m, court: null } : m))} className="ml-1 bg-red-50 text-red-700 px-1 py-0.5 rounded-full text-xs font-medium hover:bg-red-100 transition">Remove</button>
                    </>
                  ) : <span className="italic text-gray-300">(none)</span>}
                </div>
                <div className="flex flex-col gap-1">
                  {/* Team 1 */}
                  <div className="flex flex-wrap gap-1 items-center">
                    <span className="font-bold text-xs text-blue-700 mr-2">Team 1:</span>
                    {[...Array(TEAM_SIZE)].map((_, idx) => {
                      const teamPlayers = match.players.filter(p => p.team === 1)
                      const player = teamPlayers[idx]
                      return player ? (
                        <span key={player.id} className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getRankColor(player.rank)}`}
                          draggable
                          onDragStart={() => handlePlayerDragStart(player)}
                        >
                          {player.name}
                          <button onClick={() => setMatches(matches => matches.map(m => m.id === match.id ? { ...m, players: m.players.filter(pl => pl.id !== player.id) } : m))} className="ml-1 bg-red-50 text-red-700 px-1 py-0.5 rounded-full text-xs font-medium hover:bg-red-100 transition">&times;</button>
                        </span>
                      ) : (
                        <span
                          key={"empty-1-" + idx}
                          className="inline-flex items-center px-4 py-0.5 rounded-full text-xs font-medium border-2 border-dashed border-gray-300 text-gray-300 bg-white min-w-[48px] justify-center"
                          onDragOver={e => e.preventDefault()}
                          onDrop={e => handleTeamSlotDrop(match.id, 1, idx)}
                        >
                          Empty
                        </span>
                      )
                    })}
                  </div>
                  {/* Team 2 */}
                  <div className="flex flex-wrap gap-1 items-center">
                    <span className="font-bold text-xs text-red-700 mr-2">Team 2:</span>
                    {[...Array(TEAM_SIZE)].map((_, idx) => {
                      const teamPlayers = match.players.filter(p => p.team === 2)
                      const player = teamPlayers[idx]
                      return player ? (
                        <span key={player.id} className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getRankColor(player.rank)}`}
                          draggable
                          onDragStart={() => handlePlayerDragStart(player)}
                        >
                          {player.name}
                          <button onClick={() => setMatches(matches => matches.map(m => m.id === match.id ? { ...m, players: m.players.filter(pl => pl.id !== player.id) } : m))} className="ml-1 bg-red-50 text-red-700 px-1 py-0.5 rounded-full text-xs font-medium hover:bg-red-100 transition">&times;</button>
                        </span>
                      ) : (
                        <span
                          key={"empty-2-" + idx}
                          className="inline-flex items-center px-4 py-0.5 rounded-full text-xs font-medium border-2 border-dashed border-gray-300 text-gray-300 bg-white min-w-[48px] justify-center"
                          onDragOver={e => e.preventDefault()}
                          onDrop={e => handleTeamSlotDrop(match.id, 2, idx)}
                        >
                          Empty
                        </span>
                      )
                    })}
                  </div>
                </div>
                <div className="text-xs text-gray-300 mt-2">Drag player/court here</div>
              </div>
            ))}
          </div>
        </div>

        {/* Player List (compact chips/badges, visible to all users) */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-2">Players</h3>
          <div className="flex flex-wrap gap-2">
            {availablePlayers.map(player => (
              <span
                key={player.id}
                className={`relative inline-flex items-center px-3 py-1 rounded-full text-xs font-medium cursor-pointer
                  ${player.state === 'ready' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}
                draggable
                onDragStart={() => handlePlayerDragStart(player)}
              >
                {player.name}
                <span className="absolute left-1/2 -translate-x-1/2 mt-7 z-10 hidden group-hover:block bg-white border border-gray-300 rounded px-2 py-1 text-xs shadow whitespace-nowrap">
                  {player.name} <span className="text-gray-400">Rank #{player.rank}</span>
                </span>
              </span>
            ))}
          </div>
        </div>

        {/* Court Cards (visible to all users) */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-2">Courts</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {courts.map(court => (
              <div
                key={court.id}
                className="border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col gap-2 bg-white"
                draggable
                onDragStart={() => handleCourtDragStart(court)}
              >
                <div className="flex items-center gap-2">
                  <span className="font-bold text-blue-700 text-lg">{court.name}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ml-2 ${court.status === 'available' ? 'bg-green-100 text-green-700' : court.status === 'occupied' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-200 text-gray-500'}`}>{court.status}</span>
                  <button onClick={() => handleRemoveCourt(court.id)} className="ml-auto bg-red-50 text-red-700 px-2 py-0.5 rounded-full text-xs font-medium hover:bg-red-100 transition">Remove</button>
                </div>
              </div>
            ))}
          </div>
          <button onClick={handleAddCourt} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-full font-semibold hover:bg-blue-700 transition">Add Court</button>
        </div>

        {/* Admin-only: Court and Player Management */}
        {getUserRole() === 'admin' && (
          <>
            {/* List of Courts */}
            <div className="bg-gray-50 rounded-xl p-6 shadow flex flex-col gap-3">
              <div className="font-semibold text-lg mb-2">Courts Management</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mockCourts.map(court => (
                  <div key={court.id} className="border border-gray-200 rounded-lg p-3 flex flex-col gap-1 bg-white">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-blue-700">{court.name}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ml-2 ${court.status === 'available' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'}`}>{court.status}</span>
                    </div>
                    <div className="flex gap-2 mt-2">
                      <button className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium hover:bg-blue-100 transition">Edit</button>
                      <button className="bg-red-50 text-red-700 px-3 py-1 rounded-full text-xs font-medium hover:bg-red-100 transition">Delete</button>
                      {court.status === 'occupied' && (
                        <a href="/match/1" className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-medium hover:bg-green-100 transition">View</a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-full font-semibold hover:bg-blue-700 transition self-start">Add Court</button>
            </div>
            {/* List of Players in Ready and Standby */}
            <div className="bg-gray-50 rounded-xl p-6 shadow flex flex-col gap-3">
              <div className="font-semibold text-lg mb-2">Players Management</div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="font-bold text-green-700 mb-1">Ready</div>
                  {mockPlayers.filter(p => p.state === 'ready').map(p => (
                    <div key={p.id} className="flex items-center gap-2 justify-between bg-white border border-gray-200 rounded px-2 py-1 mb-1">
                      <span>{p.name}</span>
                      <div className="flex gap-1">
                        <button className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full text-xs font-medium hover:bg-blue-100 transition">Edit</button>
                        <button className="bg-red-50 text-red-700 px-2 py-0.5 rounded-full text-xs font-medium hover:bg-red-100 transition">Remove</button>
                      </div>
                    </div>
                  ))}
                </div>
                <div>
                  <div className="font-bold text-yellow-700 mb-1">Standby</div>
                  {mockPlayers.filter(p => p.state === 'standby').map(p => (
                    <div key={p.id} className="flex items-center gap-2 justify-between bg-white border border-gray-200 rounded px-2 py-1 mb-1">
                      <span>{p.name}</span>
                      <div className="flex gap-1">
                        <button className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full text-xs font-medium hover:bg-blue-100 transition">Edit</button>
                        <button className="bg-red-50 text-red-700 px-2 py-0.5 rounded-full text-xs font-medium hover:bg-red-100 transition">Remove</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-full font-semibold hover:bg-blue-700 transition self-start">Add Player</button>
            </div>
          </>
        )}

        {/* Quick Actions */}
        <div className="flex gap-4 flex-wrap">
          <button className="bg-blue-600 text-white px-5 py-2 rounded-full font-semibold hover:bg-blue-700 transition">Create Match</button>
          <button className="bg-gray-100 text-gray-800 px-5 py-2 rounded-full font-semibold hover:bg-gray-200 transition">Join Queue</button>
          <button className="bg-gray-100 text-gray-800 px-5 py-2 rounded-full font-semibold hover:bg-gray-200 transition">View History</button>
        </div>
      </div>
    </div>
  )
}
