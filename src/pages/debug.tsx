// Debug page for Match Marking. Includes API test, SQL test, and diagnostics.
import { useState } from "react"

export default function Debug() {
  // API Test State
  const [apiResult, setApiResult] = useState<string | null>(null)
  const [apiLoading, setApiLoading] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)

  // SQL Test State (mocked)
  const [sqlResult, setSqlResult] = useState<string | null>(null)
  const [sqlLoading, setSqlLoading] = useState(false)
  const [sqlError, setSqlError] = useState<string | null>(null)

  // API Test Handler
  const handleApiTest = async () => {
    setApiLoading(true)
    setApiError(null)
    setApiResult(null)
    try {
      const res = await fetch("/api/hello")
      if (!res.ok) throw new Error(`Status ${res.status}`)
      const data = await res.json()
      setApiResult(JSON.stringify(data, null, 2))
    } catch (err: unknown) {
      setApiError(err instanceof Error ? err.message : String(err))
    } finally {
      setApiLoading(false)
    }
  }

  // SQL Test Handler (mocked)
  const handleSqlTest = async () => {
    setSqlLoading(true)
    setSqlError(null)
    setSqlResult(null)
    // Simulate SQL query
    setTimeout(() => {
      setSqlResult("SELECT * FROM matches;\n[ { id: 1, name: 'Court 1', status: 'Ongoing' } ]")
      setSqlLoading(false)
    }, 800)
  }

  // Diagnostics
  const env = {
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_WS_URL: process.env.NEXT_PUBLIC_WS_URL
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center px-4 py-8">
      <div className="w-full max-w-2xl flex flex-col gap-8">
        <h1 className="text-2xl font-bold mb-4">Debug & Diagnostics</h1>

        {/* API Test */}
        <section className="bg-gray-50 rounded-xl p-6 shadow flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-lg">API Test</span>
            <button onClick={handleApiTest} className="ml-auto bg-blue-600 text-white px-4 py-1.5 rounded-full font-medium hover:bg-blue-700 transition disabled:opacity-50" disabled={apiLoading}>
              {apiLoading ? "Testing..." : "Test /api/hello"}
            </button>
          </div>
          {apiResult && <pre className="bg-white border border-gray-200 rounded p-2 text-xs overflow-x-auto">{apiResult}</pre>}
          {apiError && <div className="text-red-500 text-xs">Error: {apiError}</div>}
        </section>

        {/* SQL Test (mocked) */}
        <section className="bg-gray-50 rounded-xl p-6 shadow flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-lg">SQL Test (Mocked)</span>
            <button onClick={handleSqlTest} className="ml-auto bg-blue-600 text-white px-4 py-1.5 rounded-full font-medium hover:bg-blue-700 transition disabled:opacity-50" disabled={sqlLoading}>
              {sqlLoading ? "Running..." : "Run Query"}
            </button>
          </div>
          {sqlResult && <pre className="bg-white border border-gray-200 rounded p-2 text-xs overflow-x-auto">{sqlResult}</pre>}
          {sqlError && <div className="text-red-500 text-xs">Error: {sqlError}</div>}
        </section>

        {/* Diagnostics */}
        <section className="bg-gray-50 rounded-xl p-6 shadow flex flex-col gap-3">
          <span className="font-semibold text-lg">Diagnostics</span>
          <pre className="bg-white border border-gray-200 rounded p-2 text-xs overflow-x-auto">{JSON.stringify(env, null, 2)}</pre>
        </section>
      </div>
    </div>
  )
} 