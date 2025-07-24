// Register page for Match Marking. Allows users to create an account with email, password, and name.
import { useState } from "react"
import { useRouter } from "next/router"
import Image from "next/image"

export default function Register() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    // TODO: Replace with real API call
    if (!email || !password || !name) {
      setError("All fields are required")
      setLoading(false)
      return
    }
    if (!email.includes("@")) {
      setError("Invalid email address")
      setLoading(false)
      return
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      setLoading(false)
      return
    }
    // Simulate API call
    setTimeout(() => {
      setSuccess(true)
      setLoading(false)
      setTimeout(() => router.push("/login"), 1500)
    }, 1000)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <div className="bg-white p-8 rounded-2xl shadow-xl flex flex-col items-center gap-8 w-full max-w-md animate-fade-in">
        <Image
          src="/next.svg"
          alt="Match Marking Logo"
          width={80}
          height={80}
          className="mb-2"
          priority
        />
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 mb-2 text-center">
          Register for Match Marking
        </h1>
        <form onSubmit={handleRegister} className="flex flex-col gap-4 w-full">
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={e => setName(e.target.value)}
            className="border border-gray-200 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            autoComplete="name"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="border border-gray-200 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            autoComplete="email"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="border border-gray-200 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            autoComplete="new-password"
          />
          {error && <div className="text-red-500 text-sm text-center">{error}</div>}
          {success && <div className="text-green-600 text-sm text-center">Registration successful! Redirecting...</div>}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white rounded-full py-2 font-semibold hover:bg-blue-700 transition disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
        <div className="w-full text-center mt-4">
          <a href="/login" className="text-blue-600 hover:underline text-sm font-medium">Already have an account? Sign in</a>
        </div>
      </div>
      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.7s cubic-bezier(0.4,0,0.2,1) both;
        }
      `}</style>
    </div>
  )
} 