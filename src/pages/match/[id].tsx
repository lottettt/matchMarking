// Match Details page for Match Marking. Shows match info, players, scores, and 3D court placeholder.
import { useRouter } from "next/router"
import Link from "next/link"
import { useEffect, useState } from "react"

// Mock match data
const mockMatch = {
  id: "1",
  name: "Court 1",
  status: "Ongoing",
  players: [
    { id: "a", name: "Alice", team: 1 },
    { id: "b", name: "Bob", team: 1 },
    { id: "c", name: "Carol", team: 2 },
    { id: "d", name: "Dave", team: 2 }
  ],
  score: { team1: 15, team2: 13 }
}

export default function MatchDetails() {
  const router = useRouter()
  const { id } = router.query
  const [match, setMatch] = useState<typeof mockMatch | null>(null)

  useEffect(() => {
    // In real app, fetch match by id
    setMatch(mockMatch)
  }, [id])

  if (!match) return <div className="min-h-screen flex items-center justify-center">Loading...</div>

  return (
    <div className="min-h-screen bg-white flex flex-col items-center px-4 py-8">
      <div className="w-full max-w-2xl flex flex-col gap-8">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-blue-600 hover:underline text-sm">&larr; Back to Dashboard</Link>
          <h1 className="text-2xl font-bold flex-1 text-center">{match.name} <span className="text-base font-normal text-gray-400 ml-2">({match.status})</span></h1>
        </div>
        {/* Players */}
        <div className="bg-gray-50 rounded-xl p-6 shadow flex flex-col gap-2">
          <div className="font-semibold mb-2">Players</div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="font-bold text-blue-700 mb-1">Team 1</div>
              {match.players.filter(p => p.team === 1).map(p => (
                <div key={p.id} className="text-gray-800">{p.name}</div>
              ))}
            </div>
            <div>
              <div className="font-bold text-red-700 mb-1">Team 2</div>
              {match.players.filter(p => p.team === 2).map(p => (
                <div key={p.id} className="text-gray-800">{p.name}</div>
              ))}
            </div>
          </div>
        </div>
        {/* Score */}
        <div className="bg-gray-50 rounded-xl p-6 shadow flex flex-col gap-2 items-center">
          <div className="font-semibold mb-2">Score</div>
          <div className="flex gap-8 items-center text-2xl font-bold">
            <span className="text-blue-700">{match.score.team1}</span>
            <span className="text-gray-400">:</span>
            <span className="text-red-700">{match.score.team2}</span>
          </div>
        </div>
        {/* 3D Court Placeholder */}
        <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center text-gray-400 text-xl font-bold h-64">
          3D Court Component Coming Soon
        </div>
      </div>
    </div>
  )
} 